const { Command } = require('discord.js-commando');
const { GENERAL_ID } = require('../../constants.js');
const { getChannel, inCommandChannel, claimRole } = require('./../../util.js');

module.exports = class GiveRoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'giverole',
			group: 'misc',
			memberName: 'giverole',
			description: 'Give yourself the role to join the server or a custom color role.',
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
		const roleArg = args.role;
		const memberRoles = msg.member.roles;

    if (roleArg.toLowerCase() === "member") {
      const role = msg.guild.roles.find(r => r.name === 'Member');

      if (!memberRoles.has(role.id)) {		// Only allows this to run if the user is not already a Member
        msg.member.addRole(role);
        const channel = this.client.channels.get(getChannel(GENERAL_ID));
        channel.send(`Welcome to the server, ${msg.author}! <:wutGiga:297897855727697921>`);
      }
    }

		// Prevents this generalized code from allowing random people to self-assign the admin, moderator, designer, or bae roles.
		if (COLOR_ROLES.includes(roleArg) || REGION_ROLES.includes(roleArg)) {

				const channel = this.client.channels.get(getChannel(BOT_STUFF_ID));
				const role = msg.guild.roles.find(r => r.name === roleArg);
				const memberRole = msg.guild.roles.find(r => r.name === 'Member');

				// Confirms that the user is in the #bot-stuff channel when using the command
				if (!inCommandChannel(msg)) {
					return;
				}

				claimRole(msg, role, channel);
		}
	};
}
