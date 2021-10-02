import fetch from 'node-fetch';
import { Client } from "discord.js";
import config from '../config';
import { PrismaClient } from '@prisma/client';
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

declare type TwitterUser = {
  id: string;
  name: string;
}

const dbClient = new PrismaClient();

export const checkTwitter = async (client: Client, user: TwitterUser): Promise<void> => {
  try {
    // call twitter API
    const response = await fetch(`https://api.twitter.com/2/users/${user.id}/tweets?max_results=5`, { 
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

      await dbClient.tweets.createMany({
        data: newTweets.map((datum) => (
          { url: datum.id, tweet: datum.text }
        ))
      });

      // send newest tweet last
      newTweets.reverse().forEach((tweet) => {
        const url = `https://www.twitter.com/${user.name}/status/${tweet.id}`;
        getSocialMediaChannel(client)!.send(url);
      });
    } 
  } catch (error) {
    // TODO: log to testbed
    console.error(error);
  }
};
