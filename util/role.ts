import { GuildMember } from "discord.js";

const WHITELISTED_ROLES = [
  'member',
  'red', 'green', 'blue', 'purple',
  'scandinavia', 'us central', 'us east', 'us west', 'uk', 'europe', 'germany',
  'sea', 'japan', 'australia', 'south america', 'india', 'south asia',
];

export const isMember = (member: GuildMember): boolean =>
  (member.roles?.cache.find((role) => role.name === 'Member') !== undefined);

export const isWhiteListedRole = (roleName: string): boolean => 
  WHITELISTED_ROLES.find((role) => role === roleName.toLowerCase()) !== undefined;

export const isMemberRole = (roleName: string): boolean =>
  roleName.toLowerCase() === 'member';
