# Notice

reol-chan has undergone a rewrite! https://github.com/causztic/reol-chan/releases/tag/1.0.0

Legacy code is in the `senpai` branch.

## Setup

- Install PostgreSQL
- Update `.env` with `DATABASE_URL`

```
nvm use 16
npm ci
npx prisma migrate dev --name init 
```

Run `prisma generate` on schema changes

## Roadmap

- [x] Typescript
- [x] ESLint
- [x] Slash command integration with Discord.js 13
- [x] Role Management port-over
- [x] Now playing port-over
- [ ] Points port-over (Redis)
- [ ] Postgres port-over (migrations not necessary yet)
- [ ] Discography Management port-over

## Non-essential Roadmap

- [ ] S3 library port-over
- [ ] Purge port-over
- [ ] CI/CD
