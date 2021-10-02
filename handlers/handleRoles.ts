import {
  CommandInteraction, GuildMember, MessageEmbed,
} from 'discord.js';
import { CommandInteractionConsumer } from './types';

import { isWhiteListedRole } from '../util/role';
import { mustBeInGuild } from '../util/mustBeInGuild';

const listRoles = async (interaction: CommandInteraction) => {
  // TODO: try out multiple embeds
  const embed = new MessageEmbed()
    .setColor(0x42cef5)
    .setDescription('■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n'
      + '**General Roles** \n'
      + 'Admin \n'
      + 'Moderator - For trusted friends to moderate the server \n'
      + 'Member - Default role showing that you joined the server and verified yourself \n'
      + '■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n'
      + '**Woooooo Colors!** \n'
      + 'Options are currently Red, Blue, Green, and Purple \n'
      + '■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n'
      + '**Regional Roles** \n'
      + '**NA:** US East, US Central, US West \n'
      + '**Europe:** Europe, UK, Germany, Scandinavia \n'
      + '**Asia:** SEA, South Asia, India, Japan \n'
      + '**Other:** Australia, South America \n'
      + '■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n');

  return interaction.reply({
    ephemeral: true, content: 'Here is a list of assignable roles!', embeds: [embed],
  });
};

const giveRole = async (interaction: CommandInteraction) => {
  mustBeInGuild(interaction);

  const input = interaction.options.getString('name', true);
  const member = (interaction.member! as GuildMember);

  if (isWhiteListedRole(input)) {
    const role = interaction.guild!.roles.cache.find((role) => role.name.toLowerCase() === input.toLowerCase());

    if (role) {
      member.roles.add(role);

      return interaction.reply({
        content: `You have the ${role.name} role now!`,
      });
    }
  }

  return interaction.reply({
    content: 'This role is unavailable or not found!',
  });
};

const removeRole = async (interaction: CommandInteraction) => {
  mustBeInGuild(interaction);

  const input = interaction.options.getString('name', true);
  const member = (interaction.member! as GuildMember);

  if (isWhiteListedRole(input)) {
    const role = interaction.guild!.roles.cache.find((role) => role.name.toLowerCase() === input.toLowerCase());

    if (role) {
      member.roles.remove(role);

      return interaction.reply({
        content: `You have removed the ${role.name} role!`,
      });
    }
  }

  return interaction.reply({
    content: 'You do not have this role / this role is unremoveable.',
  });
};

export const handleRoles: CommandInteractionConsumer = async (interaction: CommandInteraction): Promise<void> => {
  const subCommand = interaction.options.getSubcommand();
  if (subCommand === 'list') {
    await listRoles(interaction);
  } else if (subCommand === 'give') {
    await giveRole(interaction);
  } else if (subCommand === 'remove') {
    await removeRole(interaction);
  }
};
