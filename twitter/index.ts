import fetch from 'node-fetch';
import { Client } from "discord.js";
import config from 'config';

declare type TwitterTimeline = {
  data: { id: string; text: string}[];
  meta: {
    "oldest_id": string;
    "newest_id": string;
    "result_count": number;
    "next_token": string;
  }
}

export const checkTwitter = async (client: Client): Promise<void> => {
  // call twitter API
  const response = await fetch('https://api.twitter.com/2/users/849666966/tweets', { 
    headers: { 
      Authorization: `Bearer ${config.twitterToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const data: TwitterTimeline = await response.json();
  }
};
