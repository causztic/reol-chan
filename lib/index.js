'use strict';

require('./youtube_info.js');
require('dotenv').config()

const Discord = require('discord.js');
const cron = require('node-cron');
const Commando = require('discord.js-commando');
const path = require('path');
const instagram = require('./instagram.js');
const pg = require('pg');

const util = require("./util.js");

// if on heroku and database_url exist, use it with SSL.
if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
} else {
  var pg_client = new pg.Client()
}

const { SM_UPDATES_ID, GENERAL_ID, TEST_ID, MUSIC_VOICE_ID } = require("./constants");

const client = new Commando.Client({
  owner: process.env.OWNER_ID
});

client.registry
  // Registers your custom command groups
  .registerGroups([
    ['youtube', 'Youtube Commands'],
    ['social-media', 'Social Media Commands']
  ])

  // Registers all built-in groups, commands, and argument types
  .registerDefaults()

  // Registers all of your commands in the ./commands/ directory
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.TOKEN)
  .then(() => {
    util.setRandomNowPlaying(client);
    if (process.env.DATABASE_URL) {
      pg.connect(process.env.DATABASE_URL, (err, pg_client) => {
        if (err) catchErrors(err);
        getInstagram(pg_client);
      })
    } else {
      pg_client.connect((err) => {
        if (err) catchErrors(err);
        getInstagram(pg_client);
      })
    }
  }, (reason) => { catchErrors(reason) })

var catchErrors = (reason) => {
  console.error(reason)
  client.channels.get(TEST_ID).sendMessage(reason)
}

var getLatestInstagramPost = (pgc) => {
  instagram('rrreol999', { count: 3 })
    .then(posts => {
      for (const post of posts) {
        pgc.query('SELECT exists(select 1 from Instagram WHERE post_id=$1)', [post.id], (err, exists) => {
          if (!exists.rows[0].exists) {
            console.log("Adding post: " + post.id)
            console.log(post)

            for (const media of post.media){
              client.channels.get(SM_UPDATES_ID).sendMessage(`${post.text} \n ${media}`);
            }
            pgc.query('INSERT INTO Instagram(url, text, post_id) VALUES ($1, $2, $3);', [post.media, post.text, post.id])
          }
        })
      }
    })
}

var getInstagram = (pgc) => {
  getLatestInstagramPost(pgc)
  cron.schedule('*/30 * * * *', () => {
    getLatestInstagramPost(pgc)
    util.setRandomNowPlaying(client)
  }, true);
}

client.on("guildMemberAdd", member => {
  // GENERAL
  const channel = client.channels.get(GENERAL_ID);
  // send the message, mentioning the member
  channel.sendMessage(`Welcome to the server, ${member}! <:wutGiga:297897855727697921>`);
});
