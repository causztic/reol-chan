'use strict';

require('dotenv').config();

const fs = require('fs');
const cron = require('node-cron');
const path = require('path');
const pg = require('pg');
const { CommandoClient } = require('discord.js-commando');

const redisClient = require('./redis-client.js');
const twitter = require('./modules/twitter.js');
const instagram = require('./modules/instagram.js');
const { setRandomNowPlaying, getChannel } = require("./util.js");

// if on heroku and database_url exist, use it with SSL.
if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
} else {
  var pg_client = new pg.Client()
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
    let obj = JSON.parse(fs.readFileSync('package.json'));
    client.channels.get(getChannel(REOL_CHAN_ID)).send(`I'm updated to ${obj.version}! <:loveReol:305153250888515595>`);
    if (process.env.DATABASE_URL) {
      pg.connect(process.env.DATABASE_URL, (err, pg_client) => {
        if (err) catchErrors(err);
        getSocialMedia(pg_client);
      })
    } else {
      pg_client.connect((err) => {
        if (err) catchErrors(err);
        getSocialMedia(pg_client);
      })
    }
  }, (reason) => { catchErrors(reason) })

var catchErrors = (reason) => {
  console.error(reason)
  client.channels.get(TEST_ID).send(reason)
}

var getSocialMedia = (pgc) => {
  instagram.getLatestInstagramPost(pgc, client)
  twitter.getLatestTwitterPost(pgc, client)

  cron.schedule('*/15 * * * *', () => {
    instagram.getLatestInstagramPost(pgc, client)
    twitter.getLatestTwitterPost(pgc, client)
  }, true);

  cron.schedule('*/30 * * * *', () => {
    setRandomNowPlaying(client)
  }, true);
}

client.on("guildMemberAdd", member => {
  // GENERAL
  const channel = client.channels.get(GENERAL_ID);
  // send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}! <:wutGiga:297897855727697921>`);
});

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