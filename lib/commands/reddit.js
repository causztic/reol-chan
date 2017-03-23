var Clapp = require('../modules/clapp-discord');

module.exports = new Clapp.Command({
  name: "reddit",
  desc: "gets stuff on the subreddit",
  fn: (argv, context) => {
    if (argv.args.users == "users"){
      return "Coming soon!"
    }
  },
  args: [
    {
      name: 'users',
      desc: 'Gets the number of users in the subreddit.',
      type: 'string',
      required: false,
      default: ''
    }
  ],
  flags: []
});
