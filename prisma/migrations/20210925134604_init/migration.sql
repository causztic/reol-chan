-- CreateTable
CREATE TABLE "albums" (
    "id" SERIAL NOT NULL,
    "year" SMALLINT NOT NULL,
    "title" VARCHAR(200),
    "type" VARCHAR(10),
    "link" TEXT,
    "image" TEXT,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instagram" (
    "id" SERIAL NOT NULL,
    "url" TEXT,
    "text" TEXT,
    "post_id" TEXT,

    CONSTRAINT "instagram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pgmigrations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "run_on" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "pgmigrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songs" (
    "id" SERIAL NOT NULL,
    "year" SMALLINT,
    "title" VARCHAR(200),
    "link" TEXT,
    "albumId" INTEGER,
    "index" SMALLINT,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stories" (
    "id" SERIAL NOT NULL,
    "url" TEXT,
    "code" TEXT,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tweets" (
    "id" SERIAL NOT NULL,
    "tweet" TEXT,
    "image" TEXT,
    "url" TEXT,
    "timestamp" TEXT,

    CONSTRAINT "tweets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instagram_post_id_key" ON "instagram"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "stories_code_key" ON "stories"("code");

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
