const { EmbedBuilder } = require("@discordjs/builders");
const { Events } = require("discord.js");
const mysql = require("mysql");

const connection = mysql.createConnection({});

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (interaction.isCommand()) {
      if (interaction.commandName === "konto") {
        const { options } = interaction;

        const sid = options.getInteger("sid");

        try {
          connection.query(
            "SELECT * FROM `pystories_users` WHERE `id` = ?",
            [sid],
            async (err, row) => {
              if (err) throw err;
              const res = new EmbedBuilder()
                .setColor([255, 0, 0])
                .setTitle("Wystąpił błąd")
                .setDescription(
                  "Konto o podanym `SID`, nie istnieje w bazie danych."
                )
                .setTimestamp()
                .setFooter({
                  text: "SpaceMTA - Konto",
                  iconURL:
                    "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
                });

              if (!row.length)
                return await interaction.reply({
                  embeds: [res],
                  ephemeral: true,
                });

              const account = row[0];

              res
                .setTitle("Informacje o koncie")
                .setColor([74, 148, 215])
                .setDescription(null);

              res.addFields(
                { name: "Login", value: `${account.login}` },
                { name: "Gotówka", value: `$${formatComma(account.money)}` },
                {
                  name: "Pieniądze w banku",
                  value: `$${formatComma(account.bank_money)}`,
                },
                { name: "Data rejestracji", value: `${account.registered}` },
                { name: "Przegrany czas", value: `${account.hours} minut` }
              );

              await interaction.reply({ embeds: [res], ephemeral: true });
            }
          );
        } catch (error) {
          await interaction.reply({ content: "błąd", ephemeral: true });
        }
      }
    }
  },
};

function formatComma(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
