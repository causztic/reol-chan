import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
  .setName('role')
  .setDescription('Run role-based commands')
  .addSubcommand(subcommand => subcommand.setName('list').setDescription('list the assignable server roles'))
  .addSubcommand(subcommand =>
    subcommand.setName('give').setDescription('Give yourself a new role')
      .addStringOption(option => option.setName('name').setDescription('The name of the role').setRequired(true))
  );