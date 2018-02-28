let setRandomNowPlaying = (client) => {
  let items = ["平面鏡", "Doki Doki Literature Club", "100% Orange Juice", "osu!", "with Okiku-chan", "with Giga-chan"]
  client.user.setGame(items[~~(Math.random() * items.length)]);
}

module.exports = { setRandomNowPlaying }