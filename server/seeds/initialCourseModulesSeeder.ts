import { PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../db';
import { initialCourseModules } from './initialCourseModules';
import { ALLOWED_ASSINATURAS } from '../courseConstants';

const DEFAULT_BACKGROUND = '/img/ceu-estrelado.jpg';
const DEFAULT_VIDEO = '/videos/placeholder.mp4';
const SYSTEM_SEED_EMAIL = 'seed-initial-modulos@nebula.local';
const DEFAULT_AVATAR = 'https://images.vexels.com/media/users/3/235233/isolated/preview/be93f74201bee65ad7f8678f0869143a-cracha-de-perfil-de-capacete-de-astronauta.png';
const DEFAULT_BANNER = '/img/nebulosaBanner.jpg';

const MAX_TEXT = {
  titulo: 255,
  descricao: 4000,
  videoUrl: 2048,
};

type QuestaoSeed = {
  questao: string;
  dissertativa?: boolean;
  alternativas?: string[];
  respostaCorreta?: string;
};

type AtividadeSeed = {
  id: number;
  template?: { titulo?: string; descricao?: string };
  questoes?: QuestaoSeed[];
};

type VideoSeed = {
  id: number;
  titulo?: string;
  subtitulo?: string;
  descricao?: string;
  video?: string;
  backgroundImage?: string;
};

type IntroducaoSeed = {
  id: number;
  descricao?: string;
  video?: string;
  videoBackground?: string;
};

type ModuleSeed = {
  id: number;
  template?: { titulo?: string; descricao?: string };
  introducao: IntroducaoSeed;
  atividades?: AtividadeSeed[];
  videoAulas?: VideoSeed[];
};

type SeedMap = Record<string, ModuleSeed[]>;

type Logger = Pick<typeof console, 'log' | 'warn' | 'error'>;

const truncate = (value: unknown, max: number, fallback = ''): string => {
  const text = String(value ?? '').trim();
  if (!text) return fallback;
  return text.length > max ? text.slice(0, max) : text;
};

const normalizeVideoUrl = (value: unknown): string => {
  const url = String(value ?? '').trim();
  return url || DEFAULT_VIDEO;
};

const normalizeBackground = (value: unknown): string => {
  const url = String(value ?? '').trim();
  return url || DEFAULT_BACKGROUND;
};

const normalizeAuthorId = (value?: number) => {
  if (!value) return undefined;
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return Math.floor(value);
};

const getOrCreateSeedProfessor = async (connection: PoolConnection): Promise<number> => {
  const [existing] = await connection.query<RowDataPacket[]>(
    'SELECT id FROM usuario WHERE email = ? LIMIT 1',
    [SYSTEM_SEED_EMAIL]
  );
  if (existing.length) {
    return Number(existing[0].id);
  }

  const [colocacaoRows] = await connection.query<RowDataPacket[]>(
    'SELECT IFNULL(MAX(colocacao), 0) AS maxColocacao FROM usuario'
  );
  const maxColocacao = Number(colocacaoRows?.[0]?.maxColocacao ?? 0);
  const newColocacao = maxColocacao + 1;
  const uniqueHandle = `@nebula_seed_${Date.now()}`;

  const [result] = await connection.query<ResultSetHeader>(
    `INSERT INTO usuario (username, user, pontos, colocacao, icon, banner, biografia,
      progresso1, progresso2, progresso3, email, senha, curso, idioma, tema, role, seguidores, seguindo, provider)
     VALUES (?, ?, 0, ?, ?, ?, ?, 0, 0, 0, ?, NULL, '', 'pt-br', 'dark', 'professor', 0, 0, 'local')`,
    [
      'Nebula Seed',
      uniqueHandle,
      newColocacao,
      DEFAULT_AVATAR,
      DEFAULT_BANNER,
      'Conta automática criada para semear módulos iniciais.',
      SYSTEM_SEED_EMAIL,
    ]
  );

  return result.insertId;
};

const resolveSeedAuthorId = async (connection: PoolConnection, explicit?: number): Promise<number> => {
  const normalized = normalizeAuthorId(explicit);
  if (normalized) {
    return normalized;
  }

  const [professores] = await connection.query<RowDataPacket[]>(
    'SELECT id FROM usuario WHERE role = "professor" ORDER BY id ASC LIMIT 1'
  );
  if (professores.length) {
    return Number(professores[0].id);
  }

  const [usuarios] = await connection.query<RowDataPacket[]>(
    'SELECT id FROM usuario ORDER BY id ASC LIMIT 1'
  );
  if (usuarios.length) {
    return Number(usuarios[0].id);
  }

  return getOrCreateSeedProfessor(connection);
};

const insertActivities = async (
  connection: PoolConnection,
  moduleId: number,
  atividades: AtividadeSeed[]
) => {
  for (const [index, atividade] of atividades.entries()) {
    const titulo = truncate(atividade?.template?.titulo ?? `Atividade ${index + 1}`, MAX_TEXT.titulo);
    const descricao = truncate(
      atividade?.template?.descricao ?? 'Descrição pendente.',
      MAX_TEXT.descricao,
      'Descrição pendente.'
    );
    const questoesJson = JSON.stringify(atividade?.questoes ?? []);
    await connection.query<ResultSetHeader>(
      `INSERT INTO curso_modulo_atividade (modulo_id, titulo, descricao, questoes, ordem)
       VALUES (?, ?, ?, ?, ?)`,
      [moduleId, titulo, descricao, questoesJson, index + 1]
    );
  }
};

const insertVideos = async (
  connection: PoolConnection,
  moduleId: number,
  videos: VideoSeed[]
) => {
  for (const [index, video] of videos.entries()) {
    const titulo = truncate(video?.titulo ?? `Aula ${index + 1}`, MAX_TEXT.titulo);
    const subtitulo = truncate(video?.subtitulo ?? '', MAX_TEXT.titulo) || null;
    const descricao = truncate(video?.descricao ?? '', MAX_TEXT.descricao) || null;
    const videoUrl = truncate(normalizeVideoUrl(video?.video), MAX_TEXT.videoUrl, DEFAULT_VIDEO);
    const background = truncate(normalizeBackground(video?.backgroundImage), MAX_TEXT.videoUrl, DEFAULT_BACKGROUND) || null;

    await connection.query<ResultSetHeader>(
      `INSERT INTO curso_modulo_video (modulo_id, titulo, subtitulo, descricao, video_url, background_url, ordem)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [moduleId, titulo, subtitulo, descricao, videoUrl, background, index + 1]
    );
  }
};

const upsertModule = async (
  connection: PoolConnection,
  assinatura: string,
  module: ModuleSeed,
  ordem: number,
  authorId: number
): Promise<number> => {
  const titulo = truncate(module?.template?.titulo ?? 'Módulo sem título', MAX_TEXT.titulo, 'Módulo sem título');
  const descricao = truncate(module?.template?.descricao ?? '', MAX_TEXT.descricao, 'Descrição indisponível.');
  const introDescricao = truncate(module?.introducao?.descricao ?? '', MAX_TEXT.descricao, 'Introdução indisponível.');
  const introVideo = truncate(normalizeVideoUrl(module?.introducao?.video), MAX_TEXT.videoUrl, DEFAULT_VIDEO);
  const introBackground = truncate(
    normalizeBackground(module?.introducao?.videoBackground),
    MAX_TEXT.videoUrl,
    DEFAULT_BACKGROUND
  );

  const [existing] = await connection.query<RowDataPacket[]>(
    'SELECT id FROM curso_modulo_custom WHERE assinatura = ? AND titulo = ? LIMIT 1',
    [assinatura, titulo]
  );

  if (existing.length > 0) {
    const moduleId = Number(existing[0].id);
    await connection.query<ResultSetHeader>(
      `UPDATE curso_modulo_custom
       SET descricao = ?, introducao_descricao = ?, introducao_video = ?, introducao_background = ?, ordem = ?, updated_by = ?
       WHERE id = ?`,
      [descricao, introDescricao, introVideo, introBackground, ordem, authorId, moduleId]
    );
    await connection.query<ResultSetHeader>('DELETE FROM curso_modulo_atividade WHERE modulo_id = ?', [moduleId]);
    await connection.query<ResultSetHeader>('DELETE FROM curso_modulo_video WHERE modulo_id = ?', [moduleId]);
    await insertActivities(connection, moduleId, module?.atividades ?? []);
    await insertVideos(connection, moduleId, module?.videoAulas ?? []);
    return moduleId;
  }

  const [result] = await connection.query<ResultSetHeader>(
    `INSERT INTO curso_modulo_custom
      (assinatura, titulo, descricao, introducao_descricao, introducao_video, introducao_background, ordem, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [assinatura, titulo, descricao, introDescricao, introVideo, introBackground, ordem, authorId, authorId]
  );

  const moduleId = result.insertId;
  await insertActivities(connection, moduleId, module?.atividades ?? []);
  await insertVideos(connection, moduleId, module?.videoAulas ?? []);
  return moduleId;
};

export type SeedSummaryEntry = { assinatura: string; updatedModuleIds: number[] };
export type SeedResult = { summary: SeedSummaryEntry[]; authorId: number };

export const seedInitialCourseModules = async (options?: {
  authorId?: number;
  logger?: Logger;
}): Promise<SeedResult> => {
  const logger = options?.logger;
  const connection = await pool.getConnection();
  try {
    const authorId = await resolveSeedAuthorId(connection, options?.authorId);
    const data = initialCourseModules as SeedMap;
    const signatures = Object.keys(data);
    const summary: SeedSummaryEntry[] = [];

    for (const assinatura of signatures) {
      if (!ALLOWED_ASSINATURAS.has(assinatura)) {
        logger?.warn(`Ignorando assinatura não suportada: ${assinatura}`);
        continue;
      }

      const modules = data[assinatura] ?? [];
      const updated: number[] = [];

      for (const [index, module] of modules.entries()) {
        await connection.beginTransaction();
        try {
          const moduleId = await upsertModule(connection, assinatura, module, index + 1, authorId);
          await connection.commit();
          updated.push(moduleId);
        } catch (error) {
          await connection.rollback();
          throw error;
        }
      }

      summary.push({ assinatura, updatedModuleIds: updated });
    }

    return { summary, authorId };
  } finally {
    connection.release();
  }
};
