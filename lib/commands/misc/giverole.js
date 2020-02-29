const { Command } = require('discord.js-commando');
const { GENERAL_ID } = require('../../constants.js');
const { getChannel, inCommandChannel } = require('./../../util.js');

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

      if (!memberRoles.has(role.id)) {		// Needs to use role.id to properly check if the user has that role -Syn
        msg.member.addRole(role);
        const channel = this.client.channels.get(getChannel(GENERAL_ID));
        channel.send(`Welcome to the server, ${msg.author}! <:wutGiga:297897855727697921>`);
      }

			// Prevents this generalized code from allowing random people to self-assign the admin, moderator, designer, or bae roles.
    } else if (COLORS.includes(roleArg)) {

				const channel = this.client.channels.get(getChannel(BOT_STUFF_ID));
				const role = msg.guild.roles.find(r => r.name === roleArg);
				const memberRole = msg.guild.roles.find(r => r.name === 'Member');

				// Confirms that the user is in the #bot-stuff channel when using the command
				if (!inCommandChannel(msg)) {
					return msg.reply("Please use this command in the designated bot commands channel!");
				}

				// Checks that the role provided by the user exists.
				const roleExists = msg.guild.roles.has(role.id);
				if (!roleExists) {
					return msg.reply("Invalid role! Available options can be found with r!roles");
				}

				// Confirms that the user doesn't already have the color/region role and is a Member
				if (!memberRoles.has(role.id) && memberRoles.has(memberRole.id) && !memberRoles.some(r => COLORS.includes(r.name))) {
					msg.member.addRole(role);
					channel.send(`${msg.author} now has the ${role.name} role!`);
				} else {
					msg.reply("Either you already have a color/region role or you have not joined the server with \'r!giverole member\'! Use r!rmrole [color or region] and try again if you already have one.");
				}
		} else {
      msg.reply("Invalid role! Available options can be found with r!roles");
    }
	};
}
