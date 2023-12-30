const { EmbedBuilder } = require("@discordjs/builders");
const { Events } = require("discord.js");
const { whitelistRolesId } = require("../config/config.json");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (!message.guild) return;
    if (!message.member) return;
    if (
      message.member.roles.cache.some((role) =>
        whitelistRolesId.includes(role.id)
      )
    )
      return;

    const embed = new EmbedBuilder()
      .setColor(15548997)
      .setTitle("Wystąpił błąd!")
      .setDescription(
        `<@${message.author.id}> wysyłanie linków jest zabronione!`
      )
      .setTimestamp()
      .setFooter({
        text: "SpaceMTA",
        iconURL:
          "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
      });

    function deleteMessage() {
      message.delete();
      message.channel.send({ embeds: [embed] });
    }

    const links = ["discord.gg/", "discord.com/invite/"];

    for (const link of links) {
      if (!message.content.includes(link)) return;

      const code = message.content.split(link)[1].split(" ")[0];
      const isGuildInvite = message.guild.invites.cache.has(code);

      if (!isGuildInvite) {
        try {
          const vanity = await message.guild.fetchVanityData();
          if (code !== vanity?.code) return deleteMessage();
        } catch (error) {
          deleteMessage();
        }
      }
    }
  },
};
