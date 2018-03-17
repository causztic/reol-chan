'use strict';
const s3 = require('./s3.js')
const NightStalker = require('night-stalker').default;
const ns = new NightStalker('rrreol999');

let getLatestInstagramPost = async (pgc, client) => {
  await ns.getPosts(3)
    .then(posts => {
      for (const post of posts) {
        pgc.query('SELECT exists(select 1 from Instagram WHERE post_id=$1)', [post.id], (err, exists) => {
          if (!exists.rows[0].exists) {
            console.log("Adding post: " + post.id)
            console.log(post);
            if (post.isVideo) {
              client.channels.get((process.env.npm_config_test !== undefined) ? TEST_ID : SM_UPDATES_ID).send(`${post.video}`);
              s3.sendToS3(video);
            } else {
              for (const image of post.image){
                client.channels.get((process.env.npm_config_test !== undefined) ? TEST_ID : SM_UPDATES_ID).send(`${image}`);
                s3.sendToS3(image);
              }
            }
            // send to S3 as well
            pgc.query('INSERT INTO Instagram(url, text, post_id) VALUES ($1, $2, $3);', [post.image, post.text, post.id])
          }
        })
      }
    })
}

module.exports = { getLatestInstagramPost }