import { Client, TextChannel } from "discord.js";
import { generalChannelId } from "../config.json";

export const getGeneralChannel = (client: Client): TextChannel | undefined => {
  const channel = client.channels.cache.find(
    channel => channel.id === generalChannelId
  );

  if (channel !== undefined) {
    return (channel as TextChannel);
  }
};