import { CommandInteraction } from 'discord.js';
import { handleInitiation } from './handleInitiation';
import { handleRoles } from './handleRoles';
import { CommandInteractionConsumer } from './types';

const COMMAND_MAP: { [key: string]: CommandInteractionConsumer } = {
  role: handleRoles,
  initiation: handleInitiation,
};

export const handleCommandByName = (interaction: CommandInteraction): void => {
  const name = interaction.commandName;
  COMMAND_MAP[name]?.(interaction);
};
