const commando = require('discord.js-commando');
const InstagramPosts = require('instagram-screen-scrape')

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
		streamOfPosts = new InstagramPosts({ username: "rrreol999" })
		streamOfPosts.on('data', (post) => {
			streamOfPosts.destroy()
			return post.media
		})
  }
}