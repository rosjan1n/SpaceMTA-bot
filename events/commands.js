const { EmbedBuilder } = require("@discordjs/builders");
const { Events, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { verifyRoleId } = require("../config/config.json")

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if(interaction.commandName === "weryfikacja") {
      const { options } = interaction;

      const selectedChannel = options.getChannel('kanal');

      const res = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Weryfikacja")
        .setDescription("Zweryfikuj się, wciskając przycisk poniżej.")
        .setFooter({
          text: "SpaceMTA - weryfikacja",
          iconURL: 
            "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&"
        })
        
      const verify_button = new ButtonBuilder()
        .setCustomId("verify_button")
        .setLabel("Zweryfikuj się")
        .setStyle(ButtonStyle.Success)

      const row = new ActionRowBuilder()
        .addComponents(verify_button)

        try {
          await selectedChannel.send({ embeds: [res], components: [row] });
          res
            .setTitle("Powodzenie!")
            .setColor(5763719)
            .setDescription("Pomyślnie wysłano panel do weryfikacji.")
            .setTimestamp()
          await interaction.reply({ embeds: [res], ephemeral: true })
        } catch (error) {
          if(error) {
            res
              .setColor(15548997)
              .setTitle("Wystąpił błąd!")
              .setDescription("Nie wysłano panelu na kanał.")
              .setTimestamp()
            await interaction.reply({ embeds: [res], ephemeral: true })
          }
        }
    }
    if(interaction.isButton()) {
      if(interaction.customId === "verify_button") {
        const { member } = interaction;

        const res = new EmbedBuilder()
          .setColor(15548997)
          .setTitle("Wystapił błąd!")
          .setDescription("Wystapił błąd podczas nadawania roli. Spróbuj ponownie później.")
          .setFooter({
            text: "SpaceMTA - weryfikacja",
            iconURL: 
              "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&"
          })

        if (!member.roles.cache.some((role) => role.id == verifyRoleId)) {
          try {
            await member.roles.add(verifyRoleId, "Weryfikacja")
            res.setColor(5763719)
            res.setTitle("Pomyślnie nadano role.")
            res.setDescription("Nadano role możesz teraz korzystać z reszty kanałów.")
            await interaction.reply({ embeds: [res], ephemeral: true })
          } catch (error) {
            if (error) {
              await interaction.reply({ embeds: [res], ephemeral: true })
              console.log(error);
            }
          }
        } else {
          res.setDescription("Zostałeś już zweryfikowany.")
          await interaction.reply({ embeds: [res], ephemeral: true })
        }
      }
    }
  },
};
