import { CommandInteraction, GuildMember } from "discord.js";
import { CommandInteractionConsumer } from "./types";
import { roles } from '../config.json';
import { getGeneralChannel } from "../util/channel";

export const handleInitiation: CommandInteractionConsumer = async (interaction: CommandInteraction): Promise<void> => {
  const member = (interaction.member! as GuildMember);
  member.roles.add(roles.member);
  
  getGeneralChannel(interaction.client)?.send(
    `Welcome to the server, <@${member.id}>! <:wutGiga:297897855727697921>`
  );

  return interaction.reply({ ephemeral: true, content: 'You are now a member!' });
};
