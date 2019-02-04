exports.up = pgm => {
  pgm.createTable("instagram", {
    id: "id",
    url: { type: "text" },
    text: { type: "text" },
    post_id: { type: "text", unique: true }
  }, { ifNotExists: true });
  pgm.createTable("tweets", {
    id: "id",
    tweet: { type: "text" },
    image: { type: "text" },
    url: { type: "text" },
    timestamp: { type: "text" },
  }, { ifNotExists: true });
}

exports.down = pgm => {
  pgm.dropTable("instagram");
  pgm.dropTable("tweets");
}