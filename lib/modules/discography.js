'use strict';

const { getChannel } = require('./../util.js');

let addAlbum = (pgc, album) => {
  pgc.query('INSERT INTO albums(year, title, type, link, image) VALUES ($1, $2, $3, $4, 45)',
    [album.year, album.title, album.type, album.link, album.image], (err, result) => {
    console.log(result);
    if (err) { catchErrors(err); }
  })
}

let addSong = (pgc, song) => {
  pgc.query('INSERT INTO songs(year, title, link, albumId) VALUES ($1, $2, $3, $4)',
    [song.year, song.title, song.link, song.albumId], (err, result) => {
    console.log(result);
    if (err) { catchErrors(err); }
  })
}


module.exports = { addAlbum, addSong }