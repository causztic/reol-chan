import { albums, songs } from ".prisma/client";
import { EmbedBuilder } from "discord.js";

const songLink = (song: songs) => {
  if (song.link !== null) {
    return `[${song.title}](${song.link})`;
  }
  
  return song.title!;
};


export const createEmbed = (album: albums & { songs: songs[] }): EmbedBuilder => {
  // NB: field values have a max length of 1024.
  const tracklist = album.songs.map(song =>  songLink(song)).join('\n');

  const embed = new EmbedBuilder()
  .setColor(0xEEAAEE)
  .setTitle(`${album.title} [${album.type}]`)
  .addFields([
    { name: 'track list', value: tracklist }
  ])

  if (album.link) {
    embed.setDescription(`[${album.link}](${album.link})`);
  }

  if (album.image) {
    embed.setThumbnail(album.image);
  }

  return embed;
};