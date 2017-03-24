var Clapp = require('../modules/clapp-discord');
const { youtube_id, youtube } = require('../youtube_info.js');

var getVideoPromise = (type) => {
    return new Promise((fulfill, reject) => {
      youtube.search.list(params = { part: "id", channelId: youtube_id, key: process.env.YOUTUBE_API_KEY, order: "date" }, callback = (err, response) => {
        var index = 0
        if (type == "random"){
          var idx = response.items.length() - 1
          index = Math.floor(Math.random() * ldx);
        }
        fulfill(`http://youtu.be/${response.items[index].id.videoId}`)
      });
    });
}

module.exports = new Clapp.Command({
  name: "youtube",
  desc: "get stuff from youtube!",
  fn: (argv, context) => {
    if (argv.flags.id) {
      return youtube_id
    }
    if (argv.flags.latest) {
      return getVideoPromise("first");
    } 
    if (arg.flags.random) {
      return getVideoPromise("random");
    }
    return "Coming soon!"
  },
  args: [],
  flags: [{
    name: 'id',
    desc: 'Gets the ID.',
    alias: 'i',
    type: 'boolean',
    default: false
  }, {
    name: 'latest',
    desc: "Gets the latest video.",
    alias: 'l',
    type: 'boolean',
    default: false
  }, {
    name: 'random',
    desc: "Gets a random video!",
    alias: 'r',
    type: 'boolean',
    deafult: false
  }]
});
