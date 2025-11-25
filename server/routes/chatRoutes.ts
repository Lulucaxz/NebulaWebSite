import { Router, Request, Response } from "express";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../db";
import { asyncHandler } from "../utils";
import { getSocketServerInstance } from "../socketInstance";
import { isUserActiveInConversation } from "../presenceStore";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

interface ConversationRow extends RowDataPacket {
  id: number;
  name: string;
  tag: string | null;
  is_group: number;
  participant_count: number;
  last_message_preview: string | null;
  last_message_at: Date | string | null;
  created_at: Date | string;
  other_username: string | null;
  other_curso: string | null;
}

interface MessageRow extends RowDataPacket {
  id: number;
  content: string;
  created_at: Date | string;
  author_id: number;
  username: string;
}

interface NotificationRow extends RowDataPacket {
  id: number;
  conversation_id: number;
  message_id: number;
  author_id: number;
  author_name: string;
  conversation_name: string | null;
  content_snapshot: string;
  created_at: Date | string;
}

const router = Router();

const ensureAuthenticated = (req: AuthenticatedRequest, res: Response): number | null => {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    res.status(401).json({ error: "Não autenticado" });
    return null;
  }
  return req.user.id;
};

const normalizeTag = (tag?: string | null, fallback?: string) => {
  const normalized = (tag || "").trim();
  if (normalized.length > 0) {
    return normalized.toUpperCase();
  }
  return fallback ?? "UNIVERSO";
};

router.get(
  "/following",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req as AuthenticatedRequest, res);
    if (!userId) {
      return;
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT u.id, u.username, u.user, u.curso
         FROM usuario_follow f
         JOIN usuario u ON u.id = f.seguido_id
        WHERE f.seguidor_id = ?
        ORDER BY u.username ASC`,
      [userId]
    );

    const followers = rows.map((row) => ({
      id: Number(row.id),
      name: row.username as string,
      handle: row.user as string,
      tag: normalizeTag(row.curso as string | null, "UNIVERSO"),
    }));

    res.json(followers);
  })
);

router.get(
  "/conversations",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req as AuthenticatedRequest, res);
    if (!userId) {
      return;
    }

    const [rows] = await pool.query<ConversationRow[]>(
      `SELECT r.id,
              r.name,
              r.tag,
              r.is_group,
              r.created_at,
              COUNT(DISTINCT p.user_id) AS participant_count,
              MAX(m.created_at) AS last_message_at,
              SUBSTRING_INDEX(MAX(CONCAT(m.created_at, '||', m.content)), '||', -1) AS last_message_preview,
              MAX(CASE WHEN p.user_id <> ? THEN u.username ELSE NULL END) AS other_username,
              MAX(CASE WHEN p.user_id <> ? THEN u.curso ELSE NULL END) AS other_curso
         FROM chat_room r
         JOIN chat_room_participant p ON p.room_id = r.id
         JOIN usuario u ON u.id = p.user_id
         LEFT JOIN chat_message m ON m.room_id = r.id
        WHERE EXISTS (
              SELECT 1 FROM chat_room_participant rp
              WHERE rp.room_id = r.id AND rp.user_id = ?
              )
        GROUP BY r.id
        ORDER BY COALESCE(MAX(m.created_at), r.created_at) DESC`,
      [userId, userId, userId]
    );

    const conversations = rows.map((row) => {
      const isGroup = Boolean(row.is_group);
      const displayName = isGroup ? row.name : (row.other_username ?? row.name);
      const baseTag = isGroup ? row.tag : row.other_curso ?? row.tag;
      return {
        id: Number(row.id),
        name: displayName,
        tag: normalizeTag(baseTag, isGroup ? "GRUPO" : "UNIVERSO"),
        isGroup,
        participantCount: Number(row.participant_count),
        lastMessagePreview: row.last_message_preview,
        lastMessageAt: row.last_message_at ?? row.created_at,
      };
    });

    res.json(conversations);
  })
);

router.post(
  "/conversations",
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = ensureAuthenticated(authReq, res);
    if (!userId) {
      return;
    }

    const { participantIds, name } = req.body as { participantIds?: number[]; name?: string };
    const sanitizedIds = Array.isArray(participantIds)
      ? Array.from(new Set(participantIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0 && id !== userId)))
      : [];

    if (sanitizedIds.length === 0) {
      res.status(400).json({ error: "Selecione pelo menos um participante." });
      return;
    }

    const participantSet = [userId, ...sanitizedIds];
    const isGroup = participantSet.length > 2;
    const trimmedName = (name || "").trim();

    if (isGroup && trimmedName.length === 0) {
      res.status(400).json({ error: "Informe o nome do grupo." });
      return;
    }

    const [userRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, username, curso
         FROM usuario
        WHERE id IN (?)`,
      [participantSet]
    );

    if (userRows.length !== participantSet.length) {
      res.status(400).json({ error: "Participante inválido." });
      return;
    }

    const otherParticipant = userRows.find((row) => Number(row.id) !== userId);
    const fallbackName = trimmedName || "Nova conversa";
    const conversationName = isGroup
      ? trimmedName
      : (otherParticipant?.username as string) ?? fallbackName;
    const conversationTag = isGroup
      ? "GRUPO"
      : normalizeTag((otherParticipant?.curso as string | null) ?? undefined, "UNIVERSO");

    const connection = await pool.getConnection();
    let roomId: number | null = null;

    try {
      await connection.beginTransaction();

      const [insertRoom] = await connection.query<ResultSetHeader>(
        `INSERT INTO chat_room (owner_id, name, tag, is_group)
         VALUES (?, ?, ?, ?)`,
        [userId, conversationName, conversationTag, isGroup ? 1 : 0]
      );
      roomId = insertRoom.insertId;

      const participantInserts = participantSet.map((participantId) =>
        connection.query(`INSERT INTO chat_room_participant (room_id, user_id) VALUES (?, ?)`, [roomId, participantId])
      );
      await Promise.all(participantInserts);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    if (!roomId) {
      res.status(500).json({ error: "Falha ao criar conversa." });
      return;
    }

    res.status(201).json({
      id: roomId,
      name: conversationName,
      tag: conversationTag,
      isGroup,
      participantCount: participantSet.length,
      lastMessagePreview: null,
      lastMessageAt: null,
    });
  })
);

