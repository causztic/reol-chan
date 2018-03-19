const { Command } = require('discord.js-commando');
const constants = require('../../constants.js');
const util = require("../../util.js");
const NightStalker = require('night-stalker').default;

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
    const ns = new NightStalker('rrreol999');
		if (args.action === "latest" || args.action === "") {
      await ns.getPosts(1).then(post => {
        return msg.reply(`${post[0].media}`);
      });
		}
	};
}
