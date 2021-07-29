const { Command } = require('discord.js-commando');
const constants = require('../../constants.js');

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

	async run(msg, _args) {
		msg.reply("Purging testbed..");
		this.client.channels.cache.get(constants.TEST_ID).bulkDelete(100, true)
		.then(messages => {
			let m = `Bulk deleted ${messages.size} messages.`;
			msg.reply(m);
			console.log(m);
		})
		.catch(console.error);
	};
}
