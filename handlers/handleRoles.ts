import { CommandInteraction, MessageEmbed } from "discord.js";
import { CommandInteractionConsumer } from "./types";

const HIDDEN_ROLES = ['Admin', 'Moderator', 'Bae', 'Bot', 'Reolist Nun', 'Nitro Booster', 'Statbot'];

const listRoles = async (interaction: CommandInteraction) => {
  const roles = await interaction.guild?.roles.fetch();
  const roleNames = roles?.filter((role) => !HIDDEN_ROLES.includes(role.name))
                          .map((role) => ({ name: role.name, value: role.name }));

  if (roleNames) {
    // fields max is 25
    const embed = new MessageEmbed().addFields(...roleNames);

    await interaction.reply({
      ephemeral: true, content: 'Here is a list of assignable roles!', embeds: [embed]
    });
  }
}

export const handleRoles: CommandInteractionConsumer = async (interaction: CommandInteraction): Promise<void> => {
  const subCommand = interaction.options.getSubcommand();
  if (subCommand === 'list') {
    await listRoles(interaction);
  } else if (subCommand === 'add') {
    // TODO: Add role by name
  } else if (subCommand === 'remove') {
    // TODO: Remove role by name
  }
}
