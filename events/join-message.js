const { EmbedBuilder } = require("@discordjs/builders");
const { Events } = require("discord.js");
const { welcomeChannelId } = require("../config/config.json");

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    const channel = member.guild.channels.cache.find(
      (c) => c.id === welcomeChannelId
    );

    const res = new EmbedBuilder()
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setColor([74, 148, 215])
      .setDescription("Wszedł na serwer SpaceMTA")
      .setTimestamp()
      .setFooter({
        text: "SpaceMTA",
        iconURL:
          "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
      });

    await channel.send({ embeds: [res] });
  },
};
