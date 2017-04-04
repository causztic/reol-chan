'use strict';

require('./youtube_info.js');
require('dotenv').config()

const Discord = require('discord.js');
const cron = require('node-cron');
const Commando = require('discord.js-commando');
const path = require('path');
const instagram = require('instagram-posts');
const pg = require('pg');

// if on heroku and database_url exist, use it with SSL.
if (process.env.DATABASE_URL){
  pg.defaults.ssl = true;
} else {
  var pg_client = new pg.Client()
}

const { SM_UPDATES_ID , GENERAL_ID, TEST_ID } = require("./constants");

const client = new Commando.Client({
  owner: process.env.OWNER_ID
});


var setRandomNowPlaying = () => {
  var items = ["Nier Automata", "Persona 5", "DOTA2", "osu!", 
                   "Hearthstone", "with Okiku-chan", "with Giga-chan"]
  client.user.setGame(items[~~(Math.random() * items.length)])
}

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
    setRandomNowPlaying()
    if (process.env.DATABASE_URL){
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
  instagram('rrreol999', { count: 1 })
  .then(posts => {
    var post = posts[0]
    // if there is nothing in database or latest post_id is not post.id
    if (typeof result == 'undefined' || result.post_id != post.id) {
      pgc.query(
        'INSERT INTO Instagram(url, text, post_id) VALUES ($1, $2, $3);', [post.media, post.text, post.id], 
        (err, result) => {
        if (err){
          catchErrors(err);
        } else {
          client.channels.get(SM_UPDATES_ID).sendMessage(`${post.text} \n ${post.media}`);
        }
      })
    }
  })
}

var getInstagram = (pgc) => {
  pgc.query('SELECT post_id FROM Instagram ORDER BY ID ASC LIMIT 1;', (err, result) => {
    result = result.rows[0]
    if (err) catchErrors(err);
    cron.schedule('*/30 * * * *', () => {
      getLatestInstagramPost(pgc)
      setRandomNowPlaying()
    }, true);
  });
}

client.on("guildMemberAdd", member => {
  // GENERAL
  const channel = client.channels.get(GENERAL_ID);
  // send the message, mentioning the member
  channel.sendMessage(`Welcome to the server, ${member}! <:wutGiga:297897855727697921>`);
});
