const { Command } = require('discord.js-commando');

module.exports = class TwitterListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'instagram',
			aliases: ['insta'],
			group: 'social-media',
			memberName: 'instagram',
			description: 'Get instagrams by Reol.',
			details: '',
			args: [
				{
					key: 'action',
					prompt: 'Get the latest post!',
					type: 'string',
					default: 'latest',
					infinite: false,
					wait: 1
				}
			]
		});
		this.queues = {};
	};

	async run(msg, args) {
		if (args.action === "latest" || args.action === "") {
			const post = await this.client.ns.getPosts(1);
      return msg.reply(`${post[0].media}`);
		}
	};
}
