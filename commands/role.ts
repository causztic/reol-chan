import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
  .setName('role')
  .setDescription('Run role-based commands')
  .addSubcommand(subcommand => subcommand.setName('list').setDescription('list the assignable server roles'))
