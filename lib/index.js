'use strict';

require ('./youtube_info.js');

const Discord = require('discord.js');
const cron    = require('node-cron');
const Commando = require('discord.js-commando');
const path = require('path');

const client = new Commando.Client({
    owner: process.env.OWNER_ID
});

client.registry
    // Registers your custom command groups
    .registerGroups([
        ['youtube', 'Youtube Commands'],
    ])

    // Registers all built-in groups, commands, and argument types
    .registerDefaults()

    // Registers all of your commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(cfg.token).then(() => {
  console.log('Running!');
});

client.on("guildMemberAdd", member => {
  // get the channel by its ID
  const channel = client.channels.get(channelID);
  // send the message, mentioning the member
  channel.sendMessage(`Welcome to the server, ${member}!`);
})

// cron.schedule('* * */1 * * *', () => {
//   Discord.TextChannel("general")
//   client.sendMessage("performing instagram scrape..", );
// }, true);
