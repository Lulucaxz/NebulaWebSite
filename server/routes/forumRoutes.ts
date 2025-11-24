import { Router } from "express";
import type { Request, Response } from "express";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../db";
import { asyncHandler } from "../utils";

const router = Router();

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const ASSINATURAS_PERMITIDAS = new Set(["Universo", "Galáxia", "Órbita"]);

// Guarantee forum tables exist so first requests do not fail on freshly cloned DBs
let forumTablesReady: Promise<void> | null = null;

const ensureForumTables = () => {
  if (!forumTablesReady) {
    forumTablesReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS forum_post (
          id INT NOT NULL AUTO_INCREMENT,
          usuario_id INT NULL,
          nome_usuario VARCHAR(100) NOT NULL,
          foto_perfil VARCHAR(1024) NOT NULL,
          assinatura ENUM('Universo','Galáxia','Órbita') NOT NULL DEFAULT 'Universo',
          titulo VARCHAR(200) NOT NULL,
          conteudo TEXT NOT NULL,
          tags LONGTEXT NOT NULL,
          numero_avaliacao DECIMAL(5,2) NOT NULL DEFAULT 0,
          avaliacao_do_usuario VARCHAR(45) NOT NULL DEFAULT 'esteUsuario',
          imagem_url TEXT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          INDEX idx_forum_post_created_at (created_at),
          CONSTRAINT fk_forum_post_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE SET NULL ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        ALTER TABLE forum_post
          MODIFY COLUMN tags LONGTEXT NOT NULL;
      `);

      await pool.query(`
        ALTER TABLE forum_post
          MODIFY COLUMN imagem_url MEDIUMTEXT NULL;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS forum_resposta (
          id BIGINT NOT NULL AUTO_INCREMENT,
          post_id INT NOT NULL,
          parent_id BIGINT NULL,
          usuario_id INT NULL,
          nome_usuario VARCHAR(100) NOT NULL,
          foto_perfil VARCHAR(1024) NOT NULL,
          assinatura ENUM('Universo','Galáxia','Órbita') NOT NULL DEFAULT 'Universo',
          conteudo TEXT NOT NULL,
          imagem_url MEDIUMTEXT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          INDEX idx_resposta_post (post_id),
          INDEX idx_resposta_parent (parent_id),
          CONSTRAINT fk_forum_resposta_post FOREIGN KEY (post_id) REFERENCES forum_post (id) ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT fk_forum_resposta_parent FOREIGN KEY (parent_id) REFERENCES forum_resposta (id) ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT fk_forum_resposta_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE SET NULL ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        ALTER TABLE forum_resposta
          MODIFY COLUMN imagem_url MEDIUMTEXT NULL;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS forum_post_like (
          post_id INT NOT NULL,
          usuario_id INT NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (post_id, usuario_id),
          CONSTRAINT fk_forum_post_like_post FOREIGN KEY (post_id) REFERENCES forum_post (id) ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT fk_forum_post_like_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS forum_resposta_like (
          resposta_id BIGINT NOT NULL,
          usuario_id INT NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (resposta_id, usuario_id),
          CONSTRAINT fk_forum_resposta_like_resposta FOREIGN KEY (resposta_id) REFERENCES forum_resposta (id) ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT fk_forum_resposta_like_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    })().catch((err) => {
      forumTablesReady = null;
      console.error("Erro ao garantir tabelas do fórum", err);
      throw err;
    });
  }

  return forumTablesReady;
};

router.use((_, __, next) => {
  ensureForumTables()
    .then(() => next())
    .catch(next);
});

interface ForumPostRow extends RowDataPacket {
  id: number;
  usuario_id: number | null;
  nome_usuario: string;
  foto_perfil: string;
  assinatura: "Universo" | "Galáxia" | "Órbita";
  titulo: string;
  conteudo: string;
  tags: string | null;
  numero_avaliacao: number | string | null;
  avaliacao_do_usuario: string;
  imagem_url: string | null;
  created_at: Date;
  updated_at: Date;
}

interface ForumReplyRow extends RowDataPacket {
  id: number;
  post_id: number;
  parent_id: number | null;
  usuario_id: number | null;
  nome_usuario: string;
  foto_perfil: string;
  assinatura: "Universo" | "Galáxia" | "Órbita";
  conteudo: string;
  imagem_url: string | null;
  created_at: Date;
  updated_at: Date;
}

interface ReplyNode extends ForumReplyRow {
  children: ReplyNode[];
}

interface ReplyPayload {
  idResposta: number;
  rfotoPerfil: string;
  rnomeUsuario: string;
  assinatura: "Universo" | "Galáxia" | "Órbita";
  rdataHora: string;
  rconteudoComentario: string;
  eDoUsuario: boolean;
  rimagemComentario: string | null;
  arrayRespostasAninhadas: ReplyPayload[];
  usuarioId: number | null;
  likesCount: number;
  usuarioCurtiu: boolean;
}

interface PostLikeCountRow extends RowDataPacket {
  post_id: number;
  total: number;
}

interface ReplyLikeCountRow extends RowDataPacket {
  resposta_id: number;
  total: number;
}

interface PostLikedRow extends RowDataPacket {
  post_id: number;
}

interface ReplyLikedRow extends RowDataPacket {
  resposta_id: number;
}

const collectPostLikeMetadata = async (postIds: number[], currentUserId: number | null) => {
  const counts = new Map<number, number>();
  const liked = new Set<number>();
  if (!postIds.length) {
    return { counts, liked };
  }

  const [countRows] = await pool.query<PostLikeCountRow[]>(
    "SELECT post_id, COUNT(*) AS total FROM forum_post_like WHERE post_id IN (?) GROUP BY post_id",
    [postIds]
  );
  countRows.forEach((row) => {
    counts.set(row.post_id, Number(row.total) || 0);
  });

  if (currentUserId) {
    const [likedRows] = await pool.query<PostLikedRow[]>(
      "SELECT post_id FROM forum_post_like WHERE post_id IN (?) AND usuario_id = ?",
      [postIds, currentUserId]
    );
    likedRows.forEach((row) => liked.add(row.post_id));
  }

  return { counts, liked };
};

const collectReplyLikeMetadata = async (replyIds: number[], currentUserId: number | null) => {
  const counts = new Map<number, number>();
  const liked = new Set<number>();
  if (!replyIds.length) {
    return { counts, liked };
  }

  const [countRows] = await pool.query<ReplyLikeCountRow[]>(
    "SELECT resposta_id, COUNT(*) AS total FROM forum_resposta_like WHERE resposta_id IN (?) GROUP BY resposta_id",
    [replyIds]
  );
  countRows.forEach((row) => {
    counts.set(row.resposta_id, Number(row.total) || 0);
  });

  if (currentUserId) {
    const [likedRows] = await pool.query<ReplyLikedRow[]>(
      "SELECT resposta_id FROM forum_resposta_like WHERE resposta_id IN (?) AND usuario_id = ?",
      [replyIds, currentUserId]
    );
    likedRows.forEach((row) => liked.add(row.resposta_id));
  }

  return { counts, liked };
};

const getPostLikeSummary = async (postId: number, currentUserId: number) => {
  const { counts, liked } = await collectPostLikeMetadata([postId], currentUserId);
  return {
    likesCount: counts.get(postId) ?? 0,
    usuarioCurtiu: liked.has(postId),
  };
};

const getReplyLikeSummary = async (replyId: number, currentUserId: number) => {
  const { counts, liked } = await collectReplyLikeMetadata([replyId], currentUserId);
  return {
    likesCount: counts.get(replyId) ?? 0,
    usuarioCurtiu: liked.has(replyId),
  };
};

const getSessionUserId = (req: Request): number | null => {
  const maybeUser = (req as Request & { user?: { id?: number } }).user;
  const rawId = maybeUser?.id;
  return typeof rawId === "number" ? rawId : null;
};

const ensureValidAssinatura = (valor: unknown): "Universo" | "Galáxia" | "Órbita" => {
  if (typeof valor === "string" && ASSINATURAS_PERMITIDAS.has(valor)) {
    return valor as "Universo" | "Galáxia" | "Órbita";
  }
  return "Universo";
};

const parseTags = (valor: unknown): string[] => {
  if (Array.isArray(valor)) {
    return valor.filter((item): item is string => typeof item === "string");
  }
  if (typeof valor === "string" && valor.trim()) {
    try {
      const parsed = JSON.parse(valor);
      return Array.isArray(parsed)
        ? parsed.filter((item: unknown): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  }
  return [];
};

const serializeTags = (tags: string[]): string => JSON.stringify(tags);

const getLimitFromQuery = (valor: unknown): number => {
  const parsed = Number(valor);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }
  return Math.min(parsed, MAX_LIMIT);
};

const buildReplyTrees = (rows: ForumReplyRow[]): Map<number, ReplyNode[]> => {
  const nodes = new Map<number, ReplyNode>();
  rows.forEach((row) => {
    nodes.set(row.id, { ...row, children: [] });
  });

  const rootsByPost = new Map<number, ReplyNode[]>();

  rows.forEach((row) => {
    const node = nodes.get(row.id);
    if (!node) {
      return;
    }

    if (row.parent_id != null) {
      const parent = nodes.get(row.parent_id);
      if (parent) {
        parent.children.push(node);
      }
      return;
    }

    const list = rootsByPost.get(row.post_id) ?? [];
    list.push(node);
    rootsByPost.set(row.post_id, list);
  });

  return rootsByPost;
};

const mapReplyNode = (
  node: ReplyNode,
  currentUserId: number | null,
  replyLikeCounts: Map<number, number>,
  repliesLikedByCurrentUser: Set<number>
): ReplyPayload => ({
  idResposta: node.id,
  rfotoPerfil: node.foto_perfil,
  rnomeUsuario: node.nome_usuario,
  assinatura: node.assinatura,
  rdataHora: new Date(node.created_at).toISOString(),
  rconteudoComentario: node.conteudo,
  eDoUsuario: Boolean(currentUserId && node.usuario_id && currentUserId === node.usuario_id),
  rimagemComentario: node.imagem_url,
  arrayRespostasAninhadas: node.children.map((child) =>
    mapReplyNode(child, currentUserId, replyLikeCounts, repliesLikedByCurrentUser)
  ),
  usuarioId: node.usuario_id,
  likesCount: replyLikeCounts.get(node.id) ?? 0,
  usuarioCurtiu: repliesLikedByCurrentUser.has(node.id),
});

const mapPostRow = (
  row: ForumPostRow,
  replyRoots: ReplyNode[] | undefined,
  currentUserId: number | null,
  postLikeCounts: Map<number, number>,
  postsLikedByCurrentUser: Set<number>,
  replyLikeCounts: Map<number, number>,
  repliesLikedByCurrentUser: Set<number>
) => ({
  idComentario: row.id,
  temaPergunta: row.titulo,
  nomeUsuario: row.nome_usuario,
  assinatura: row.assinatura,
  dataHora: new Date(row.created_at).toISOString(),
  conteudoComentario: row.conteudo,
  numeroAvaliacao: postLikeCounts.get(row.id) ?? Number(row.numero_avaliacao ?? 0),
  avaliacaoDoUsuario: row.avaliacao_do_usuario,
  eDoUsuario: Boolean(currentUserId && row.usuario_id && currentUserId === row.usuario_id),
  fotoPerfil: row.foto_perfil,
  tags: parseTags(row.tags ?? "[]"),
  imagemComentario: row.imagem_url,
  arrayRespostas: (replyRoots ?? []).map((reply) =>
    mapReplyNode(reply, currentUserId, replyLikeCounts, repliesLikedByCurrentUser)
  ),
  usuarioId: row.usuario_id,
  usuarioCurtiu: postsLikedByCurrentUser.has(row.id),
  foiEditado: row.updated_at && row.updated_at.getTime() !== row.created_at.getTime(),
});

const fetchPostById = async (postId: number, currentUserId: number | null) => {
  const [postRows] = await pool.query<ForumPostRow[]>(
    "SELECT * FROM forum_post WHERE id = ?",
    [postId]
  );

  if (!postRows.length) {
    return null;
  }

  const [replyRows] = await pool.query<ForumReplyRow[]>(
    "SELECT * FROM forum_resposta WHERE post_id = ? ORDER BY created_at ASC, id ASC",
    [postId]
  );

  const replyTrees = buildReplyTrees(replyRows);
  const replyIds = replyRows.map((row) => row.id);
  const [postLikesMeta, replyLikesMeta] = await Promise.all([
    collectPostLikeMetadata([postId], currentUserId),
    collectReplyLikeMetadata(replyIds, currentUserId),
  ]);

  return mapPostRow(
    postRows[0],
    replyTrees.get(postId),
    currentUserId,
    postLikesMeta.counts,
    postLikesMeta.liked,
    replyLikesMeta.counts,
    replyLikesMeta.liked
  );
};

const fetchReplyById = async (replyId: number, currentUserId: number | null) => {
  const [rows] = await pool.query<ForumReplyRow[]>(
    "SELECT * FROM forum_resposta WHERE id = ?",
    [replyId]
  );

  if (!rows.length) {
    return null;
  }

  const node: ReplyNode = { ...rows[0], children: [] };
  const replyLikesMeta = await collectReplyLikeMetadata([replyId], currentUserId);
  return mapReplyNode(node, currentUserId, replyLikesMeta.counts, replyLikesMeta.liked);
};

router.get(
  "/posts",
  asyncHandler(async (req: Request, res: Response) => {
    const limit = getLimitFromQuery(req.query.limit);
    const cursorRaw = req.query.cursor;

    const params: Array<Date | number> = [];
    let whereClause = "";

    if (cursorRaw) {
      const cursorValue = Array.isArray(cursorRaw) ? cursorRaw[0] : cursorRaw;
      if (typeof cursorValue !== "string") {
        res.status(400).json({ error: "Cursor inválido" });
        return;
      }
      const cursorDate = new Date(cursorValue);
      if (Number.isNaN(cursorDate.getTime())) {
        res.status(400).json({ error: "Cursor inválido" });
        return;
      }
      whereClause = "WHERE fp.created_at < ?";
      params.push(cursorDate);
    }

    params.push(limit + 1);

    const [rows] = await pool.query<ForumPostRow[]>(
      `SELECT fp.* FROM forum_post fp ${whereClause} ORDER BY fp.created_at DESC, fp.id DESC LIMIT ?`,
      params
    );

    const hasMore = rows.length > limit;
    const posts = hasMore ? rows.slice(0, limit) : rows;
    const nextCursorDate = hasMore && posts.length ? posts[posts.length - 1].created_at : null;

    let replyRows: ForumReplyRow[] = [];
    if (posts.length) {
      const postIds = posts.map((post) => post.id);
      const [rawReplies] = await pool.query<ForumReplyRow[]>(
        `SELECT fr.* FROM forum_resposta fr WHERE fr.post_id IN (?) ORDER BY fr.created_at ASC, fr.id ASC`,
        [postIds]
      );
      replyRows = rawReplies;
    }

    const replyTrees = buildReplyTrees(replyRows);
    const currentUserId = getSessionUserId(req);
    const postIds = posts.map((post) => post.id);
    const replyIds = replyRows.map((reply) => reply.id);
    const [postLikesMeta, replyLikesMeta] = await Promise.all([
      collectPostLikeMetadata(postIds, currentUserId),
      collectReplyLikeMetadata(replyIds, currentUserId),
    ]);

    const items = posts.map((post) =>
      mapPostRow(
        post,
        replyTrees.get(post.id),
        currentUserId,
        postLikesMeta.counts,
        postLikesMeta.liked,
        replyLikesMeta.counts,
        replyLikesMeta.liked
      )
    );

    res.json({
      items,
      nextCursor: nextCursorDate ? new Date(nextCursorDate).toISOString() : null,
      hasMore,
    });
  })
);

router.post(
  "/posts",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      temaPergunta,
      conteudoComentario,
      tags,
      imagemComentario,
      assinatura,
      numeroAvaliacao,
      avaliacaoDoUsuario,
      nomeUsuario,
      fotoPerfil,
      usuarioId,
    } = req.body as Record<string, unknown>;

    const titulo = typeof temaPergunta === "string" ? temaPergunta.trim() : "";
    const conteudo = typeof conteudoComentario === "string" ? conteudoComentario.trim() : "";
    const listaTags = parseTags(tags);

    if (!titulo || !conteudo || listaTags.length === 0) {
      res.status(400).json({ error: "Título, conteúdo e ao menos uma tag são obrigatórios" });
      return;
    }

    const finalAssinatura = ensureValidAssinatura(assinatura);
    const finalNumeroAvaliacao = Number(numeroAvaliacao ?? 0) || 0;
    const finalAvaliacaoDoUsuario = typeof avaliacaoDoUsuario === "string" && avaliacaoDoUsuario.trim()
      ? avaliacaoDoUsuario.trim()
      : "esteUsuario";
    const finalNome = typeof nomeUsuario === "string" && nomeUsuario.trim()
      ? nomeUsuario.trim()
      : "Usuário Nebula";
    const finalFoto = typeof fotoPerfil === "string" && fotoPerfil.trim()
      ? fotoPerfil.trim()
      : "/icones-usuarios/FotoPerfil12.jpg";
    const finalImagem = typeof imagemComentario === "string" ? imagemComentario : null;

    const sessionUserId = getSessionUserId(req);
    const finalUsuarioId = typeof usuarioId === "number" ? usuarioId : sessionUserId;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO forum_post
        (usuario_id, nome_usuario, foto_perfil, assinatura, titulo, conteudo, tags, numero_avaliacao, avaliacao_do_usuario, imagem_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        finalUsuarioId ?? null,
        finalNome,
        finalFoto,
        finalAssinatura,
        titulo,
        conteudo,
        serializeTags(listaTags),
        finalNumeroAvaliacao,
        finalAvaliacaoDoUsuario,
        finalImagem,
      ]
    );

    const created = await fetchPostById(result.insertId, getSessionUserId(req));
    if (!created) {
      res.status(500).json({ error: "Não foi possível carregar o comentário recém-criado" });
      return;
    }
    res.status(201).json(created);
  })
);

