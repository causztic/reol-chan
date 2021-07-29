# REOL-CHAN

Bot for r/reol's discord channel.
She does multiple things:
- Random actions
- Ranking based on number of messages each user sent
- Specialized User Access Control for specific channels
- Replies with some emojis when specific messages are read (owo)
- Provides self-assignable color and region-based roles (Roles must be premade)

## Requirements
- Postgres
- S3
- Redis (for r!ranking)
- NodeJS > 7.0

## Setup
```
cp .env.sample .env
npm install
createdb reol-chan
npm run migrate up
npm start
```

## TO-DOs
- [ ] add tests
- [ ] region based roles
- [ ] more admin commands
- [ ] more fluff commands
- [ ] more robust stat tracking
- [ ] Typescript migration?
