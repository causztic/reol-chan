'use strict';

require('dotenv').config();

const fs = require('fs');
const { CommandoClient } = require('discord.js-commando');

const { REOL_CHAN_ID } = require("./constants");
const { getChannel } = require('./util.js');

const client = new CommandoClient({
  owner: process.env.OWNER_ID,
});

client.login(process.env.TOKEN)
  .then(() => {
    let obj = JSON.parse(fs.readFileSync('package.json'));
    client.channels.cache.get(getChannel(REOL_CHAN_ID)).send(
      `I'm updated to ${obj.version}! <:loveReol:305153250888515595>`,
      {
        embed: {
          title: 'Changelog',
          color: 0xEEAAEE,
          description: obj.changelog.join('\n'),
        },
      }
    ).then(() => {
      client.destroy();
      process.exit(0);
    }).catch((error) => {
      console.error(error);
      process.exit(1);
    });
  }, (error) => {
    console.error(error);
    process.exit(1);
  });