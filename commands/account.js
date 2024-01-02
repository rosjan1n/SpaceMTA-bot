const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("konto")
    .setDescription("Wyświetla informacje o danym koncie.")
    .addIntegerOption((option) =>
      option
        .setName("SID")
        .setDescription("SID szukanego konta.")
        .setRequired(true)
    ),
};
