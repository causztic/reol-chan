const request = require('request');
const cheerio = require('cheerio');

var options = {
  url: 'https://www.twitter.com/RRReol',
  headers: {
    'User-Agent': 'request'
  }
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(body);
    var items = $("#stream-items-id .stream-item:not(.js-pinned)").map(function(i, el){
      var text = $(this).find(".js-tweet-text-container p").text();
      var url = $(this).find(".tweet-timestamp").attr("href");
      var image = $(this).find(".AdaptiveMedia-photoContainer").data("image-url");

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
          client.channels.get((process.env.npm_config_test !== undefined) ? TEST_ID : SM_UPDATES_ID)
          .send(`${post.url ? "http://www.twitter.com" + post.url : ""}`);
          pgc.query('INSERT INTO tweets(image, url, tweet) VALUES ($1, $2, $3);', [post.image, post.url, post.text])
        }
      })
    })
  })
}

module.exports = { getLatestTwitterPost };
