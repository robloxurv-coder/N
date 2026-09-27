import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Events } from 'discord.js';
import { startDiscord } from './client.js';

function fixture(rejectLogin = false) {
  const messages = [];
  const client = new EventEmitter();
  client.destroyed = false;
  client.login = async (token) => {
    client.receivedToken = token;
    if (rejectLogin) throw new Error(`segredo: ${token}`);
    client.emit(Events.ClientReady);
  };
  client.destroy = async () => { client.destroyed = true; };
  const logger = {
    info: (message) => messages.push(message),
    error: (message) => messages.push(message),
  };
  return { client, messages, options: { createClient: () => client, logger } };
}

test('token ausente impede conexão antes de criar cliente', async () => {
  for (const token of [undefined, '', '   ']) {
    await assert.rejects(startDiscord(token, {
      createClient: () => assert.fail('Não deve tentar conectar'),
    }), /Defina DISCORD_TOKEN/);
  }
});

test('login simulado, reconexão e erros não expõem o token', async () => {
  const { client, messages, options } = fixture();
  assert.equal(await startDiscord(' teste-local ', options), client);
  assert.equal(client.receivedToken, 'teste-local');
  client.emit(Events.Error, new Error('teste-local'));
  client.emit(Events.ShardError, new Error('teste-local'));
  client.emit(Events.ShardReconnecting);
  client.emit(Events.ShardResume);
  assert.equal(messages.length, 5);
  assert.equal(messages.some((message) => message.includes('teste-local')), false);
});

test('login rejeitado encerra cliente e oculta erro externo', async () => {
  const { client, options } = fixture(true);
  await assert.rejects(startDiscord('teste-local', options), {
    message: 'Falha ao conectar ao Discord. Verifique o token e a rede.',
  });
  assert.equal(client.destroyed, true);
});

test('inicialização sem token termina claramente e sem rede', () => {
  const result = spawnSync(process.execPath, [
    fileURLToPath(new URL('../index.js', import.meta.url)),
  ], {
    env: { ...process.env, DISCORD_TOKEN: '' },
    encoding: 'utf8',
    timeout: 5000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Defina DISCORD_TOKEN/);
});
