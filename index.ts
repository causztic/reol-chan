/* eslint-disable max-len */
import cron from 'node-cron';
import { ActivityType } from 'discord-api-types';
import { ActivitiesOptions, Client, Intents } from 'discord.js';
import { token } from './config.json';
import { handleCommandByName } from './handlers';
import { MustBeInGuildError } from './util/mustBeInGuild';

const activities: ActivitiesOptions[] = [
  { name: '金字塔', url: "https://open.spotify.com/track/02HNBwIheiZAuzC8p1QBPn", type: ActivityType.Listening },
  { name: "HYPE MODE", url: "https://open.spotify.com/track/4BLp8YfoGLtspzHhN6bsi9", type: ActivityType.Listening },
  { name: "ゆーれいずみー", url: "https://open.spotify.com/track/0NsnScldVs3A8psn3uCLZr", type: ActivityType.Listening },
  { name: "-ムーブのための試奏曲 Nr.4-", url: "https://open.spotify.com/track/5f67BMdyuOf0VNYFFnuwRs", type: ActivityType.Listening },
  { name: "ハーメルン", url: "https://open.spotify.com/track/76zCFsWIre89p4HQrRerbf", type: ActivityType.Listening },
  { name: "un, deux, trois", url: "https://open.spotify.com/track/2NXqn7SaFWJmIpjwu9Ae6c", type: ActivityType.Listening },
  { name: "insider", url: "https://open.spotify.com/track/0GY0AgfcwuKDUHaZgRv4QM", type: ActivityType.Listening },
  { name: "ダリ", url: "https://open.spotify.com/track/7f4PaZuWlLM4ZsPTZIPLe1", type: ActivityType.Listening },
  { name: "-ルネの小品 Nr.9-", url: "https://open.spotify.com/track/65leI2ZvSJRWtGozl5g1tf", type: ActivityType.Listening },
  { name: "GRIMOIRE", url: "https://open.spotify.com/track/60RClClRsm1QQCXVuaRMN5", type: ActivityType.Listening },
  { name: "1LDK", url: "https://open.spotify.com/track/27MVvs7ErNpl81dkwwNS5i", type: ActivityType.Listening },
  { name: "白夜", url: "https://open.spotify.com/track/0n9XEQevHnxyyp4TeIb3km", type: ActivityType.Listening },
];

const client = new Client({
  intents: [Intents.FLAGS.GUILDS], presence: { activities }
});

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

client.login(token).then(() => {
  cron.schedule('*/3 * * * *', () => {
    const item = activities[~~(Math.random() * activities.length)];
    client.user!.setActivity(item.name!, item);
  });  
});