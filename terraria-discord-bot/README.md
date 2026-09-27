# Terraria Discord Bot

Projeto criado do zero, em desenvolvimento incremental. **Ainda não monitora Terraria.**

## Etapa atual

- Ambiente: Debian 13, Node.js 22.23.2, npm 10.9.8.
- Requer Node.js >=22.16.0. Dependência direta única: discord.js 14.27.0.
- Configuração `.env` nativa do Node.js; sem dotenv.
- Cliente Discord com intent Guilds, tratamento de falhas e encerramento por sinais.
- A reconexão de sessões Discord é gerenciada pelo discord.js.
- Testes locais usam cliente simulado, sem rede. Não comprovam login real.
- Login real pendente: falta token privado. Não prosseguir ao monitoramento antes de validá-lo.

## Executar

Na pasta `terraria-discord-bot`:

```sh
npm ci
cp .env.example .env  # somente se .env ainda não existir
chmod 600 .env
# Edite .env localmente; nunca publique o token no chat ou no Git.
npm test
npm start
```

Neste ambiente as dependências e o `.env` vazio já foram preparados.
Crie uma aplicação no Discord Developer Portal, obtenha o token de **bot** e
preencha `DISCORD_TOKEN` no `.env`. Em Installation/OAuth2, gere o convite com
os escopos `bot` e `applications.commands` e adicione o bot ao seu servidor.
Não habilite intents privilegiados nem conceda Administrator.
Futuramente, as notificações precisarão de View Channel, Send Messages e Embed Links
no canal escolhido; nenhum canal é usado nesta etapa.

O sucesso real é indicado por `Bot conectado ao Discord.`.
Use Ctrl+C para encerrar. Não execute múltiplas instâncias com o mesmo token.
O arquivo `.env` é lido relativo ao projeto; variáveis de ambiente existentes
prevalecem. Tokens e senhas não são registrados nos logs.

## Configuração

| Variável | Uso atual |
| --- | --- |
| DISCORD_TOKEN | Necessária para conectar ao Discord |
| TERRARIA_HOST | Reservada; ainda não consultada |
| TERRARIA_PORT | Reservada; padrão preparado: 7777 |
| TERRARIA_PASSWORD | Reservada; ainda não utilizada |

`.env`, variantes privadas, logs e node_modules são ignorados pelo Git.
As pastas vazias de etapas futuras existem localmente, mas não são versionadas.

## Próximas etapas e limites

Após validar o Discord: confirmar documentação do Terraria Vanilla e a versão
exata do servidor; verificar se há acesso autorizado a console ou logs.
Não foi implementado nem presumido protocolo de consulta, API REST ou RCON.
Uma conexão TCP, isoladamente, não comprova que o serviço seja Terraria e não
fornece lista de jogadores, mortes ou eventos do mundo.
Nenhum TShock, plugin ou modificação do servidor foi instalado.

Planejados, **não disponíveis**: `/status`, `/players`, `/player <nome>`, `/events`,
`/bosses`, `/world`, `/server`, `/help` e notificações por embeds.
Comandos administrativos somente se houver interface real confirmada, autorização
e verificação de permissões Discord. Não há execução de comandos remotos nesta etapa.

Decisão: preservar a ordem solicitada e interromper no bloqueio de credenciais,
sem produzir monitoramento especulativo ou declarar testes reais inexistentes.
