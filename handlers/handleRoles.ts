import {
  CommandInteraction, GuildMember, Message, MessageEmbed,
} from 'discord.js';
import { getGeneralChannel } from '../util/channel';
import { isMember } from '../util/member';
import { mustBeInGuild } from '../util/mustBeInGuild';
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
  'member',
  'red', 'green', 'blue', 'purple',
  'scandinavia', 'us central', 'us east', 'us west', 'uk', 'europe', 'germany',
  'sea', 'japan', 'australia', 'south america', 'india', 'south asia',
];

// TODO: refactor
const giveRole = async (interaction: CommandInteraction) => {
  mustBeInGuild(interaction);

  const input = interaction.options.getString('name', true);
  const member = (interaction.member! as GuildMember);

  if (WHITELISTED_ROLES.find((role) => role === input.toLowerCase())) {
    const role = interaction.guild!.roles.cache.find((role) => role.name.toLowerCase() === input.toLowerCase());

    if (role) {
      if (isMember(member) && role.name.toLowerCase() !== 'member') {
        member.roles.add(role);
        return interaction.reply({
          ephemeral: true, content: `You have the ${role.name} role now!`,
        });
      } 
      
      if (!isMember(member) && role.name.toLowerCase() === 'member') {
        // non members can only give member role to themselves
        member.roles.add(role);
        getGeneralChannel(interaction.client)?.send(
          `Welcome to the server, <@${member.id}>! <:wutGiga:297897855727697921>`
        );

        return interaction.reply({ ephemeral: true, content: 'You are now a member!' });
      }
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