router.put(
  "/posts/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const postId = Number(req.params.id);
    if (!Number.isFinite(postId)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const { temaPergunta, conteudoComentario, tags, imagemComentario } = req.body as Record<string, unknown>;
    const titulo = typeof temaPergunta === "string" ? temaPergunta.trim() : "";
    const conteudo = typeof conteudoComentario === "string" ? conteudoComentario.trim() : "";
    const listaTags = parseTags(tags);

    if (!titulo || !conteudo || listaTags.length === 0) {
      res.status(400).json({ error: "Título, conteúdo e tags são obrigatórios" });
      return;
    }

    const finalImagem = typeof imagemComentario === "string" ? imagemComentario : null;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE forum_post
         SET titulo = ?, conteudo = ?, tags = ?, imagem_url = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [titulo, conteudo, serializeTags(listaTags), finalImagem, postId]
    );

    if (!result.affectedRows) {
      res.status(404).json({ error: "Comentário não encontrado" });
      return;
    }

    const updated = await fetchPostById(postId, getSessionUserId(req));
    if (!updated) {
      res.status(500).json({ error: "Erro ao carregar comentário atualizado" });
      return;
    }
    res.json(updated);
  })
);

router.delete(
  "/posts/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const postId = Number(req.params.id);
    if (!Number.isFinite(postId)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM forum_post WHERE id = ?",
      [postId]
    );

    if (!result.affectedRows) {
      res.status(404).json({ error: "Comentário não encontrado" });
      return;
    }

    res.json({ success: true });
  })
);

