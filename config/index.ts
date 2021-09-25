export default process.env.NODE_ENV === "production" ? {
  token: process.env.TOKEN ?? '',
  clientId: process.env.CLIENT_ID ?? '',
  guildId: process.env.GUILID_ID ?? '',
  generalChannelId: process.env.GENERAL_CHANNEL_ID ?? '',
  roles: {
    member: process.env.ROLES_MEMBER_ID ?? '',
  }
} : require("./config.json");