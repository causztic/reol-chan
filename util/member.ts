import { GuildMember } from "discord.js";

export const isMember = (member: GuildMember): boolean => (
  (member.roles?.cache.find((role) => role.name === 'Member') !== undefined)
);