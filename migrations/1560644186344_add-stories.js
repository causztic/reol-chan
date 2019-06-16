exports.up = pgm => {
  pgm.createTable("stories", {
    id: "id",
    url: { type: "text" },
    code: { type: "text", unique: true }
  })
}

exports.down = pgm => {
  pgm.dropTable("stories");
}