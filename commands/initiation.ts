import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../config';

export default {
  data: new SlashCommandBuilder().setName('initiation').setDescription('Adds yourself to the server'),
  isPublic: true,
  permissions: [
    { id: config.roles.member, type: 1, permission: false },
  ]
};
