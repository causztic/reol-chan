import {
  CommandInteraction, GuildMember, MessageEmbed,
} from 'discord.js';
import { CommandInteractionConsumer } from './types';

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

// TODO: move to constants file
const WHITELISTED_ROLES = [
  'red', 'green', 'blue', 'purple',
  'scandinavia', 'us central', 'us east', 'us west', 'uk', 'europe', 'germany',
  'sea', 'japan', 'australia', 'south america', 'india', 'south asia',
];

const giveRole = async (interaction: CommandInteraction) => {
  const input = interaction.options.getString('name', true);

  // TODO: throw GuildOnlyError for parent to handle
  if (interaction.guild === null || !(interaction.member instanceof GuildMember)) {
    return interaction.reply({
      ephemeral: true, content: 'This can only be run in the r/reol server.',
    });
  }

  // TODO: only allow members to run other role commands
  // non-members can only /role add member
  if (WHITELISTED_ROLES.find((role) => role === input.toLowerCase())) {
    const role = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() === input.toLowerCase());

    if (role) {
      interaction.member.roles.add(role);
      return interaction.reply({
        ephemeral: true, content: `You have the ${role.name} role now!`,
      });
    }
  }

  return interaction.reply({
    ephemeral: true, content: 'This role is unavailable or not found!',
  });
};

export const handleRoles: CommandInteractionConsumer = async (interaction: CommandInteraction): Promise<void> => {
  const subCommand = interaction.options.getSubcommand();
  if (subCommand === 'list') {
    await listRoles(interaction);
  } else if (subCommand === 'give') {
    await giveRole(interaction);
  } else if (subCommand === 'remove') {
    // TODO: Remove role by name
  }
};
