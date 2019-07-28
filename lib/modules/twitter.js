const request = require('request');
const cheerio = require('cheerio');

const s3 = require('./s3.js');
const { getChannel } = require('./../util.js');

let getTwitterList = (opts) => {
  request(opts, function(error, response, body){

  });
  return new Promise((fulfill, _) => {
    request(opts, function(error, response, body){
      var items = callback(error, response, body);
      return fulfill(items);
    });
  });
}

let getLatestTwitterPost = (pgc, client, url = 'https://twitter.com/RRReol') => {
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(body);
      var items = $("#stream-items-id .stream-item:not(.js-pinned)").map(function(_, __){
        var text = $(this).find(".js-tweet-text-container p").text();
        var url = $(this).find(".tweet-timestamp").attr("href");
        // main image to save
        var image = $(this).find(".AdaptiveMedia-photoContainer").data("image-url");
        var images = [];
        $(this).find(".AdaptiveMedia-photoContainer").map(function(_, el) {
          let temp = $(el).data("image-url");
          if (temp) {
            images.push(temp);
          }
        });
        return { text: text, image: image, url: url, images: images }
      });
      items.each(function(_, post){
        pgc.query('SELECT exists(select 1 from tweets WHERE url=$1)', [post.url], (err, exists) => {
          if (err) { catchErrors(err); }
          if (!exists.rows[0].exists) {
            console.log(`Adding tweet ${post.url}`);
            client.channels.get(getChannel(SM_UPDATES_ID))
            .send(`${post.url ? "https://twitter.com" + post.url : ""}`);
            pgc.query('INSERT INTO tweets(image, url, tweet) VALUES ($1, $2, $3);', [post.image, post.url, post.text])
            console.log("Uploading images..");
            post.images.forEach(image => {
              s3.sendToS3(image);
            });
          }
        })
      })
    } else {
      console.error(error);
    }
  });
}

module.exports = { getLatestTwitterPost };
