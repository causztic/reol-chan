const google = require("googleapis");
const youtube_id = "UCB6pJFaFByws3dQj4AdLdyA";
const youtube = google.youtube("v3")

var getVideoPromise = (type) => {
    return new Promise((fulfill, reject) => {
      var maxResults = 1
      var index  = 0
      if (type == "random"){
        maxResults = 50
      }
      youtube.search.list(params = { part: "id", channelId: youtube_id, maxResults: maxResults, key: process.env.YOUTUBE_API_KEY, order: "date" }, callback = (err, response) => {
        if (type == "random"){
          var max = response.items.length - 1
          index = Math.floor(Math.random() * (max - 1)) + 1;
        }
        fulfill(`http://youtu.be/${response.items[index].id.videoId}`)
      });
    });
}
module.exports = {youtube_id, youtube, getVideoPromise};