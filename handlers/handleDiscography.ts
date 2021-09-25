import { CommandInteraction } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { CommandInteractionConsumer } from "./types";

const prisma = new PrismaClient();

const addSongToDiscography = async (interaction: CommandInteraction): Promise<void> => {
  const title = interaction.options.getString('title', true);
  const year = interaction.options.getInteger('year', true);
  const index = interaction.options.getInteger('index', true);
  const link = interaction.options.getString('link');

  await prisma.songs.create({
    data: {
      title,
      year,
      index,
      link,
    }
  });
};

export const handleDiscography: CommandInteractionConsumer = async (interaction: CommandInteraction): Promise<void> => {
  const subCommand = interaction.options.getSubcommand(true);

  if (subCommand === 'add') {
    await addSongToDiscography(interaction);
  }
};
