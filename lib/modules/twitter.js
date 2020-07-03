const request = require('request');
const DomParser = require('dom-parser');
const parser = new DomParser();

const s3 = require('./s3.js');
const { getChannel, catchErrors } = require('./../util.js');

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

let getLatestTwitterPost = (pgc, client) => {
  request('https://mobile.twitter.com/RRReol', function(error, response, body) {

    if (!error && response.statusCode == 200) {
      const dom = parser.parseFromString(body)
      const items = dom.getElementsByClassName("tweet").map(function(tweet) {
        const url = `https://www.twitter.com${tweet.getAttribute("href")}`
        const text = tweet.getElementsByClassName("dir-ltr")[0].textContent
        return { text, url, image: undefined, images: []}
      });

      if (items) {
        items.forEach(function(post){
          pgc.query('SELECT exists(select 1 from tweets WHERE url=$1)', [post.url], (err, exists) => {
            if (err) { catchErrors(client, err); }
            if (!exists.rows[0].exists) {
              console.log(`Adding tweet ${post.url}`);
              client.channels.get(getChannel(SM_UPDATES_ID))
              .send(`${post.url ? post.url : ""}`);
              pgc.query('INSERT INTO tweets(image, url, tweet) VALUES ($1, $2, $3);', [post.image, post.url, post.text])
              console.log("Uploading images..");
              post.images.forEach(image => {
                s3.sendToS3(image);
              });
            }
          })
        })
      }
    } else {
      console.error(error);
    }
  });
}

module.exports = { getLatestTwitterPost };
