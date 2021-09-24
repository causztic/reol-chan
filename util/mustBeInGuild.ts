import { CommandInteraction, GuildMember } from "discord.js";

export class MustBeInGuildError extends Error {}

export const mustBeInGuild = (interaction: CommandInteraction): void => {
  if (interaction.guild === null || !(interaction.member instanceof GuildMember)) {
    throw new MustBeInGuildError();
  }
};
