-- Up
CREATE TABLE Instagram (id BIGSERIAL PRIMARY KEY, url TEXT, text TEXT, post_id TEXT UNIQUE)

-- Down
DROP TABLE Instagram