router.post(
  "/posts/:postId/replies",
  asyncHandler(async (req: Request, res: Response) => {
    const postId = Number(req.params.postId);
    if (!Number.isFinite(postId)) {
      res.status(400).json({ error: "ID de postagem inválido" });
      return;
    }

    const {
      conteudoComentario,
      imagemComentario,
      assinatura,
      nomeUsuario,
      fotoPerfil,
      parentRespostaId,
      usuarioId,
    } = req.body as Record<string, unknown>;

    const conteudo = typeof conteudoComentario === "string" ? conteudoComentario.trim() : "";
    if (!conteudo) {
      res.status(400).json({ error: "Conteúdo da resposta é obrigatório" });
      return;
    }

    const [postExists] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM forum_post WHERE id = ?",
      [postId]
    );
    if (!postExists.length) {
      res.status(404).json({ error: "Postagem não encontrada" });
      return;
    }

    let parentId: number | null = null;
    if (parentRespostaId != null) {
      const parsedParent = Number(parentRespostaId);
      if (!Number.isFinite(parsedParent)) {
        res.status(400).json({ error: "ID de resposta pai inválido" });
        return;
      }
      const [parentRows] = await pool.query<ForumReplyRow[]>(
        "SELECT id, post_id FROM forum_resposta WHERE id = ?",
        [parsedParent]
      );
      if (!parentRows.length || parentRows[0].post_id !== postId) {
        res.status(400).json({ error: "Resposta pai não pertence a esta postagem" });
        return;
      }
      parentId = parsedParent;
    }

    const finalAssinatura = ensureValidAssinatura(assinatura);
    const finalNome = typeof nomeUsuario === "string" && nomeUsuario.trim()
      ? nomeUsuario.trim()
      : "Usuário Nebula";
    const finalFoto = typeof fotoPerfil === "string" && fotoPerfil.trim()
      ? fotoPerfil.trim()
      : "/icones-usuarios/FotoPerfil12.jpg";
    const finalImagem = typeof imagemComentario === "string" ? imagemComentario : null;

    const sessionUserId = getSessionUserId(req);
    const finalUsuarioId = typeof usuarioId === "number" ? usuarioId : sessionUserId;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO forum_resposta
        (post_id, parent_id, usuario_id, nome_usuario, foto_perfil, assinatura, conteudo, imagem_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [postId, parentId, finalUsuarioId ?? null, finalNome, finalFoto, finalAssinatura, conteudo, finalImagem]
    );

    const created = await fetchReplyById(result.insertId, getSessionUserId(req));
    if (!created) {
      res.status(500).json({ error: "Não foi possível carregar a resposta recém-criada" });
      return;
    }
    res.status(201).json(created);
  })
);

