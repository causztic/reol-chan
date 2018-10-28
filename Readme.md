# REOL-CHAN

Bot for r/reol's discord channel.
She does multiple things:
- Scrapes instagram videos / images with [night-stalker](https://github.com/causztic/night-stalker)
- Scrapes tweets and saves the images to the cloud (video saving coming soon)
- Random actions
- Ranking based on number of messages each user sent
- Specialized User Access Control for specific channels
- Replies with some emojis when specific messages are read (owo)

## Requirements
- Postgres
- S3
- Redis (for r!ranking)
- NodeJS > 7.0

## Setup
```
cp .env.sample .env
npm install
npm start
```
