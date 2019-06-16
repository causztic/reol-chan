'use strict';

require('dotenv').config();

const cron = require('node-cron');
const path = require('path');
const pg = require('pg');
const { CommandoClient } = require('discord.js-commando');

const NightStalker = require('night-stalker');

const redisClient = require('./redis-client.js');
const twitter = require('./modules/twitter.js');
const instagram = require('./modules/instagram.js');
const { setRandomNowPlaying, getChannel } = require("./util.js");

// if on heroku and database_url exist, use it with SSL.
if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
}

const { GENERAL_ID, TEST_ID, ANNOUNCEMENTS_ID, PHOTO_GALLERY_ID } = require("./constants");

const client = new CommandoClient({
  commandPrefix: 'r!',
  owner: process.env.OWNER_ID,
  disableEveryone: true,
  unknownCommandResponse: false
});

client.registry
  // Registers your custom command groups
  .registerDefaultTypes()
  .registerGroups([
    ['social-media', 'Social Media'],
    ['admin', 'Admin'],
    ['misc', 'Misc'],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    eval_: false,
    commandState: false
  })
  // Registers all of your commands in the ./commands/ directory
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.TOKEN)
  .then(() => {
    setRandomNowPlaying(client);
    if (process.env.DATABASE_URL) {
      pg.connect(process.env.DATABASE_URL, (err, pg_client, _) => {
        if (err) catchErrors(err);
        getSocialMedia(pg_client);
      })
    } else {
      pg.connect((err, pg_client, _) => {
        if (err) catchErrors(err);
        getSocialMedia(pg_client);
      })
    }
  }, (reason) => { catchErrors(reason) })

var catchErrors = (reason) => {
  console.error(reason)
  client.channels.get(TEST_ID).send(reason)
}

var getSocialMedia = async (pgc) => {
  client.ns = await NightStalker.loadBrowser();
  client.ns.setUserName('rrreol999');

  instagram.getLatestInstagramPost(pgc, client)
  instagram.getStories(pgc, client)
  twitter.getLatestTwitterPost(pgc, client)

  cron.schedule('*/15 * * * *', () => {
    instagram.getLatestInstagramPost(pgc, client)
    twitter.getLatestTwitterPost(pgc, client)
  }, true);

  cron.schedule('*/30 * * * *', () => {
    setRandomNowPlaying(client)
  }, true);

  cron.schedule('00 */1 * * *', () => {
    instagram.getStories(pgc, client)
  });
}

client.on("message", message => {
  // only allow image attachments
  if (message.channel.id === PHOTO_GALLERY_ID) {
    if (message.attachments.first() === undefined) {
      // not an attachment
      message.delete();
    }
    for (let [key, value] of message.attachments) {
      if (value.height === undefined || value.width === undefined) {
        // not an image
        message.delete();
      }
    }
  }

  if (Math.random() <= 0.25 && message.author.id !== '294349205391147009' && message.content.slice(0, 2) !== "r!"){
    if (message.content.slice(-3) === "owo"){
      message.react(message.guild.emojis.find('name', 'reolOwo').id);
    } else if (message.channel.id === (getChannel(ANNOUNCEMENTS_ID) || message.content.slice(-1) === '!')){
      message.react(message.guild.emojis.find('name', 'loveReol').id);
    }
  }

  if (message.content.slice(0, 2) !== "r!") {
    redisClient.hincrby('points', `count_${message.author.id}`, 1);
  }
})