router.put(
  "/replies/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const replyId = Number(req.params.id);
    if (!Number.isFinite(replyId)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const { conteudoComentario, imagemComentario } = req.body as Record<string, unknown>;
    const conteudo = typeof conteudoComentario === "string" ? conteudoComentario.trim() : "";
    if (!conteudo) {
      res.status(400).json({ error: "Conteúdo é obrigatório" });
      return;
    }

    const finalImagem = typeof imagemComentario === "string" ? imagemComentario : null;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE forum_resposta
         SET conteudo = ?, imagem_url = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [conteudo, finalImagem, replyId]
    );

    if (!result.affectedRows) {
      res.status(404).json({ error: "Resposta não encontrada" });
      return;
    }

    const updated = await fetchReplyById(replyId, getSessionUserId(req));
    if (!updated) {
      res.status(500).json({ error: "Erro ao carregar a resposta atualizada" });
      return;
    }
    res.json(updated);
  })
);

router.delete(
  "/replies/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const replyId = Number(req.params.id);
    if (!Number.isFinite(replyId)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM forum_resposta WHERE id = ?",
      [replyId]
    );

    if (!result.affectedRows) {
      res.status(404).json({ error: "Resposta não encontrada" });
      return;
    }

    res.json({ success: true });
  })
);

router.post(
  "/posts/:id/likes",
  asyncHandler(async (req: Request, res: Response) => {
    const postId = Number(req.params.id);
    if (!Number.isFinite(postId)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const userId = getSessionUserId(req);
    if (!userId) {
      res.status(401).json({ error: "É necessário estar autenticado para curtir" });
      return;
    }

    const [exists] = await pool.query<RowDataPacket[]>("SELECT id FROM forum_post WHERE id = ?", [postId]);
    if (!exists.length) {
      res.status(404).json({ error: "Comentário não encontrado" });
      return;
    }

    await pool.query(
      `INSERT INTO forum_post_like (post_id, usuario_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP`,
      [postId, userId]
    );

    const summary = await getPostLikeSummary(postId, userId);
    res.json(summary);
  })
);

router.delete(
  "/posts/:id/likes",
  asyncHandler(async (req: Request, res: Response) => {
    const postId = Number(req.params.id);
    if (!Number.isFinite(postId)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const userId = getSessionUserId(req);
    if (!userId) {
      res.status(401).json({ error: "É necessário estar autenticado para curtir" });
      return;
    }

    await pool.query("DELETE FROM forum_post_like WHERE post_id = ? AND usuario_id = ?", [postId, userId]);
    const summary = await getPostLikeSummary(postId, userId);
    res.json(summary);
  })
);

router.post(
  "/replies/:id/likes",
  asyncHandler(async (req: Request, res: Response) => {
    const replyId = Number(req.params.id);
    if (!Number.isFinite(replyId)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const userId = getSessionUserId(req);
    if (!userId) {
      res.status(401).json({ error: "É necessário estar autenticado para curtir" });
      return;
    }

    const [exists] = await pool.query<RowDataPacket[]>("SELECT id FROM forum_resposta WHERE id = ?", [replyId]);
    if (!exists.length) {
      res.status(404).json({ error: "Resposta não encontrada" });
      return;
    }

    await pool.query(
      `INSERT INTO forum_resposta_like (resposta_id, usuario_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP`,
      [replyId, userId]
    );

    const summary = await getReplyLikeSummary(replyId, userId);
    res.json(summary);
  })
);

router.delete(
  "/replies/:id/likes",
  asyncHandler(async (req: Request, res: Response) => {
    const replyId = Number(req.params.id);
    if (!Number.isFinite(replyId)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const userId = getSessionUserId(req);
    if (!userId) {
      res.status(401).json({ error: "É necessário estar autenticado para curtir" });
      return;
    }

    await pool.query("DELETE FROM forum_resposta_like WHERE resposta_id = ? AND usuario_id = ?", [replyId, userId]);
    const summary = await getReplyLikeSummary(replyId, userId);
    res.json(summary);
  })
);

export default router;
