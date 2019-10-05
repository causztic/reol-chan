const { Command } = require('discord.js-commando');
const Diene = require('diene').default;
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
			const diene = new Diene('rrreol999', true);
			const post = await diene.getPosts(1);
      return msg.reply(`${post[0].media}`);
		}
	};
}
