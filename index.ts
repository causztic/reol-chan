// https://github.com/discordjs/voice/tree/main/examples/music-bot

import { Client, Intents } from 'discord.js';
import { token } from './config.json';
import { handleCommandByName } from './handlers';
import { MustBeInGuildError } from '@util/mustBeInGuild';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand() || !interaction.guildId) return;

  try {
    handleCommandByName(interaction);
  } catch (e: unknown) {
    if (e instanceof MustBeInGuildError) {
      interaction.reply({
        ephemeral: true, content: 'This can only be run in the r/reol server.',
      });
    }
  }
});

client.login(token);