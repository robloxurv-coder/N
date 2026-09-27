import { Client, Events, GatewayIntentBits } from 'discord.js';

export async function startDiscord(token, {
  createClient = () => new Client({
    intents: [GatewayIntentBits.Guilds],
    allowedMentions: { parse: [] },
  }),
  logger = console,
} = {}) {
  if (typeof token !== 'string' || !token.trim()) {
    throw new Error('Defina DISCORD_TOKEN no arquivo .env antes de iniciar.');
  }

  const client = createClient();
  client.once(Events.ClientReady, () => logger.info('Bot conectado ao Discord.'));
  // Não registrar objetos de erro externos: podem conter dados sensíveis.
  client.on(Events.Error, () => logger.error('Erro no cliente Discord.'));
  client.on(Events.ShardError, () => logger.error('Erro de conexão com o Discord.'));
  client.on(Events.ShardReconnecting, () => logger.info('Reconectando ao Discord.'));
  client.on(Events.ShardResume, () => logger.info('Conexão Discord retomada.'));

  try {
    await client.login(token.trim());
    return client;
  } catch {
    await client.destroy();
    throw new Error('Falha ao conectar ao Discord. Verifique o token e a rede.');
  }
}
