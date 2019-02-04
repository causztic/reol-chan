exports.up = pgm => {
  pgm.createTable("albums", {
    id: "id",
    year: { type: "smallint", notNull: true },
    title:{ type: "varchar(200)" },
    type: { type: "varchar(10)" },
    link: { type: "text" },
    image: { type: "text" }
  })
  pgm.createTable("songs", {
    id: "id",
    year: { type: "smallint" },
    title:{ type: "varchar(200)" },
    description: { type: "text" },
    link: { type: "text" },
    albumId: {
      type: "integer",
      references: '"albums"',
      onDelete: "cascade"
    },
  });
}

exports.down = pgm => {
  pgm.dropTable("songs");
  pgm.dropTable("albums");
}