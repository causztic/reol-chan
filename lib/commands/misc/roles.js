const { Command } = require('discord.js-commando');
const { getChannel, inCommandChannel } = require('./../../util.js');
const { MessageEmbed } = require('discord.js');

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

  async run(msg, _args) {

			if (!inCommandChannel(msg)) {
				return;
			}

			const channel = this.client.channels.cache.get(getChannel(BOT_STUFF_ID));

			const embed = new MessageEmbed()
			.setTitle("List of all roles")
			.setColor(0x42cef5)
			.setDescription("■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n"
										+ "**General Roles** \n"
                 		+ "Admin - For Dad himself \n"
                 		+ "Moderator - For trusted friends of Dad \n"
                 		+ "Member - Default role showing that you joined the server and verified yourself \n"
										+ "■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n"
                 		+ "**Woooooo Colors!** \n"
                 		+ "Options are currently Red, Blue, Green, and Purple \n"
										+ "■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n"
                 		+ "**Regional Roles** \n"
                 		+ "**NA:** US East, US Central, US West \n"
                 		+ "**Europe:** Europe, UK, Germany, Scandinavia \n"
                 		+ "**Asia:** SEA, Japan \n"
                 		+ "**Other:** Australia, South America \n"
                 		+ "■▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬■ \n"
                 		+ "All role names are **case sensitive!** Ex: Use \'r!giverole **Green**\' rather than \'r!giverole **green**\'");

			channel.send(embed);
  }
}
