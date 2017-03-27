const commando = require('discord.js-commando');

module.exports = class RandomYoutubeCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'instagram',
			aliases: ['ig'],
			group: 'social-media',
			memberName: 'instagram',
			description: 'Get instagram photos.'
		});
	}

  async run(msg, args) {
  }
}