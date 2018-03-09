'use strict';

require('dotenv').config()

const redis = require('redis');
const Discord = require('discord.js');
const cron = require('node-cron');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const pg = require('pg');


require('./modules/youtube.js');

const twitter = require('./modules/twitter.js');
const instagram = require('./modules/instagram.js');
const util = require("./util.js");

// if on heroku and database_url exist, use it with SSL.
if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
} else {
  var pg_client = new pg.Client()
}

const { SM_UPDATES_ID, GENERAL_ID, TEST_ID, MUSIC_VOICE_ID, REOL_CHAN_ID, ANNOUNCEMENTS_ID } = require("./constants");

const client = new CommandoClient({
  commandPrefix: 'r!',
  owner: process.env.OWNER_ID,
  disableEveryone: true,
  unknownCommandResponse: false
});

const redisClient = redis.createClient(process.env.REDISTOGO_URL);

client.registry
  // Registers your custom command groups
  .registerDefaultTypes()
  .registerGroups([
    ['youtube', 'Youtube'],
    ['social-media', 'Social Media'],
    ['admin', 'Admin']
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
    util.setRandomNowPlaying(client);

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
    util.setRandomNowPlaying(client)
  }, true);
}

client.on("guildMemberAdd", member => {
  // GENERAL
  const channel = client.channels.get(GENERAL_ID);
  // send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}! <:wutGiga:297897855727697921>`);
});

client.on("message", message => {
  
  if (message.channel.id === ((process.env.npm_config_test !== undefined) ? TEST_ID : ANNOUNCEMENTS_ID)){
    message.react(message.guild.emojis.find('name', 'loveReol').id);
  }

  redisClient.incr(`count_${message.author.id}`, redis.print);
})