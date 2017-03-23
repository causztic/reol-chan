const env = require("node-env-file");
const Discord = require("discord.js");
const client = new Discord.Client();

const token = process.env.TOKEN

client.on("ready", () => {
  console.log("I am ready!");
})

client.on("message", message => {
  if (message.content  === "ping"){
    message.channel.sendMessage("pong");
  }
})

client.login(token)