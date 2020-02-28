const { Command } = require('discord.js-commando');
const { GENERAL_ID } = require('../../constants.js');
const { REOL_CHAN_ID } = require('../../constants.js');
const { getChannel } = require('./../../util.js');

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
    const channel = this.client.channels.get(getChannel(REOL_CHAN_ID));
    const role = msg.guild.roles.find(r => r.name == args.role);
    const memberRole = msg.guild.roles.find(r => r.name == 'Member');

    // Checks that the roles provided by the user exists.
    try {
      let roleExists = msg.guild.roles.has(role.id);
    } catch (err) {
      msg.reply("That role doesn't exist! Check which roles you have by clicking/long-pressing on your profile picture by a message or in the member list.");
      return;
    }

    // Prevent removal of required roles (Can be updated in the future if more required roles are ever added).
    if (args.role === "Member" || args.role === "member") {
      msg.reply("You can't remove that role!");
      return;
    // Remove the role requested if the user is already a Member and has the provided role
    } else if (msg.member.roles.has(memberRole.id) && msg.member.roles.has(role.id)) {
      msg.member.removeRole(role);
      channel.send(`${msg.author} no longer has the ${role.name} role!`);
    } else {
      msg.reply("You don't have that role! Check which roles you have by clicking/long-pressing on your profile picture by a message or in the member list.")
    }
  }
