const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.setPresence({ activities: [{ name: 'spaceMTA', type: ActivityType.Watching }] });
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};