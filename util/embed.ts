import { albums, songs } from ".prisma/client";
import { MessageEmbed } from "discord.js";

const songLink = (song: songs) => {
  if (song.link !== null) {
    return `[${song.title}](${song.link})`;
  }
  
  return song.title!;
};


export const createEmbed = (album: albums & { songs: songs[] }): MessageEmbed => {
  const embed = new MessageEmbed()
  .setColor(0xEEAAEE)
  .setTitle(`${album.title} [${album.type}]`)
  .addFields(
    album.songs.map((song) => ( 
      { name: '\u200B', value: songLink(song) }
    )
  ));

  if (album.link) {
    embed.setDescription(`[${album.link}](${album.link})`);
  }

  if (album.image) {
    embed.setThumbnail(album.image);
  }

  return embed;
};