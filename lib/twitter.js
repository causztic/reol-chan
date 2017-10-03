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
    var items = $("#stream-items-id .content").map(function(i, el){ 
      var text = $(this).find(".js-tweet-text-container p").text();
      var image = $(this).find(".AdaptiveMedia-photoContainer").data("image-url");
      return { text: text, image: image }
    });
    return items;
  }
}

var getTwitterList = () => {
  return new Promise((fulfill, reject) => {
    request(options, function(error, response, body){
      var items = callback(error, response, body);
      return fulfill(items);
    });
  });
}

module.exports = {getTwitterList};
