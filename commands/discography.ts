import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../config';

export default {
  data:
    new SlashCommandBuilder().setName('discography').setDescription('Handles discography in #discography')
      .addSubcommandGroup(subCommandGroup =>
        subCommandGroup.setName('song').setDescription('Manage songs').addSubcommand(subCommand =>
          subCommand.setName('add').setDescription('Add a song')
            .addStringOption(option => option.setName('title').setDescription('title').setRequired(true))
            .addIntegerOption(option => option.setName('index').setDescription('track #').setRequired(true))
            .addIntegerOption(option => option.setName('year').setDescription('Release Year').setRequired(true))
            .addIntegerOption(option => option.setName('albumId').setDescription('Album ID'))
            .addStringOption(option => option.setName('link').setDescription('Streaming link'))
        )
      )
      .addSubcommandGroup(subCommandGroup =>
        subCommandGroup.setName('album').setDescription('Manage albums').addSubcommand(subCommand =>
          subCommand.setName('add').setDescription('Add an album')
            .addStringOption(option => option.setName('title').setDescription('title').setRequired(true))
            .addIntegerOption(option => option.setName('year').setDescription('Release Year').setRequired(true))
            .addStringOption(option => option.setName('type').setDescription('Album type (EP | Album | Single)')
              .setRequired(true))
            .addIntegerOption(option => option.setName('image').setDescription('Album URL'))
            .addStringOption(option => option.setName('link').setDescription('Streaming link'))
        )
      ),
  permissions: [
    { id: config.roles.admin, type: 1, permission: true },
    { id: config.roles.moderator, type: 1, permission: true },
  ]
};