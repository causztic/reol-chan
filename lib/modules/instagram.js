'use strict';

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

let writeStoryToDatabase = (pgc, client, story) => {
  pgc.query('SELECT exists(select 1 from stories WHERE code=$1)', [story.code], (err, exists) => {
    if (err) { catchErrors(err); }
    if (!exists.rows[0].exists) {
      client.channels.get(getChannel(SM_UPDATES_ID)).send(`${story.url}`);
      s3.sendToS3(story.url);
      pgc.query('INSERT INTO stories(code, url) VALUES ($1, $2);', [post.code, post.url])
    }
  })
}

let getSpecificInstagramPost = async (pgc, client, shortcode) => {
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

  await client.ns.getPostsFrom(graphObject)
    .then(post => {
      writeToDatabase(pgc, client, post);
    })
}

let getLatestInstagramPost = async (pgc, client) => {
  await client.ns.getPosts(3)
    .then(posts => {
      for (const post of posts) {
        writeToDatabase(pgc, client, post);
      }
    })
}

let getStories = async (pgc, client) => {
  try {
    await client.ns.login(process.env.USERNAME, process.env.PASSWORD);
    const stories = await client.ns.getStories();
    for (const story of stories) {
      writeStoryToDatabase(pgc, client, story);
    }
  } catch(error) {
    console.error(error);
  }
}

module.exports = { getSpecificInstagramPost, getLatestInstagramPost, getStories }