router.get(
  "/conversations/:conversationId",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req as AuthenticatedRequest, res);
    if (!userId) {
      return;
    }

    const conversationId = Number(req.params.conversationId);
    if (!Number.isInteger(conversationId) || conversationId <= 0) {
      res.status(400).json({ error: "Conversa inválida." });
      return;
    }

    const [membership] = await pool.query<RowDataPacket[]>(
      `SELECT 1 FROM chat_room_participant WHERE room_id = ? AND user_id = ? LIMIT 1`,
      [conversationId, userId]
    );

    if (!membership.length) {
      res.status(404).json({ error: "Conversa não encontrada." });
      return;
    }

    const [rows] = await pool.query<ConversationRow[]>(
      `SELECT r.id,
              r.name,
              r.tag,
              r.is_group,
              COUNT(DISTINCT p.user_id) AS participant_count,
              MAX(CASE WHEN p.user_id <> ? THEN u.username ELSE NULL END) AS other_username,
              MAX(CASE WHEN p.user_id <> ? THEN u.curso ELSE NULL END) AS other_curso
         FROM chat_room r
         JOIN chat_room_participant p ON p.room_id = r.id
         JOIN usuario u ON u.id = p.user_id
        WHERE r.id = ?
        GROUP BY r.id
        LIMIT 1`,
      [userId, userId, conversationId]
    );

    if (!rows.length) {
      res.status(404).json({ error: "Conversa não encontrada." });
      return;
    }

    const row = rows[0];

    const isGroup = Boolean(row.is_group);
    const displayName = isGroup ? row.name : (row.other_username ?? row.name);
    const baseTag = isGroup ? row.tag : row.other_curso ?? row.tag;

    res.json({
      id: Number(row.id),
      name: displayName,
      tag: normalizeTag(baseTag, isGroup ? "GRUPO" : "UNIVERSO"),
      isGroup,
      participantCount: Number(row.participant_count),
    });
  })
);

router.get(
  "/conversations/:conversationId/messages",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req as AuthenticatedRequest, res);
    if (!userId) {
      return;
    }

    const conversationId = Number(req.params.conversationId);
    if (!Number.isInteger(conversationId) || conversationId <= 0) {
      res.status(400).json({ error: "Conversa inválida." });
      return;
    }

    const [membership] = await pool.query<RowDataPacket[]>(
      `SELECT 1 FROM chat_room_participant WHERE room_id = ? AND user_id = ? LIMIT 1`,
      [conversationId, userId]
    );

    if (!membership.length) {
      res.status(404).json({ error: "Conversa não encontrada." });
      return;
    }

    const [rows] = await pool.query<MessageRow[]>(
      `SELECT m.id, m.content, m.created_at, m.author_id, u.username
         FROM chat_message m
         JOIN usuario u ON u.id = m.author_id
        WHERE m.room_id = ?
        ORDER BY m.created_at ASC`,
      [conversationId]
    );

    const messages = rows.map((row) => ({
      id: Number(row.id),
      content: row.content,
      createdAt: row.created_at,
      authorId: Number(row.author_id),
      authorName: row.username,
      isMine: Number(row.author_id) === userId,
      roomId: conversationId,
    }));

    res.json(messages);
  })
);

