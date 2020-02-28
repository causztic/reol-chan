const { Command } = require('discord.js-commando');
const { GENERAL_ID } = require('../../constants.js');
const { REOL_CHAN_ID } = require('../../constants.js');
const { getChannel } = require('./../../util.js');

module.exports = class RolesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roles',
			group: 'misc',
			memberName: 'roles',
			description: 'Check the list of available roles',
			details: '',
			args: [
				{
					key: '',
					prompt: 'Check out all the roles!',
					type: 'string',
					default: 'member',
					infinite: false,
					wait: 1
				}
			]
		});
	};

  async run(msg, args) {
      const channel = this.client.channels.get(getChannel(REOL_CHAN_ID));
      channel.send("-------------General Roles------------- \nAdmin - For Dad himself \nMod - For trusted friends of Dad \nMember - Default role showing that you joined the server and verified yourself");
      channel.send("-------------Woooooo Colors!------------- \nOptions are Red, Blue, Green, Purple, Yellow, Orange, and Pink");
			channel.send("All color role names are case sensitive! (Use \'r!giverole Green\' rather than \'r!giverole green\')");
  }
}
