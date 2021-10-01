import fetch from 'node-fetch';
import { Client } from "discord.js";
import config from '../config';
import { PrismaClient } from '.prisma/client';
import { getSocialMediaChannel } from '../util/channel';

declare type TwitterTimeline = {
  data: { id: string; text: string}[];
  meta: {
    "oldest_id": string;
    "newest_id": string;
    "result_count": number;
    "next_token": string;
  }
}

const dbClient = new PrismaClient();

export const checkTwitter = async (client: Client): Promise<void> => {
  // call twitter API
  const response = await fetch('https://api.twitter.com/2/users/849666966/tweets?max_results=5', { 
    headers: { 
      Authorization: `Bearer ${config.twitterToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const { data } = await response.json() as TwitterTimeline;
    const tweetIds = data.map(datum => datum.id);
    // FIXME: older entries have url, replace with tweet id
    const foundTweets = (await dbClient.tweets.findMany(
      { 
        where: { url: { in: tweetIds }},
        select: {
          url: true
        }
      }
    )).map(tweet => tweet.url);

    const newTweets = data.filter((datum) => !foundTweets.includes(datum.id));

    dbClient.tweets.createMany({
      data: data.map((datum) => (
        { url: datum.id, tweet: datum.text }
      ))
    });

    newTweets.forEach((tweet) => {
      const url = `https://www.twitter.com/RRReol/status/${tweet.id}`;
      getSocialMediaChannel(client)!.send(url);
    });
  }
};
