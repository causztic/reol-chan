import { CommandInteraction, GuildMember } from "discord.js";
import { CommandInteractionConsumer } from "./types";
import { getGeneralChannel } from "../util/channel";
import config from "../config";

const ONE_WEEK = 604800000; //milliseconds

export const handleInitiation: CommandInteractionConsumer = async (interaction: CommandInteraction): Promise<void> => {
  const member = (interaction.member! as GuildMember);

  const createdDate = member.user.createdTimestamp;
  const currentDate = Date.now();

  const accountAge = currentDate - createdDate;
  
  if (accountAge < ONE_WEEK) {
      return interaction.reply({ ephemeral: true, content: 'Account age invalid, your account must be at least 1 week old to become a Member.' });
  }
  member.roles.add(config.roles.member);
  
  getGeneralChannel(interaction.client)?.send(
    `Welcome to the server, <@${member.id}>! <:wutGiga:297897855727697921>`
  );

  return interaction.reply({ content: 'You are now a member!' });
};