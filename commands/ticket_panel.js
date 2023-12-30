const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Wysyła panel do tworzenia ticketa na podany kanał.')
    .addChannelOption(channel => 
      channel
        .setName("kanal")
        .setDescription("Kanał na który zostanie wysłany panel.")
        .setRequired(true)
      )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
};