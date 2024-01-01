const { EmbedBuilder } = require("@discordjs/builders");
const {
  Events,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { verifyRoleId } = require("../config/config.json");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (interaction.isCommand()) {
      if (interaction.commandName === "weryfikacja") {
        const { options } = interaction;

        const selectedChannel = options.getChannel("kanal");

        const res = new EmbedBuilder()
          .setColor([74, 148, 215])
          .setTitle("Weryfikacja")
          .setDescription("Zweryfikuj się, wciskając przycisk poniżej.")
          .setFooter({
            text: "SpaceMTA - Weryfikacja",
            iconURL:
              "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
          });

        const verifyButton = new ButtonBuilder()
          .setCustomId("verifyButton")
          .setLabel("Zweryfikuj się")
          .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(verifyButton);

        try {
          await selectedChannel.send({ embeds: [res], components: [row] });
          res
            .setTitle("Powodzenie!")
            .setColor([0, 255, 0])
            .setDescription("Pomyślnie wysłano panel do weryfikacji.")
            .setTimestamp()
            .setFooter({
              text: "SpaceMTA - Weryfikacja",
              iconURL:
                "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
            });

          await interaction.reply({ embeds: [res], ephemeral: true });
        } catch (error) {
          if (error) {
            res
              .setColor([255, 0, 0])
              .setTitle("Wystąpił błąd!")
              .setDescription("Nie wysłano panelu na kanał.")
              .setTimestamp()
              .setFooter({
                text: "SpaceMTA - Weryfikacja",
                iconURL:
                  "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
              });

            await interaction.reply({ embeds: [res], ephemeral: true });
          }
        }
      }
    } else if (interaction.isButton()) {
      if (interaction.customId === "verifyButton") {
        const { member } = interaction;

        const res = new EmbedBuilder()
          .setColor(15548997)
          .setTitle("Wystapił błąd!")
          .setDescription(
            "Wystapił błąd podczas nadawania roli. Spróbuj ponownie później."
          )
          .setFooter({
            text: "SpaceMTA - Weryfikacja",
            iconURL:
              "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
          });

        if (!member.roles.cache.some((role) => role.id == verifyRoleId)) {
          try {
            await member.roles.add(verifyRoleId, "Weryfikacja");
            res.setColor(5763719);
            res.setTitle("Pomyślnie nadano role.");
            res.setDescription(
              "Nadano role możesz teraz korzystać z reszty kanałów."
            );
            await interaction.reply({ embeds: [res], ephemeral: true });
          } catch (error) {
            if (error) {
              await interaction.reply({ embeds: [res], ephemeral: true });
            }
          }
        } else {
          res.setDescription("Zostałeś już zweryfikowany.");
          await interaction.reply({ embeds: [res], ephemeral: true });
        }
      }
    }
  },
};
