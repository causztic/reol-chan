import config from "../config";
import { Client, TextChannel } from "discord.js";

export const getGeneralChannel = (client: Client): TextChannel | undefined => {
  const channel = client.channels.cache.find(
    channel => channel.id === config.generalChannelId
  );

  if (channel !== undefined) {
    return (channel as TextChannel);
  }
};

export const getSocialMediaChannel = (client: Client): TextChannel | undefined => {
  const channel = client.channels.cache.find(
    channel => channel.id === config.socialMediaChannelId
  );

  if (channel !== undefined) {
    return (channel as TextChannel);
  }
};