const pg = require('pg');
const { Command } = require('discord.js-commando');
const { getSpecificInstagramPost } = require("../../modules/instagram");

module.exports = class InstagramCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'single_instagram',
			group: 'admin',
			memberName: 'instagram',
			description: 'Forces an instagram update for a specific shortcode.',
			details: '',
			args: [
				{
				key: 'shortcode',
				prompt: '',
				type: 'string',
				default: '',
				infinite: false,
				wait: 1
			}]
		});
	};

  hasPermission(msg) {
    return this.client.isOwner(msg.author);
  }

	async run(msg, args) {
    msg.reply("Forcing update of instagram for " + args.shortcode);
    if (process.env.DATABASE_URL) {
      pg.connect(process.env.DATABASE_URL, (err, pg_client) => {
        if (err) catchErrors(this.client, err);
        getSpecificInstagramPost(pg_client, this.client, args.shortcode);
			})
    } else {
      var pg_client = new pg.Client();
      pg_client.connect((err) => {
        if (err) catchErrors(this.client, err);
        getSpecificInstagramPost(pg_client, this.client, args.shortcode);
      })
    }
	};
}
