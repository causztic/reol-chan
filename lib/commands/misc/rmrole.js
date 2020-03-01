const { Command } = require('discord.js-commando');
const { GENERAL_ID } = require('../../constants.js');
const { getChannel, inCommandChannel } = require('./../../util.js');

module.exports = class RemoveRoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rmrole',
			group: 'misc',
			memberName: 'rmrole',
			description: 'Remove a self-assigned role from yourself.',
			details: '',
			args: [
				{
					key: 'role',
					prompt: 'Remove a role!',
					type: 'string',
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
		const channel = this.client.channels.get(getChannel(BOT_STUFF_ID));

		if (!inCommandChannel(msg)) {
			return;
		}

		if (roleArg.length < 1) {
			return msg.reply("Make sure to enter a role to remove! Ex: r!rmrole Red");
		}

    const role = msg.guild.roles.find(r => r.name == roleArg);

    // Prevent removal of required roles (Can be updated in the future if more required roles are ever added).
    if (roleArg.toLowerCase() === "member") {
      return msg.reply("You can't remove that role from yourself!");
    }

    // Checks that the role provided by the user exists.
		const roleExists = msg.guild.roles.has(role.id);
		if (!roleExists) {
			return msg.reply("That role doesn't exist! Remember that role names are case-sensitive. Check which roles you have by clicking/long-pressing on your profile picture by a message or in the member list.");
		}

    if (memberRoles.has(role.id)) {
      msg.member.removeRole(role);
      channel.send(`${msg.author} no longer has the ${role.name} role!`);
    } else {
      msg.reply("You don't have that role! Check which roles you have by clicking/long-pressing on your profile picture by a message or in the member list.")
    }
  }
}
