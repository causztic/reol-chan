const { getTwitterList } = require('../modules/twitter.js');
const commando = require('discord.js-commando');
const constants = require('../constants.js');
const util = require("../util.js");

const MAX_QUEUE_SIZE = 20
const streamOptions = { seek: 0, volume: 1 };

module.exports = class TwitterListCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'twitter',
			aliases: ['tt'],
			group: 'social-media',
			memberName: 'twitter',
			description: 'Get tweets by reol.',
			details: '',
			args: [
				{
					key: 'action',
					prompt: 'Get the latest tweet list!',
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
			getTwitterList().then((result) => {
        console.log(result[0]);
				return msg.reply(`${result[0].text} \n ${result[0].image !== undefined ? result[0].image : ""}`);
			}, (err) => {
				return msg.reply(constants.ERROR_MESSAGE)
			})
		}
	};
}
