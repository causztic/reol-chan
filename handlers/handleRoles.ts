import { CommandInteraction, EmbedField, MessageEmbed } from "discord.js";
import { CommandInteractionConsumer } from "./types";

const listRoles = async (interaction: CommandInteraction) => {
  // fields max is 25
  const embed = new MessageEmbed()
    .setColor(0x42cef5)
    .setDescription("■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n"
      + "**General Roles** \n"
      + "Admin \n"
      + "Moderator - For trusted friends to moderate the server \n"
      + "Member - Default role showing that you joined the server and verified yourself \n"
      + "■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n"
      + "**Woooooo Colors!** \n"
      + "Options are currently Red, Blue, Green, and Purple \n"
      + "■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n"
      + "**Regional Roles** \n"
      + "**NA:** US East, US Central, US West \n"
      + "**Europe:** Europe, UK, Germany, Scandinavia \n"
      + "**Asia:** SEA, South Asia, India, Japan \n"
      + "**Other:** Australia, South America \n"
      + "■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n");

  await interaction.reply({
    ephemeral: true, content: 'Here is a list of assignable roles!', embeds: [embed]
  });
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
