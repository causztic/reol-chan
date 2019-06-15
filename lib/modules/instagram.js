'use strict';

const { NightStalker } = require('night-stalker');
const s3 = require('./s3.js');
const { getChannel } = require('./../util.js');

let writeToDatabase = (pgc, client, post) => {
  pgc.query('SELECT exists(select 1 from Instagram WHERE post_id=$1)', [post.id], (err, exists) => {
    if (err) { catchErrors(err); }
    if (!exists.rows[0].exists) {
      for (const media of post.media){
        client.channels.get(getChannel(SM_UPDATES_ID)).send(`${media}`);
        s3.sendToS3(media);
      }
      if (post.description.length > 0)
        client.channels.get(getChannel(SM_UPDATES_ID)).send(`${post.description}`);
      // send to S3 as well
      pgc.query('INSERT INTO Instagram(url, text, post_id) VALUES ($1, $2, $3);', [post.media, post.description, post.id])
    }
  })
}

let getSpecificInstagramPost = async (pgc, client, shortcode) => {
  const ns = await NightStalker.loadBrowser();
  ns.setUserName('rrreol999');

  const graphObject = {
    id: '1',
    shortcode: shortcode,
    media: '',
    thumbnail: '',
    timestamp: '',
  };

  graphObject.setMedia = (media) => {
    graphObject.media = media;
  }

  graphObject.setDescription = (description) => {
    graphObject.description = description;
  }

  await ns.getPostsFrom(graphObject)
    .then(post => {
      writeToDatabase(pgc, client, post);
    })
  ns.tearDown();
}

let getLatestInstagramPost = async (pgc, client) => {
  const ns = await NightStalker.loadBrowser();
  ns.setUserName('rrreol999');
  await ns.getPosts(3)
    .then(posts => {
      for (const post of posts) {
        writeToDatabase(pgc, client, post);
      }
    })
  ns.tearDown();
}

module.exports = { getSpecificInstagramPost, getLatestInstagramPost }