const { youtube_id, youtube, getVideoPromise } = require('../../youtube_info.js');
const commando = require('discord.js-commando');
const constants = require('../../constants.js');

module.exports = class RandomYoutubeCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'youtube',
			aliases: ['yt'],
			group: 'youtube',
			memberName: 'youtube',
			description: 'Get videos from REOL\'s youtube channel.',
			details: 'action can be [latest] or [random]. Defaults to latest video.',
			args: [
				{
					key: 'action',
          prompt: 'Get a video!',
          type: 'string',
          default: 'latest',
					infinite: false,
          wait: 1
				}
			]
		});
	}

	async run(msg, args) {
    if (args.action === "random"){
      console.log("Getting random video..");
      getVideoPromise("random").then((result) => {
        return msg.reply(result)
      }, (err) => {
        return msg.reply(constants.ERROR_MESSAGE)
      })
    } else {
			getVideoPromise().then((result) => {
        return msg.reply(result)
      }, (err) => {
        return msg.reply(constants.ERROR_MESSAGE)
      })
		}
	}
};