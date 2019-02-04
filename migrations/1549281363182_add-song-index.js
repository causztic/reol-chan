exports.up = pgm => {
  pgm.addColumns("songs", {
    index: "smallint",
  })
}

exports.down = pgm => {
  pgm.dropColumns("songs", ["index"])
}