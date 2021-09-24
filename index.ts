// https://github.com/discordjs/voice/tree/main/examples/music-bot

import { Client, Intents, Snowflake } from 'discord.js';
import { token } from './config.json';
import { handleCommandByName } from './handlers';

const client = new Client({ intents: [Intents.FLAGS.GUILDS]})
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand() || !interaction.guildId) return;

  handleCommandByName(interaction);
});
  
client.login(token);