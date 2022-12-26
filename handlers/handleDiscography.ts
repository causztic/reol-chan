import { CommandInteraction, TextChannel } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { CommandInteractionConsumer } from "./types";
import { createEmbed } from "../util/embed";

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

const populateChannelWithAlbum = async (interaction: CommandInteraction): Promise<void> => {
  const albumId = interaction.options.getInteger('albumid', true);
  const channel = interaction.options.getChannel('channel', true);

  const album = await prisma.albums.findFirst({
    where: { id: albumId },
    include: { songs: true }
  });

  if (album === null) {
    interaction.followUp({
      ephemeral: true, content: 'Album not found.'
    });
  } else {
    const embed = createEmbed(album);
    const foundChannel = interaction.client.channels.cache.find(c => c === channel);

    (foundChannel as TextChannel)?.send({ embeds: [embed] });

    interaction.followUp({
      ephemeral: true, content: 'Album populated in channel.'
    });
  }
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
    } else if (subCommand === 'populate') {
      await populateChannelWithAlbum(interaction);
    }
  }
};
