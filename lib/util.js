const { TEST_ID } = require("./constants");

const items = [
  {name: "金字塔", url: "https://open.spotify.com/track/02HNBwIheiZAuzC8p1QBPn", activityType: "LISTENING" },
  {name: "HYPE MODE", url: "https://open.spotify.com/track/4BLp8YfoGLtspzHhN6bsi9", activityType: "LISTENING" },
  {name: "ゆーれいずみー", url: "https://open.spotify.com/track/0NsnScldVs3A8psn3uCLZr", activityType: "LISTENING" },
  {name: "-ムーブのための試奏曲 Nr.4-", url: "https://open.spotify.com/track/5f67BMdyuOf0VNYFFnuwRs", activityType: "LISTENING" },
  {name: "ハーメルン", url: "https://open.spotify.com/track/76zCFsWIre89p4HQrRerbf", activityType: "LISTENING" },
  {name: "un, deux, trois", url: "https://open.spotify.com/track/2NXqn7SaFWJmIpjwu9Ae6c", activityType: "LISTENING" },
  {name: "insider", url: "https://open.spotify.com/track/0GY0AgfcwuKDUHaZgRv4QM", activityType: "LISTENING" },
  {name: "ダリ", url: "https://open.spotify.com/track/7f4PaZuWlLM4ZsPTZIPLe1", activityType: "LISTENING" },
  {name: "-ルネの小品 Nr.9-", url: "https://open.spotify.com/track/65leI2ZvSJRWtGozl5g1tf", activityType: "LISTENING" },
  {name: "GRIMOIRE", url: "https://open.spotify.com/track/60RClClRsm1QQCXVuaRMN5", activityType: "LISTENING" },
  {name: "1LDK", url: "https://open.spotify.com/track/27MVvs7ErNpl81dkwwNS5i", activityType: "LISTENING" },
  {name: "with Okiku-chan" },
  {name: "with Giga-chan"}
]

let setRandomNowPlaying = (client) => {
  let item = items[~~(Math.random() * items.length)]
  let options = undefined
  if (item.activityType !== undefined){
    options = {type: item.activityType}
    if (item.url !== undefined)
      options.url = item.url
    client.user.setActivity(item.name, options)

  } else {
    client.user.setActivity(item.name);
  }
}

let catchErrors = (client, reason) => {
  console.error(reason);
  client.channels.cache.get(TEST_ID).send(reason);
}

/* Checks whether the bot is being run locally for testing, and if so sends bot responses to designated testing channel.
 * If not being run locally, sends responses to the channel that was passed as the argument.
 */
let getChannel = (channel) => {
  return (process.env.npm_config_test !== undefined) ? TEST_ID : channel;
}

// Checks that the user is sending a command in the #bot-stuff channel
let inCommandChannel = (msg) => {
  return msg.channel.id === getChannel(BOT_STUFF_ID);
}

module.exports = { catchErrors, setRandomNowPlaying, getChannel, inCommandChannel }
