const { Command } = require('discord.js-commando');
const redisClient = require('../../redis-client.js');

module.exports = class PurgeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'points',
			group: 'misc',
			memberName: 'points',
			description: 'Gets your points!',
			details: 'action can be [ranking] to get the top 10 leaderboards.',
			args: [
				{
				key: 'action',
				prompt: '',
				type: 'string',
				default: '',
				infinite: false,
				wait: 1
			}]
		});
	};

	async run(msg, args) {
    if (args.action === "ranking") {
      let response = "Top 10 Leaderboards for Arbitrary Points!\n"
      redisClient.hgetall('points', function(err, obj) {
        let keysSorted = Object.keys(obj).sort(
          function(a,b){
            return obj[b]-obj[a];
          }
        );
        keysSorted = keysSorted.filter((key) => key !== 'count_294349205391147009');
        keysSorted.slice(0, 10).reduce((promise, key) =>
          promise.then(() => msg.guild.fetchMember(key.split("_")[1]).then((result) => {
            response += ((`${result.user.username} - ${obj[key]}\n`));
          }
          )), Promise.resolve()).then(() => {
            msg.reply(response);
          });
      })
    } else {
      redisClient.hget('points', `count_${msg.author.id}`, function(_, reply) {
        msg.reply(`You have ${reply} arbitrary points right now!`);
      });
    }
	};
}
