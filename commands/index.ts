/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* eslint-disable global-require */

import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../config';
import { 
  ApplicationCommandResponse, 
  SlashCommandBuilderJSONWithPermissions, 
  SlashCommandWithPermissions } from './types';

const rest = new REST({ version: '9' }).setToken(config.token);

const readCommandsFromDirectory = () => {
  const commands: Record<string, SlashCommandBuilderJSONWithPermissions> = {};
  const commandFiles = fs.readdirSync('./commands').filter(
    (file) => file.endsWith('.ts') && !file.startsWith('index') && !file.startsWith('types')
  );
  
  // eslint-disable-next-line no-restricted-syntax
  for (const file of commandFiles) {
    console.log(`Registering ${file}`);
    const { data, isPublic, permissions }: SlashCommandWithPermissions = require(`./${file}`).default;
  
    // https://discord.com/developers/docs/interactions/application-commands
    commands[data.name] = {
      data: { ...data.toJSON(), default_permission: isPublic ?? false },
      permissions,
    };
  }

  return commands;
};

const registerCommands = async (commands: Record<string, SlashCommandBuilderJSONWithPermissions>) => {
  const commandData = Object.values(commands).map((command) => command.data);
  const addedCommands = (await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    { body: commandData },
  ) as ApplicationCommandResponse[]);

  console.log('Successfully registered application commands.');
  return addedCommands;
};

const updatePermissions = async (
  commands: Record<string, SlashCommandBuilderJSONWithPermissions>,
  addedCommands: ApplicationCommandResponse[]
) => {
  // for each added command, we retrieve the corresponding permissions to apply to the command
  const permissionsPayload = addedCommands.map((addedCommand) => {
    return {
      id: addedCommand.id,
      permissions: commands[addedCommand.name].permissions
    };
  });

  await rest.put(
    Routes.guildApplicationCommandsPermissions(config.clientId, config.guildId),
    { body: permissionsPayload }
  );
};

(async () => {
  try {
    const commands = readCommandsFromDirectory();
    const addedCommands = await registerCommands(commands);
    await updatePermissions(commands, addedCommands);

  } catch (error) {
    console.error(error);
  }
})();
