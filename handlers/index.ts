import { CommandInteraction } from "discord.js";
import { handleRoles } from "./handleRoles";
import { CommandInteractionConsumer } from "./types";

const COMMAND_MAP: { [key: string]: CommandInteractionConsumer } = {
  role: handleRoles
}

export const handleCommandByName = (interaction: CommandInteraction) => {
  const name = interaction.commandName;
  COMMAND_MAP[name]?.(interaction);
}