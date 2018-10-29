'use strict';

var twitter = require('../lib/modules/twitter.js');

describe("Twitter", function() {
  let options = {
    url: 'https://twitter.com/causztic',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
    }
  };
  test("it should scrape a post properly", () => {
    return twitter.getTwitterList(options).then(data => {
      expect(data).toBeDefined();
    });
  });
});