/* eslint-disable max-len */
import cron from 'node-cron';
import "dotenv/config";
const { ActivityType, Client, GatewayIntentBits, Partials, Events, } = require('discord.js'); 
import config from './config';
import { handleCommandByName } from './handlers';
import { MustBeInGuildError } from './util/mustBeInGuild';
import { ActivityOptions, ChatInputCommandInteraction, CacheType, Message } from 'node_modules/discord.js/typings';
// import { checkTwitter } from './twitter';

const activities: ActivityOptions[] = [
  // EDIT: last release
  { name: 'うつくしじごく', url: 'https://open.spotify.com/track/3SugjpnqPJBtgd5XNKENMY', type: ActivityType.Listening },
  { name: 'おとめの肖像', url: 'https://open.spotify.com/track/5YblCSwOsWFAuq2Ks3Y71D', type: ActivityType.Listening },
  { name: '感情御中', url: 'https://open.spotify.com/track/45vacCRo9gHtfkN19QG8yZ', type: ActivityType.Listening },
  { name: 'DEAD CENTER feat. LiSA', url: 'https://open.spotify.com/track/26mR5pRpqRqgSBZ6ZTR1ix', type: ActivityType.Listening },
  { name: 'ディア', url: 'https://open.spotify.com/track/6aizgQZWjeVTjWbbkpAp4Y', type: ActivityType.Listening },
  { name: 'ULTRA C feat. nqrse', url: 'https://open.spotify.com/track/1flfiXu3dPXnM6tcOl9Axl', type: ActivityType.Listening },
  { name: 'SHINOBI', url: 'https://open.spotify.com/track/7kDNVKO3ivOp5cMgCzt95G', type: ActivityType.Listening },
  { name: '二等星', url: 'https://open.spotify.com/track/6rbCbnnX56JukmOF7BlA7I?si=d9c661b520f24261', type: ActivityType.Listening },
  { name: '閑話', url: 'https://open.spotify.com/track/1VfVMVdkMjqlu1cbLItQi6', type: ActivityType.Listening },
  { name: 'RE RESCUE', url: 'https://open.spotify.com/track/1n4j0sz074wLktWANkFnqQ', type: ActivityType.Listening },
  { name: '美辞目録', url: 'https://open.spotify.com/track/18SEsJtg294TtOjjwwSWgr', type: ActivityType.Listening },
];

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], presence: { activities }
});

client.once(Events.ClientReady, (readyClient: { user: any; }) => {
  cron.schedule('*/3 * * * *', async () => {
    const item = activities[~~(Math.random() * activities.length)];
    readyClient.user!.setActivity(item.name!, item);
  });

  // cron.schedule('*/2 * * * *', () => {
  //   checkTwitter(client, { name: 'RRReol', id: '849666966' });
  // });

  // cron.schedule('*/5 * * * *', () => {
  //   checkTwitter(client, { name: 'RRReol_official', id: '936463848449630208' });
  // });
});

client.on(Events.MessageCreate, async (message: Message) => {
  if (message.channelId === config.photoGalleryId) {
    // EDIT: allow only images and videos to be uploaded
    const allowedAttachments = [...message.attachments.values()]
          .filter( a => a.contentType?.startsWith('image/') || a.contentType?.startsWith('video/'))
          .map(a => a.url);
    if (allowedAttachments.length === 0) {
      await message.delete();
    } else if (allowedAttachments.length < message.attachments.size) {
      await message.reply({
        files: allowedAttachments
      });
      await message.delete();
    }
  }
});

client.on(Events.InteractionCreate, async (interaction: ChatInputCommandInteraction<CacheType>) => {
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