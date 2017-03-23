var Clapp = require('../modules/clapp-discord');
const { youtube_id, youtube } = require('../youtube_info.js');

module.exports = new Clapp.Command({
  name: "youtube",
  desc: "get stuff from youtube!",
  fn: (argv, context) => {
    if (argv.args.id == 'id') {
      return youtube_id
    }
    if (argv.args.id == "latest") {
      return new Promise((fulfill, reject) => {
        youtube.search.list(params = { part: "id", channelId: youtube_id, key: process.env.YOUTUBE_API_KEY, order: "date" }, callback = (err, response) => {
          fulfill(`http://youtu.be/${response.items[0].id.videoId}`)
        });
      });
    } else {
      return "Coming soon!"
    }
  },
  args: [{
    name: 'id',
    desc: 'Gets the ID of REOL\'s youtube channel.',
    type: 'string',
    required: false,
    default: ''
  }, {
    name: 'latest',
    desc: "Gets her latest video.",
    type: "string",
    require: false,
    default: ''
  }],
  flags: []
});
