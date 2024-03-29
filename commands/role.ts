import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../config';
import { SlashCommandWithPermissions } from './types';

export default {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Run role-based commands')
    .addSubcommand(subcommand => subcommand.setName('list').setDescription('list the assignable server roles'))
    .addSubcommand(subcommand =>
      subcommand.setName('give').setDescription('Give yourself a new role')
        .addStringOption(option => option.setName('name').setDescription('The name of the role').setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand.setName('remove').setDescription('Remove a role')
        .addStringOption(option => option.setName('name').setDescription('The name of the role').setRequired(true))
    ),    
  permissions: [{ id: config.roles.member, type: 1, permission: true }]
} as SlashCommandWithPermissions;