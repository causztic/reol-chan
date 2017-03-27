'use strict';

require('./youtube_info.js');
require('dotenv').config()

const Discord = require('discord.js');
const cron = require('node-cron');
const Commando = require('discord.js-commando');
const path = require('path');
const db = require('sqlite');
const instagram = require('instagram-posts');

const { SM_UPDATES_ID , GENERAL_ID } = require("constants");

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

client.login(process.env.TOKEN).then(() => {
  console.log('Running!');
  Promise.resolve().then(() => db.open("./database.sqlite", { Promise }))
    .then(() => db.migrate()).then(() => {
      cron.schedule('*/30 * * * *', () => {
        const channel = client.channels.get(SM_UPDATES_ID);
        instagram('rrreol999', { count: 1 }).then(posts => {
          var post = posts[0]
          db.get('SELECT post_id FROM Instagram ORDER BY ROWID ASC LIMIT 1;').then((result) => {
            if (result.post_id != post.id) {
              db.run('INSERT INTO Instagram(url, text, post_id) VALUES (?, ?, ?);', post.media, post.text, post.id)
              channel.sendMessage(`${post.text} \n ${post.media}`);
            }
          })
        }, true);
      })
    })
})

client.on("guildMemberAdd", member => {
  // GENERAL
  const channel = client.channels.get(GENERAL_ID);
  // send the message, mentioning the member
  channel.sendMessage(`Welcome to the server, ${member}!`);
});
