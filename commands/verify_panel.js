const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weryfikacja')
		.setDescription('Wysyła Embed na kanał z panelem do weryfikacji.')
    .addChannelOption(channel => 
      channel
        .setName("kanal")
        .setDescription("Kanał na który zostanie wysłany panel do weryfikacji.")
        .setRequired(true)
      )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
};