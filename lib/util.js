var setRandomNowPlaying = (client) => {
  var items = ["Nier Automata", "Persona 5", "100% Orange Juice", "osu!", 
                   "Hearthstone", "with Okiku-chan", "with Giga-chan"]
  client.user.setGame(items[~~(Math.random() * items.length)])
}

module.exports = { setRandomNowPlaying }