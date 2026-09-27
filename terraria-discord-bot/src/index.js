import { loadEnvFile } from 'node:process';
import { startDiscord } from './discord/client.js';

async function main() {
  try {
    loadEnvFile(new URL('../.env', import.meta.url));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw new Error('Não foi possível ler o arquivo .env. Verifique as permissões.');
    }
  }

  const client = await startDiscord(process.env.DISCORD_TOKEN);
  let stopping = false;
  const shutdown = async () => {
    if (stopping) return;
    stopping = true;
    console.info('Encerrando conexão Discord.');
    try {
      await client.destroy();
    } catch {
      console.error('Falha ao encerrar conexão Discord.');
      process.exitCode = 1;
    }
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
