var Clapp = require('../modules/clapp-discord');
const { youtube_id, youtube } = require('../youtube_info.js');

module.exports = new Clapp.Command({
  name: "youtube",
  desc: "get stuff from youtube!",
  fn: (argv, context) => {
    if (argv.flags.id) {
      return youtube_id
    }
    if (argv.flags.latest) {
      return new Promise((fulfill, reject) => {
        youtube.search.list(params = { part: "id", channelId: youtube_id, key: process.env.YOUTUBE_API_KEY, order: "date" }, callback = (err, response) => {
          fulfill(`http://youtu.be/${response.items[0].id.videoId}`)
        });
      });
    } else {
      return "Coming soon!"
    }
  },
  args: [],
  flags: [{
    name: 'id',
    desc: 'Gets the ID of REOL\'s youtube channel.',
    alias: 'i',
    type: 'boolean',
    default: false
  }, {
    name: 'latest',
    desc: "Gets the latest video on REOL\'s youtube channel.",
    alias: 'l',
    type: 'boolean',
    default: false
  }]
});
