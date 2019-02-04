'use strict';

const { getChannel } = require('./../util.js');

let addAlbum = (pgc, album) => {
  console.log(album);
  pgc.query('INSERT INTO albums(year, title, type, link, image) VALUES ($1, $2, $3, $4, $5)',
    [album.year, album.title, album.type, album.link, album.image], (err, result) => {
    if (err) { console.error(err); }
    console.log(result);
  });
}

let addSong = (pgc, song) => {
  pgc.query('INSERT INTO songs(year, title, index, link, "albumId") VALUES ($1, $2, $3, $4, $5)',
    [song.year, song.title, song.index, song.link, song.albumId], (err, result) => {
    if (err) { console.error(err); }
    console.log(result);
  })
}

let populate = async (pgc, client) => {
  const data = await pgc.query('SELECT * FROM albums ORDER BY year', []);
  // group the data by year
  const albums = data.rows.reduce((row, item) => {
    (row[item.year] = row[item.year] || []).push(item);
    return row;
  }, {});

  const years = [];
  for (let year = 2012; year <= (1900 + new Date().getYear()); year++) {
    years.push(year);
  }

  // sort the data based on singles first then albums
  const sortedData = await Promise.all(years.map(async(year) => {
    try {
      const result = await pgc.query('SELECT * FROM songs WHERE "albumId" IS NULL AND year = $1', [year]);
      let singleData = '';
      result.rows.forEach((song) => {
        if (song.link) {
          singleData += `\n[${song.title}](<${song.link}>)`
        } else {
          singleData += `\n${song.title}`
        }
      });

      // get albums from the year
      const albumData = await Promise.all((albums[year.toString()] || []).map(async(album) => {
        let embedData = album.link ? `<${album.link}>\n` : '\n';
        const albumSongs = await pgc.query('SELECT * FROM songs WHERE "albumId" = $1 ORDER BY index', [album.id]);
        albumSongs.rows.forEach((song) => {
          if (song.link) {
            embedData += `\n[${song.title}](<${song.link}>)`
          } else {
            embedData += `\n${song.title}`
          }
        });
        return { title: album.title, type: album.type, description: embedData, image: album.image };
      }));

      return { singleData, albumData };
    } catch (error) {
      console.error(error);
      return { singleData: [], albumData: [] };
    }
  }));

  // print out the tables
  for (let i = 0; i < years.length; i++) {
    client.channels.get(getChannel(DISCOGRAPHY_ID)).send(`**${years[i]}**`);
    const { singleData, albumData } = sortedData[i];

    if (singleData.length > 0) {
      client.channels.get(getChannel(DISCOGRAPHY_ID)).send(
        '',
        {
          embed: {
            title: `Singles / Covers`,
            color: 0xAAEEAA,
            description: singleData,
          },
        }
      )
    }

    albumData.forEach((album) => {
      client.channels.get(getChannel(DISCOGRAPHY_ID)).send(
        '',
        {
          embed: {
            title: `${album.title} [${album.type}]`,
            color: 0xEEAAEE,
            description: album.description,
            thumbnail: {
              url: album.image,
            }
          },
        }
      )
    });
  }
}


module.exports = { addAlbum, addSong, populate }