const { Command } = require('discord.js-commando');
const { BOT_STUFF_ID } = require('../../constants.js');
const { getChannel, inCommandChannel } = require('./../../util.js');
const { Client, RichEmbed } = require('discord.js');

module.exports = class RoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'role',
            group: 'misc',
            memberName: 'role',
            description: 'View a list of users who have claimed a certain role',
            details: '',
            args: [
                {
                    key: 'role',
                    prompt: 'Enter the name of the role you want to view info on (case sensitive)',
                    type: 'string',
                    infinite: false,
                    wait: 1
                }
            ]
        });
    };

    getRoleMembers(msg, roleName) {
        // Gets the role being checked
        let role = msg.guild.roles.find(r => r.name === roleName);

        // Prevents the user from checking a role that doesn't exist
        var roleMembers = [];
        if (!role) {
            /* Have to use this to tell the async run function to send the invalid role message 
             without also sending an error message (Unless I'm blind and missed an easier solution) */
            return roleMembers = null; 
		}

        // Creates an array of all members in the given role
        roleMembers = role.members.map(m => "- <@" + m.user.id + ">");

        return roleMembers;
    }

    async run(msg, {role}) {
        const channel = this.client.channels.get(getChannel(BOT_STUFF_ID));

        if (!inCommandChannel(msg)) {
            return;
        }

        // This would obviously be an extremely long list, so checking the member role is not allowed.
        if (role.toLowerCase() === "member" || role === "@everyone") {
            return msg.reply("Cannot list all users with the member or @everyone role");
        }

        const members = this.getRoleMembers(msg, role);

        if (!members) {
            return msg.reply("Invalid role! Available options can be found with r!roles");
        } else if (members.length == 0) {
            return msg.reply("Nobody currently has that role!");
        }

        const embed = new RichEmbed()
        .setTitle(`${members.length} users found with the ${role} role`)
        .setColor(0x42cef5)
        .setDescription(members.join('\n'));

        channel.send(embed);
    }
}