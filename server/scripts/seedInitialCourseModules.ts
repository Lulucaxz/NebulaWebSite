import { pool } from '../db';
import { seedInitialCourseModules } from '../seeds/initialCourseModulesSeeder';

const parseAuthorOverride = (): number | undefined => {
  const raw = process.env.SEED_COURSE_AUTHOR_ID ?? process.env.SEED_MODULE_AUTHOR_ID ?? process.argv[2];
  if (!raw) {
    return undefined;
  }
  const numeric = Number(raw);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    console.warn('Ignorando identificador de autor inválido passado ao seed. Utilizando fallback automático.');
    return undefined;
  }
  return Math.floor(numeric);
};

const run = async () => {
  try {
    const authorOverride = parseAuthorOverride();
    const { summary, authorId } = await seedInitialCourseModules({ authorId: authorOverride, logger: console });
    const total = summary.reduce((acc, entry) => acc + entry.updatedModuleIds.length, 0);
    console.log(`Seed concluído com autor ${authorId}. ${total} módulos sincronizados.`);
    summary.forEach((entry) => {
      console.log(`Assinatura ${entry.assinatura}: ${entry.updatedModuleIds.length} módulos atualizados.`);
    });
  } catch (error) {
    console.error('Erro ao popular módulos iniciais:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
