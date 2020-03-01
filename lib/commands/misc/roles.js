const { Command } = require('discord.js-commando');
const { GENERAL_ID } = require('../../constants.js');
const { getChannel, inCommandChannel } = require('./../../util.js');
const { Client, RichEmbed } = require('discord.js');

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
      const channel = this.client.channels.get(getChannel(BOT_STUFF_ID));
			const embed = new RichEmbed()
			.setTitle("List of all roles")
			.setColor(0x42cef5)
			.setDescription("■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n"
										+ "**General Roles** \n"
                 		+ "Admin - For Dad himself \n"
                 		+ "Moderator - For trusted friends of Dad \n"
                 		+ "Member - Default role showing that you joined the server and verified yourself \n"
										+ "■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n"
                 		+ "**Woooooo Colors!** \n"
                 		+ "Options are currently Red, Blue, and Green \n"
										+ "■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n"
                 		+ "**Regional Roles** \n"
                 		+ "**NA:** US East, US Central, US West \n"
                 		+ "**Europe:** UK, Germany, Scandinavian \n"
                 		+ "**Asia:** Southeast Asia, Japan \n"
                 		+ "**Other:** Australia, South America \n"
                 		+ "■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n"
                 		+ "All role names are **case sensitive!** Ex: Use \'r!giverole **Green**\' rather than \'r!giverole **green**\'");

			if (!inCommandChannel(msg)) {
				return;
			}

			channel.send(embed);
  }
}
