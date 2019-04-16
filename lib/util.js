const { TEST_ID } = require("./constants");

const items = [
  {name: "ウテナ", url: "https://open.spotify.com/track/4j8iEmJZidEu5hwM7lBtVM", activityType: "LISTENING" },
  {name: "たい", url: "https://open.spotify.com/track/4gtvQM3JWzRNYwGF1iYkmb", activityType: "LISTENING" },
  {name: "シンカロン", url: "https://open.spotify.com/track/15eeDH2c5RDLvSKY9qjldS", activityType: "LISTENING" },
  {name: "失楽園", url: "https://open.spotify.com/track/3yXwighahVa3l4v71wZ0LT", activityType: "LISTENING" },
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