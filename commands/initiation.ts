import { SlashCommandBuilder } from '@discordjs/builders';
import { roles } from '../config.json';

export default {
  data: new SlashCommandBuilder().setName('initiation').setDescription('Adds yourself to the server'),
  isPublic: true,
  permissions: [
    { id: roles.member, type: 1, permission: false },
  ]
};
