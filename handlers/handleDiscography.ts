import { CommandInteraction } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { CommandInteractionConsumer } from "./types";

const prisma = new PrismaClient();

const addSongToDiscography = async (interaction: CommandInteraction): Promise<void> => {
  const title = interaction.options.getString('title', true);
  const year = interaction.options.getInteger('year', true);
  const index = interaction.options.getInteger('index', true);
  const link = interaction.options.getString('link');
  const albumId = interaction.options.getInteger('albumid');

  const result = await prisma.songs.create({
    data: {
      title,
      year,
      index,
      link,
      albumId,
    }
  });

  interaction.followUp({
    ephemeral: true, content: `Added song ${title}, id: ${result.id}`
  });
};

const addAlbumToDiscography = async (interaction: CommandInteraction): Promise<void> => {
  const title = interaction.options.getString('title', true);
  const year = interaction.options.getInteger('year', true);
  const type = interaction.options.getString('type', true);
  const image = interaction.options.getString('image', true);
  const link = interaction.options.getString('link');

  const result = await prisma.albums.create({
    data: {
      title,
      year,
      image,
      type,
      link,
    }
  });

  interaction.followUp({
    ephemeral: true, content: `Created album ${title}, id: ${result.id}`
  });
};


export const handleDiscography: CommandInteractionConsumer = async (interaction: CommandInteraction): Promise<void> => {
  await interaction.deferReply();

  const subCommandGroup = interaction.options.getSubcommandGroup(true);
  const subCommand = interaction.options.getSubcommand(true);
  
  if (subCommandGroup === 'song') {
    if (subCommand === 'add') {
      await addSongToDiscography(interaction);
    }
  } else if (subCommandGroup === 'album') {
    if (subCommand === 'add') {
      await addAlbumToDiscography(interaction);
    }
  }
};
