'use strict';

require('./youtube_info.js');
require('dotenv').config()

const { getTwitterList } = require('./twitter.js');
const Discord = require('discord.js');
const cron = require('node-cron');
const Commando = require('discord.js-commando');
const path = require('path');
const instagram = require('./instagram.js');
const pg = require('pg');
const request = require('request');
const fs = require('fs');

const aws = require('aws-sdk');
aws.config.region = 'us-west-2';
const S3_BUCKET = process.env.S3_BUCKET;
const s3 = new aws.S3({
  signatureVersion: 'v4'
});

const util = require("./util.js");

// if on heroku and database_url exist, use it with SSL.
if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
} else {
  var pg_client = new pg.Client()
}

const { SM_UPDATES_ID, GENERAL_ID, TEST_ID, MUSIC_VOICE_ID, REOL_CHAN_ID } = require("./constants");

const client = new Commando.Client({
  owner: process.env.OWNER_ID
});

client.registry
  // Registers your custom command groups
  .registerGroups([
    ['youtube', 'Youtube Commands'],
    ['social-media', 'Social Media Commands']
  ])

  // Registers all built-in groups, commands, and argument types
  .registerDefaults()

  // Registers all of your commands in the ./commands/ directory
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.TOKEN)
  .then(() => {
    util.setRandomNowPlaying(client);
    if (process.env.DATABASE_URL) {
      pg.connect(process.env.DATABASE_URL, (err, pg_client) => {
        if (err) catchErrors(err);
        getSocialMedia(pg_client);
      })
    } else {
      pg_client.connect((err) => {
        if (err) catchErrors(err);
        getSocialMedia(pg_client);
      })
    }
    client.channels.get((process.env.NODE_ENV !== undefined) ? TEST_ID : REOL_CHAN_ID).send(`I'm updated!`);
  }, (reason) => { catchErrors(reason) })

var catchErrors = (reason) => {
  console.error(reason)
  client.channels.get(TEST_ID).send(reason)
}

var getLatestInstagramPost = (pgc) => {
  instagram('rrreol999', { count: 3 })
    .then(posts => {
        for (const post of posts) {
          pgc.query('SELECT exists(select 1 from Instagram WHERE post_id=$1)', [post.id], (err, exists) => {
            if (!exists.rows[0].exists) {
              console.log("Adding post: " + post.id)
              console.log(post);
  
              for (const media of post.media){
                client.channels.get((process.env.NODE_ENV !== undefined) ? TEST_ID : SM_UPDATES_ID).send(`${post.text} \n ${media}`);
                sendToS3(media);
              }
              // send to S3 as well
              pgc.query('INSERT INTO Instagram(url, text, post_id) VALUES ($1, $2, $3);', [post.media, post.text, post.id])
            }
          })
        }
      })
}

var sendToS3 = (media) => {
  let s = media.split("/");
  let fileName = s[s.length - 1];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3Params, (err, url) => {
    if(err){
      console.log(err);
    } else {
      // use presigned url to upload
      request(media).pipe(fs.createWriteStream(fileName)).on("finish", function(){
        fs.readFile(fileName, function(err, data){
          request.put(url, {body: data}).on('response', function(response){
            console.log(response.statusCode);
            console.log(response.statusMessage); // 200
            fs.unlinkSync(fileName);
          })
        })
      });
    }
  });
}

var getLatestTwitterPost = (pgc) => {
  getTwitterList().then(posts => {
    posts.each(function(index, post){
      pgc.query('SELECT exists(select 1 from tweets WHERE url=$1)', [post.url], (err, exists) => {
        if (!exists.rows[0].exists) {
          console.log("Adding tweet..");
          console.log(post);
          client.channels.get((process.env.npm_config_test !== undefined) ? TEST_ID : SM_UPDATES_ID)
          .send(`${post.url ? "http://www.twitter.com" + post.url : ""}`);
          pgc.query('INSERT INTO tweets(image, url, tweet) VALUES ($1, $2, $3);', [post.image, post.url, post.tweet])
        }
      })
    })
  })
}

var getSocialMedia = (pgc) => {
  getLatestInstagramPost(pgc)
  getLatestTwitterPost(pgc)
  
  cron.schedule('*/15 * * * *', () => {
    getLatestInstagramPost(pgc)
    getLatestTwitterPost(pgc)
  }, true);

  cron.schedule('*/30 * * * *', () => {
    util.setRandomNowPlaying(client)
  }, true);
}

client.on("guildMemberAdd", member => {
  // GENERAL
  const channel = client.channels.get(GENERAL_ID);
  // send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}! <:wutGiga:297897855727697921>`);
});
