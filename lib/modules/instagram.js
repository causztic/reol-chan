'use strict';
const NightStalker = require('night-stalker').default;

const s3 = require('./s3.js');
const { getChannel } = require('./../util.js');

let getLatestInstagramPost = async (pgc, client) => {
  const ns = new NightStalker('rrreol999');
  await ns.getPosts(3)
    .then(posts => {
      for (const post of posts) {
        pgc.query('SELECT exists(select 1 from Instagram WHERE post_id=$1)', [post.id], (err, exists) => {
          if (!exists.rows[0].exists) {
            console.log("Adding post: " + post.id)
            console.log(post);
            if (post.isVideo) {
              client.channels.get(getChannel(SM_UPDATES_ID)).send(`${post.video}`);
              s3.sendToS3(video);
            } else {
              for (const media of post.media){
                client.channels.get(getChannel(SM_UPDATES_ID)).send(`${media}`);
                s3.sendToS3(media);
              }
            }
            // send to S3 as well
            pgc.query('INSERT INTO Instagram(url, text, post_id) VALUES ($1, $2, $3);', [post.media, post.text, post.id])
          }
        })
      }
    })
}

module.exports = { getLatestInstagramPost }