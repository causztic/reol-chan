const { TEST_ID } = require("./constants");

const items = [
  {name: "幽居のワルツ", activityType: "LISTENING" },
  {name: "サイサキ", url: "https://open.spotify.com/track/3b5Bl1G2E5YO0rbkI8FQGX?si=H8zZXTlfTdiAmRtRQPzLNA", activityType: "LISTENING" },
  {name: "激白", url: "https://open.spotify.com/track/6f0nePKuRRQFfLeROOkt7F?si=dJl_UGsaSGCcgqx9juSIaw", activityType: "LISTENING" },
  {name: "十中ハ九", activityType: "LISTENING" },
  {name: "煩悩遊戯", activityType: "LISTENING" },
  {name: "ーMANDARA FACTー", activityType: "LISTENING" },
  {name: "真空オールドローズ", activityType: "LISTENING" },
  {name: "ミラージュ", activityType: "LISTENING" },
  {name: "SAIREN", url: "https://open.spotify.com/track/3BV1QRGugT7MxBTmAdymK4?si=30h8C9ATSOKQI63Gg410CQ", activityType: "LISTENING" },
  {name: "秋映", activityType: "LISTENING" },
  {name: "劣等上等", activityType: "LISTENING" },
  {name: "mede:mede -JJJ remix-", activityType: "LISTENING" },
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

let getChannel = (channel) => {
  return (process.env.npm_config_test !== undefined) ? TEST_ID : channel;
}

module.exports = { setRandomNowPlaying, getChannel }