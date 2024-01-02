const { EmbedBuilder } = require("@discordjs/builders");
const { Events } = require("discord.js");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "sql.23.svpj.link",
  user: "db_99522",
  database: "db_99522",
  password: "yddX6wJMeLjM",
});

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (interaction.isCommand()) {
      if (interaction.commandName === "ticket") {
        const { options } = interaction;

        const sid = options.getNumber("SID");

        try {
          connection.connect();
          const account = connection.query(
            `SELECT login WHERE id = ${sid} FROM pystories_users`
          );

          console.log(account);

          await interaction.reply({ content: "Pobrano dane" });

          connection.end();
        } catch (error) {
          await interaction.reply({ content: "błąd" });
        }
      }
    }
  },
};
