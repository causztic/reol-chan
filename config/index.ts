export default process.env.NODE_ENV === "production" ? {
  token: process.env.TOKEN ?? '',
  clientId: process.env.CLIENT_ID ?? '',
  guildId: process.env.GUILD_ID ?? '',
  generalChannelId: process.env.GENERAL_CHANNEL_ID ?? '',
  socialMediaChannel: process.env.SOCIAL_MEDIA_ID ?? '',
  roles: {
    member: process.env.ROLES_MEMBER_ID ?? '',
  },
  twitterToken: process.env.TWITTER_TOKEN ?? '',
} : require("./config.json");