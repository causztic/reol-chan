const { Command } = require('discord.js-commando');
const { GENERAL_ID } = require('../../constants.js');
const { getChannel } = require('./../../util.js');

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
    if (args.role === "member") {
      const role = msg.guild.roles.find(r => r.name == 'Member');

      if (!msg.member.roles.has(role.id)) {		// Needs to use role.id to properly check if the user has that role -Syn
        msg.member.addRole(role);
        const channel = this.client.channels.get(getChannel(GENERAL_ID));
        channel.send(`Welcome to the server, ${msg.author}! <:wutGiga:297897855727697921>`);
      }

			// Prevents this generalized code from allowing random people to self-assign the admin, moderator, or bae roles.
    } else if (COLORS.includes(args.role)) {

				const channel = this.client.channels.get(getChannel(REOL_CHAN_ID));
				const role = msg.guild.roles.find(r => r.name == args.role);
				const memberRole = msg.guild.roles.find(r => r.name == 'Member');

				// Confirms that the role provided by the user exists. If it doesn't, the method returns after informing the user.
				try {
					let roleExists = msg.guild.roles.has(role.id);
				} catch (err) {
					msg.reply(`Invalid role! Available options can be found with r!roles`);
					return;
				}

				// Confirms that the user doesn't already have the color role (or another color role) and is a Member
				if (!msg.member.roles.has(role.id) && msg.member.roles.has(memberRole.id) && !msg.member.roles.some(r => COLORS.includes(r.name))) {
					msg.member.addRole(role);
					channel.send(`${msg.author} now has the ${role.name} role!`);
				} else {
					msg.reply("Either you already have a color role or you have not joined the server with \'r!giverole member\'! Use r!rmrole [color] and try again if you already have a color role.");
				}
		} else {
      msg.reply(`Invalid role! Available options can be found with r!roles`);
    }
	};
}
