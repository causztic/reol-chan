// from https://github.com/kevva/instagram-posts

'use strict';
const arrify = require('arrify');
const getStream = require('get-stream');
const Instagram = require('instagram-screen-scrape');
const limitSizeStream = require('limit-size-stream');
const streamFilter = require('stream-filter');
const twitterText = require('twitter-text');
const s3 = require('./s3.js')

let checkInstagram = (user, opts) => {
	opts = Object.assign({count: 20}, opts);

	const stream = limitSizeStream.obj(new Instagram.InstagramPosts({username: user}), opts.count);
	const filter = streamFilter.obj(data => [opts.filter, opts.hashtags, opts.mentions].every((x, i) => {
		if (x && i === 0) {
			return x(data);
		}

		if (x && i === 1) {
			return arrify(x).every(y => twitterText.extractHashtags(data.text).indexOf(y) !== -1);
		}

		if (x && i === 2) {
			return arrify(x).every(y => twitterText.extractMentions(data.text).indexOf(y) !== -1);
		}

		return true;
	}));

	stream.pipe(filter);

	return getStream.array(filter);
};

let getLatestInstagramPost = (pgc, client) => {
  checkInstagram('rrreol999', { count: 3 })
    .then(posts => {
        for (const post of posts) {
          pgc.query('SELECT exists(select 1 from Instagram WHERE post_id=$1)', [post.id], (err, exists) => {
            if (!exists.rows[0].exists) {
              console.log("Adding post: " + post.id)
              console.log(post);
  
              for (const media of post.media){
                client.channels.get((process.env.npm_config_test !== undefined) ? TEST_ID : SM_UPDATES_ID).send(`${post.text} \n ${media}`);
                s3.sendToS3(media);
              }
              // send to S3 as well
              pgc.query('INSERT INTO Instagram(url, text, post_id) VALUES ($1, $2, $3);', [post.media, post.text, post.id])
            }
          })
        }
      })
}

module.exports = { getLatestInstagramPost }