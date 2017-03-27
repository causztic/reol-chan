const commando = require('discord.js-commando');
const instagram = require('instagram-posts')

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
		instagram('rrreol999', { count: 1 }).then(post => {
			console.log(post)
			return msg.reply(post[0].text + "\n" + post[0].media)
		})
  }
}