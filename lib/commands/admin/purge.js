const { getTwitterList } = require('../../modules/twitter.js');
const { Command } = require('discord.js-commando');
const constants = require('../../constants.js');
const util = require("../../util.js");

const MAX_QUEUE_SIZE = 20
const streamOptions = { seek: 0, volume: 1 };

module.exports = class PurgeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'purge',
			group: 'admin',
			memberName: 'purge',
			description: 'Purges the testbed channel.',
			details: '',
			args: [
				{
				key: '',
				prompt: '',
				type: 'string',
				default: '',
				infinite: false,
				wait: 1
			}]
		});
	};

  hasPermission(msg) {
    return this.client.isOwner(msg.author);
  }

	async run(msg, args) {
		msg.reply("Purging testbed..");
		this.client.channels.get(constants.TEST_ID).bulkDelete(100, true)
		.then(messages => {
			let m = `Bulk deleted ${messages.size} messages.`;
			msg.reply(m);
			console.log(m);
		})
		.catch(console.error);
	};
}