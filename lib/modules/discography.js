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
  pgc.query('INSERT INTO songs(year, title, link, "albumId") VALUES ($1, $2, $3, $4)',
    [song.year, song.title, song.link, song.albumId], (err, result) => {
    if (err) { console.error(err); }
    console.log(result);
  })
}

let populate = (pgc, client) => {
  pgc.query('SELECT * FROM albums ORDER BY year', [], (err, data) => {
    if (err) { console.error(err); }

    // group the data by year
    const albums = data.rows.reduce((row, item) => {
      (row[item.year] = row[item.year] || []).push(item);
      return row;
    }, {});

    Object.entries(albums).forEach(([year, albums]) => {
      albums.forEach((album) => {
        let embedData = `${album.title} (${album.type}) \n <${album.link}>`;
        pgc.query('SELECT * FROM songs WHERE "albumId" = $1', [album.id], (err, data) => {
          if (err) {
            console.error(err);
          } else {
            data.rows.forEach(song => embedData += `\n\n ${song.title} \n <${song.link}>`);
            client.channels.get(getChannel(DISCOGRAPHY_ID)).send(
              '',
              {
                embed: {
                  title: year,
                  color: 0xEEAAEE,
                  description: embedData,
                  thumbnail: {
                    url: album.image
                  }
                },
              }
            )
          }
        });
      });
    });
  });
}


module.exports = { addAlbum, addSong, populate }