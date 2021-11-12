export default process.env.NODE_ENV === "production" ? {
  token: process.env.TOKEN ?? '',
  clientId: process.env.CLIENT_ID ?? '',
  guildId: process.env.GUILD_ID ?? '',
  generalChannelId: process.env.GENERAL_CHANNEL_ID ?? '',
  socialMediaChannelId: process.env.SOCIAL_MEDIA_CHANNEL_ID ?? '',
  roles: {
    member: process.env.ROLES_MEMBER_ID ?? '',
    moderator: process.env.ROLES_MODERATOR_ID ?? '',
    admin: process.env.ROLES_ADMIN_ID ?? '',
  },
  twitterToken: process.env.TWITTER_TOKEN ?? '',
} : require("./config.json");