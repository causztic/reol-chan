import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionData } from "discord.js";

export interface ApplicationCommandResponse {
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

// TODO: update with multiple types if needed
declare type Permission = { id: string, type: 1, permission: boolean };
export interface SlashCommandWithPermissions { 
  data: SlashCommandBuilder,
  permissions: Permission[],
  isPublic?: boolean 
}

// todo: once @discordjs/builders has their type for toJSON() updated, use that & default_permissions
interface SlashCommandBuilderJSON {
  name: string;
  description: string;
  options: unknown[];
  default_permission: boolean
}

export interface SlashCommandBuilderJSONWithPermissions {
  data: SlashCommandBuilderJSON,
  permissions: Permission[],
}
