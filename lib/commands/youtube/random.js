const { youtube_id, youtube, getVideoPromise } = require('../../youtube_info.js');
const Commando = require('discord.js-commando');

module.exports = class RandomYoutubeCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'random',
			aliases: ['r'],
			group: 'youtube',
			memberName: 'random',
			description: 'Gets a random youtube video from REOL\'s youtube channel.',
			details: '',
			args: []
		});
	}

	async run(msg, args) {
		return msg.reply(getVideoPromise("random"));
	}
};