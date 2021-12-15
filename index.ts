/* eslint-disable max-len */
import cron from 'node-cron';
import { ActivityType } from 'discord-api-types';
import { ActivitiesOptions, Client, Intents } from 'discord.js';
import config from './config';
import { handleCommandByName } from './handlers';
import { MustBeInGuildError } from './util/mustBeInGuild';
import { checkTwitter } from './twitter';

const activities: ActivitiesOptions[] = [
  { name: '第六感', url: 'https://open.spotify.com/track/7JoAEFSQcQVP8CVQs9evCK', type: ActivityType.Listening },
  { name: 'Q?', url: 'https://open.spotify.com/track/7qPd0qqWCwJcLlwh0EMzqR', type: ActivityType.Listening },
  { name: '白夜', url: 'https://open.spotify.com/track/4uFeogGVRjhTGotbD7ibaY', type: ActivityType.Listening },
  { name: 'Ms. CONTROL', url: 'https://open.spotify.com/track/0z0aMslUaXv7dktiOtRxt1', type: ActivityType.Listening },
  { name: 'ミュータント', url: 'https://open.spotify.com/track/5CcIbg87TfFtajPIn4u7bD', type: ActivityType.Listening },
  { name: 'Nd60', url: 'https://open.spotify.com/track/7ojnLCXMOYoliD4HLm4dHh', type: ActivityType.Listening },
  { name: 'Boy', url: 'https://open.spotify.com/track/1igJtwHQhwllFr0CK34xKI?si=d9ae9bae00884dc7', type: ActivityType.Listening },
];

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], presence: { activities }
});

client.once('ready', () => {
  cron.schedule('*/3 * * * *', () => {
    const item = activities[~~(Math.random() * activities.length)];
    client.user!.setActivity(item.name!, item);
  });  

  cron.schedule('*/2 * * * *', () => {
    checkTwitter(client, { name: 'RRReol', id: '849666966' });
  });

  cron.schedule('*/5 * * * *', () => {
    checkTwitter(client, { name: 'RRReol_official', id: '936463848449630208' });
  });
});

client.on('messageCreate', async message => {
  if (message.channelId === config.photoGalleryId) {
    if (message.attachments.size === 0) {
      await message.delete();
    }
    // TODO: allow only images and videos to be uploaded
  }
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

client.login(config.token);