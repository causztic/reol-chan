const items = [
  {name: "平面鏡", url: "https://open.spotify.com/track/0CSh8fiMJWLUb2ISewuu7c?si=plgylQZfRbmEY76xAYFClw", activityType: "LISTENING" },
  {name: "宵々古今", url: "https://open.spotify.com/track/3KLHSYHSmny4sJo2finqy9?si=Ogyk8mjUSEG0LzUvbie5sg", activityType: "LISTENING"},
  {name: "B12", url: "https://open.spotify.com/track/4I7Ifw9MXGipCFQntyn7td?si=mNHZlrw-T32slQWq_j3oyQ", activityType: "LISTENING"},
  // {name: "osu!" },
  // {name: "with Okiku-chan" }, 
  // {name: "with Giga-chan"},
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

module.exports = { setRandomNowPlaying }