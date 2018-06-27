const request = require('request');
const cheerio = require('cheerio');

const s3 = require('./s3.js');
const { getChannel } = require('./../util.js');

var options = {
  url: 'https://twitter.com/RRReol',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
  }
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(body);

  //   var items = $("#container #main_content .timeline .tweet .tweet-container").map(function(i, el){
  //     var text = $(this).find(".tweet-text div").text();
  //     var url = $(this).find(".tweet-timestamp").attr("href");
  //     var image = $(this).find(".AdaptiveMedia-photoContainer").data("image-url");
  //     return { text: text, image: image, url: url }
  //   });
  //   console.log(items);
  //   return null;
  // }
    var items = $("#stream-items-id .stream-item:not(.js-pinned)").map(function(i, el){
      var text = $(this).find(".js-tweet-text-container p").text();
      var url = $(this).find(".tweet-timestamp").attr("href");
      var image = $(this).find(".AdaptiveMedia-photoContainer").data("image-url");
      if (image) {
        s3.sendToS3(image);
      }
      return { text: text, image: image, url: url }
    });
    return items;
  }
}

let getTwitterList = () => {
  return new Promise((fulfill, reject) => {
    request(options, function(error, response, body){
      var items = callback(error, response, body);
      return fulfill(items);
    });
  });
}

let getLatestTwitterPost = (pgc, client) => {
  getTwitterList().then(posts => {
    posts.each(function(index, post){
      pgc.query('SELECT exists(select 1 from tweets WHERE url=$1)', [post.url], (err, exists) => {
        if (!exists.rows[0].exists) {
          console.log("Adding tweet..");
          console.log(post);
          client.channels.get(getChannel(SM_UPDATES_ID))
          .send(`${post.url ? "https://twitter.com" + post.url : ""}`);
          pgc.query('INSERT INTO tweets(image, url, tweet) VALUES ($1, $2, $3);', [post.image, post.url, post.text])
        }
      })
    })
  })
}

module.exports = { getLatestTwitterPost };