router.post(
  "/conversations/:conversationId/messages",
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = ensureAuthenticated(authReq, res);
    if (!userId) {
      return;
    }

    const conversationId = Number(req.params.conversationId);
    if (!Number.isInteger(conversationId) || conversationId <= 0) {
      res.status(400).json({ error: "Conversa inválida." });
      return;
    }

    const [membership] = await pool.query<RowDataPacket[]>(
      `SELECT 1 FROM chat_room_participant WHERE room_id = ? AND user_id = ? LIMIT 1`,
      [conversationId, userId]
    );

    if (!membership.length) {
      res.status(404).json({ error: "Conversa não encontrada." });
      return;
    }

    const [conversationRows] = await pool.query<RowDataPacket[]>(
      `SELECT name, is_group FROM chat_room WHERE id = ? LIMIT 1`,
      [conversationId]
    );

    if (!conversationRows.length) {
      res.status(404).json({ error: "Conversa não encontrada." });
      return;
    }

    const content = (req.body?.content ?? "").toString().trim();
    if (!content) {
      res.status(400).json({ error: "Mensagem vazia." });
      return;
    }

    const limitedContent = content.slice(0, 2000);

    const [insertResult] = await pool.query<ResultSetHeader>(
      `INSERT INTO chat_message (room_id, author_id, content)
       VALUES (?, ?, ?)`,
      [conversationId, userId, limitedContent]
    );

    const [authorRows] = await pool.query<RowDataPacket[]>(
      `SELECT username FROM usuario WHERE id = ? LIMIT 1`,
      [userId]
    );

    const authorName = authorRows[0]?.username ?? "Você";
    const conversationRecord = conversationRows[0];
    const notificationConversationName = conversationRecord.is_group
      ? (conversationRecord.name as string) || "Conversa"
      : authorName;
    const createdAt = new Date().toISOString();

    const messagePayload = {
      id: insertResult.insertId,
      content: limitedContent,
      createdAt,
      authorId: userId,
      authorName,
      isMine: true,
      roomId: conversationId,
    };

    res.status(201).json(messagePayload);

    const io = getSocketServerInstance();
    io?.to(`chat:${conversationId}`).emit("chat:new-message", { ...messagePayload, isMine: false });

    const [participantRows] = await pool.query<RowDataPacket[]>(
      `SELECT user_id FROM chat_room_participant WHERE room_id = ? AND user_id <> ?`,
      [conversationId, userId]
    );

    for (const participant of participantRows) {
      const participantId = Number(participant.user_id);
      if (isUserActiveInConversation(participantId, conversationId)) {
        continue;
      }
      const [notificationInsert] = await pool.query<ResultSetHeader>(
        `INSERT INTO chat_notification (
           user_id,
           conversation_id,
           message_id,
           author_id,
           conversation_name,
           content_snapshot
         )
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          participantId,
          conversationId,
          messagePayload.id,
          userId,
          notificationConversationName,
          limitedContent.slice(0, 255),
        ]
      );

      const notificationPayload = {
        ...messagePayload,
        isMine: false,
        conversationName: notificationConversationName,
        notificationId: notificationInsert.insertId,
      };

      io?.to(`user:${participantId}`).emit("notification:new-message", notificationPayload);
    }
  })
);

router.get(
  "/notifications",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req as AuthenticatedRequest, res);
    if (!userId) {
      return;
    }

    const [rows] = await pool.query<NotificationRow[]>(
      `SELECT n.id,
              n.conversation_id,
              n.message_id,
              n.author_id,
              u.username AS author_name,
              n.conversation_name,
              n.content_snapshot,
              n.created_at
         FROM chat_notification n
         JOIN usuario u ON u.id = n.author_id
        WHERE n.user_id = ?
        ORDER BY n.created_at DESC
        LIMIT 50`,
      [userId]
    );

    const notifications = rows.map((row) => ({
      id: Number(row.id),
      conversationId: Number(row.conversation_id),
      messageId: Number(row.message_id),
      conversationName: row.conversation_name ?? "",
      authorName: row.author_name,
      content: row.content_snapshot,
      createdAt: row.created_at,
    }));

    res.json(notifications);
  })
);

router.post(
  "/notifications/clear",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req as AuthenticatedRequest, res);
    if (!userId) {
      return;
    }

    await pool.query(`DELETE FROM chat_notification WHERE user_id = ?`, [userId]);

    res.json({ success: true });
  })
);

export default router;
