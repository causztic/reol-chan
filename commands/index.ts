/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* eslint-disable global-require */

import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildId, token } from '../config.json';
import { ApplicationCommandOptionData } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

interface ApplicationCommandResponse {
  id: string,
  application_id: string,
  name: string,
  description: string,
  version: string,
  default_permission: boolean,
  type: number,
  guild_id: string,
  options?: ApplicationCommandOptionData[],
}

// TODO: fix types
const commands: Record<string, any> = {};
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.ts') && !file.startsWith('index'));

// eslint-disable-next-line no-restricted-syntax
for (const file of commandFiles) {
  console.log(`Registering ${file}`);

  const { data, permissions, isPublic }: { data: SlashCommandBuilder; permissions: any[]; isPublic?: boolean } 
    = require(`./${file}`).default;

  // https://discord.com/developers/docs/interactions/application-commands
  commands[data.name] = {
    data: { ...data.toJSON(), default_permission: isPublic ?? false },
    permissions,
  };
}

const rest = new REST({ version: '9' }).setToken(token);

// TODO: refactor
(async () => {
  try {
    const commandData = Object.values(commands).map((command) => command.data);
    const addedCommands = (await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commandData },
    ) as ApplicationCommandResponse[]);
    
    console.log('Successfully registered application commands.');

    // for each added command, we retrieve the corresponding permissions to apply to the command
    addedCommands.forEach(async (addedCommand) => {
      const permissions = commands[addedCommand.name].permissions;
      await rest.put(
        Routes.applicationCommandPermissions(clientId, guildId, addedCommand.id),
        { body: { permissions } }
      );
    });

  } catch (error) {
    console.error(error);
  }
})();
