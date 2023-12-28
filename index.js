const fs = require('node:fs');
const { Client, REST, Routes, IntentsBitField } = require('discord.js');
const { token, clientId, guildId } = require('./config/config.json');

const myIntents = new IntentsBitField();
myIntents.add(
		IntentsBitField.Flags.GuildPresences, 
		IntentsBitField.Flags.GuildMembers, 
		IntentsBitField.Flags.Guilds, 
		IntentsBitField.Flags.GuildInvites, 
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	);
const client = new Client({ intents: myIntents });

const commands = [];

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if ('data' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${file} is missing a required "data" property.`);
  }
}

const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

client.login(token);