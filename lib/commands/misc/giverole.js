const { Command } = require('discord.js-commando');
const { GENERAL_ID } = require('../../constants.js');
const { getChannel } = require('./../../util.js');

module.exports = class GiveRoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'giverole',
			group: 'misc',
			memberName: 'giverole',
			description: 'Give yourself the role to join the server.',
			details: '',
			args: [
				{
					key: 'role',
					prompt: 'Give yourself a role!',
					type: 'string',
					default: 'member',
					infinite: false,
					wait: 1
				}
			]
		});
		this.queues = {};
	};

	async run(msg, args) {
    if (args.role === "member") {
      const role = msg.guild.roles.find(r => r.name == 'Member')
      if (!msg.member.roles.has(role)) {
        msg.member.addRole(role);
        const channel = this.client.channels.get(getChannel(GENERAL_ID));
        channel.send(`Welcome to the server, ${msg.author}! <:wutGiga:297897855727697921>`);
      }
    } else {
      msg.reply(`Invalid role! Available options are: member`)
    }
	};
}
