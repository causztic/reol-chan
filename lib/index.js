'use strict';

require ('./youtube_info.js');

const fs      = require('fs');
const Clapp   = require('./modules/clapp-discord');
const cfg     = require('../config.js');
const pkg     = require('../package.json');
const Discord = require('discord.js');
const pshb    = require('pubsubhubbub');
const bot     = new Discord.Client();

var app = new Clapp.App({
  name: cfg.name,
  desc: pkg.description,
  prefix: cfg.prefix,
  version: pkg.version,
  onReply: (msg, context) => {
    // Fired when input is needed to be shown to the user.
    context.msg.reply(msg).then(bot_response => {
      if (cfg.deleteAfterReply.enabled) {
        context.msg.delete(cfg.deleteAfterReply.time)
          .then(msg => console.log(`Deleted message from ${msg.author}`))
          .catch(console.log);
        bot_response.delete(cfg.deleteAfterReply.time)
          .then(msg => console.log(`Deleted message from ${msg.author}`))
          .catch(console.log);
      }
    });
  }
});

// Load every command in the commands folder
fs.readdirSync('./lib/commands/').forEach(file => {
  app.addCommand(require("./commands/" + file));
});

bot.on('message', msg => {
  // Fired when someone sends a message

  if (app.isCliSentence(msg.content)) {
    app.parseInput(msg.content, {
      msg: msg
      // Keep adding properties to the context as you need them
    });
  }
});

bot.login(cfg.token).then(() => {
  console.log('Running!');
});

// pubsubhubbub for youtube and twitter notifications.
// const topic = "http://push-pub.appspot.com/feed"
// const hub = "http://pubsubhubbub.appspot.com/"

// var subscriber = pshb.createServer({
//   callbackUrl: "https://discordapp.com/api/webhooks/294513225632972802/a2_sN0x8_ROeRBYjEEhIWwxgFsOW--FsFK-YRsV_UpOnuya1FC5KCwMOQx-VQx5Ga-mG"
// })

// subscriber.on("subscribe", (data) => {
//   console.log(data.topic + " subscribed.");
// })

// subscriber.on("feed", (data) => {
//   console.log(data);
// })

// subscriber.listen(process.env.PORT || 6000)
// subscriber.on("listen", () => {
//   subscriber.subscribe(topic, hub, (err) => {
//     if (err){
//       console.log("Failed subscription.")
//     }
//   })
// })