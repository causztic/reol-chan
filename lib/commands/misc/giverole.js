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

	grantRole(msg, role, channel) {
		msg.member.addRole(role);
		channel.send(`${msg.author} now has the ${role.name} role!`);
	}

	giveMemberRole(msg, role, channel, userRoles) {
		// Only allows this to run if the user is not already a Member
		if (!userRoles.has(role.id)) {
			msg.member.addRole(role);

			channel.send(`Welcome to the server, ${msg.author}! <:wutGiga:297897855727697921>`);
		}
	}

	giveColorRole(msg, role, channel, userRoles) {
		// Confirms that the user doesn't already have the color role
		if (!userRoles.has(role.id)) {

			// Prevents the user from claiming more than one color role
			if (!userRoles.some(r => COLOR_ROLES.includes(r.name))) {
				this.grantRole(msg, role, channel);
			} else {
				msg.reply("You have already claimed another color role! Use r!rmrole [role name] and try again.");
			}

		} else {
		  msg.reply("You have already claimed that role! Use r!rmrole [role name] and try again.");
		}
	}

	giveRegionRole(msg, role, channel, userRoles) {
		// Confirms that the user doesn't already have the region role
		if (!userRoles.has(role.id)) {

			// Prevents the user from claiming more than one region role
			if (!userRoles.some(r => REGION_ROLES.includes(r.name))) {
				this.grantRole(msg, role, channel);
			} else {
				msg.reply("You have already claimed another regional role! Use r!rmrole [role name] and try again.");
			}

		} else {
		  msg.reply("You have already claimed that role! Use r!rmrole [role name] and try again.");
		}
	}

	async run(msg, args) {
		const roleArg = args.role;
		const userRoles = msg.member.roles;
		const memberRole = msg.guild.roles.find(r => r.name === 'Member');
		const generalChannel = this.client.channels.get(getChannel(GENERAL_ID));
		const botChannel = this.client.channels.get(getChannel(BOT_STUFF_ID));

    if (roleArg.toLowerCase() === "member") {
      const role = msg.guild.roles.find(r => r.name === 'Member');
			this.giveMemberRole(msg, role, generalChannel, userRoles);
			return;

    }

		// Confirms that the user is in the #bot-stuff channel when claiming a color or regional role
		if (!inCommandChannel(msg)) {
			return;
		}

		// Confirms that the user is a Member before allowing them to claim color/regional roles
		if (!userRoles.has(memberRole.id)) {
			return msg.reply("You are not yet a Member! Use r!giverole member to join the server and claim more roles.");
		}

		const role = msg.guild.roles.find(r => r.name === roleArg);

		if (COLOR_ROLES.includes(roleArg)) {
			this.giveColorRole(msg, role, botChannel, userRoles);
		} else if (REGION_ROLES.includes(roleArg)) {
			this.giveRegionRole(msg, role, botChannel, userRoles);
		} else {
			msg.reply("Invalid role! Available options can be found with r!roles");
		}
	};
}
