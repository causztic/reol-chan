import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { CommandInteractionConsumer } from "./types";
import { getGeneralChannel } from "../util/channel";
import config from "../config";

export const handleInitiation: CommandInteractionConsumer = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  const member = (interaction.member! as GuildMember);
  //EDIT: Check if is arleady a member
  if (member.roles.cache.has(config.roles.member)) {
    await interaction.reply({ content: 'You are arleady a member!' });
    return;
  }
  member.roles.add(config.roles.member);
  
  getGeneralChannel(interaction.client)?.send(
    `Welcome to the server, <@${member.id}>! <:wutGiga:297897855727697921>`
  );

  await interaction.reply({ content: 'You are now a member!' });
};
