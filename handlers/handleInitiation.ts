import { CommandInteraction, GuildMember } from "discord.js";
import { CommandInteractionConsumer } from "./types";
import { getGeneralChannel } from "../util/channel";
import config from "../config";

export const handleInitiation: CommandInteractionConsumer = async (interaction: CommandInteraction): Promise<void> => {
  const member = (interaction.member! as GuildMember);
  member.roles.add(config.roles.member);
  
  getGeneralChannel(interaction.client)?.send(
    `Welcome to the server, <@${member.id}>! <:wutGiga:297897855727697921>`
  );

  return interaction.reply({ content: 'You are now a member!' });
};
