const { Command } = require('discord.js-commando');
const { NightStalker } = require('night-stalker');

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
		const ns = await NightStalker.loadBrowser();
		balanar.setUserName('rrreol999');

		if (args.action === "latest" || args.action === "") {
      await ns.getPosts(1).then(post => {
        return msg.reply(`${post[0].media}`);
      });
		}
	};
}
