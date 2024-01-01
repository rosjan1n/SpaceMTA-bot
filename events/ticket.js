const { EmbedBuilder } = require("@discordjs/builders");
const {
  Events,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const { ticketWhitelistRolesId } = require("../config/config.json");
const fs = require("fs");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (interaction.isCommand()) {
      if (interaction.commandName === "ticket") {
        const { options } = interaction;

        const selectedChannel = options.getChannel("kanal");

        const res = new EmbedBuilder()
          .setColor([74, 148, 215]) // niebieski
          .setTitle("Utwórz ticket")
          .setDescription("Aby utworzyć ticket, wciśnij przycisk poniżej.")
          .setFooter({
            text: "SpaceMTA - Ticket",
            iconURL:
              "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
          });

        const createTicketButton = new ButtonBuilder()
          .setCustomId("createTicket")
          .setLabel("Utwórz ticket")
          .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(createTicketButton);

        try {
          await selectedChannel.send({ embeds: [res], components: [row] });
          res
            .setTitle(`Ticket`)
            .setColor([0, 255, 0])
            .setDescription(
              `Panel został wysłany na kanał <#${selectedChannel.id}>.`
            )
            .setTimestamp()
            .setFooter({
              text: "SpaceMTA - Ticket",
              iconURL:
                "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
            });

          await interaction.reply({ embeds: [res], ephemeral: true });
        } catch (error) {
          res
            .setColor([255, 0, 0]) // czerwony
            .setTitle("Wystąpił błąd!")
            .setDescription("Nie wysłano panelu na kanał.")
            .setTimestamp()
            .setFooter({
              text: "SpaceMTA - Ticket",
              iconURL:
                "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
            });

          await interaction.reply({ embeds: [res], ephemeral: true });
        }
      }
    } else if (interaction.isButton()) {
      if (interaction.customId === "createTicket") {
        const ticketsJson = fs.readFileSync("tickets.json");
        const ticketsData = JSON.parse(ticketsJson);

        const { user, guild } = interaction;
        const everyoneRoleId = guild.roles.everyone.id;
        var ticketCategory = guild.channels.cache.find(
          (c) =>
            c.type == ChannelType.GuildCategory &&
            c.name.toLowerCase() == "tickety"
        );
        const ticketExist = ticketsData.find(
          (ticket) => ticket.creatorId === user.id
        );

        if (ticketExist) {
          const res = new EmbedBuilder()
            .setColor([255, 0, 0])
            .setTitle("Wystąpił błąd")
            .setDescription(
              `Masz już otwarty ticket <#${ticketExist.channelId}>`
            )
            .setTimestamp()
            .setFooter({
              text: "SpaceMTA - Ticket",
              iconURL:
                "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
            });

          return await interaction.reply({ embeds: [res], ephemeral: true });
        }

        if (!ticketCategory) {
          ticketCategory = await guild.channels.create({
            name: "tickety",
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
              {
                id: everyoneRoleId,
                deny: [PermissionsBitField.Flags.ViewChannel],
              },
            ],
          });
        }

        try {
          const ticketId = (
            ticketsData.length > 0
              ? ticketsData[ticketsData.length - 1].id + 1
              : 1
          )
            .toString()
            .padStart(3, "0");
          const newChannel = await guild.channels.create({
            name: `ticket-${ticketId}`,
          });

          await newChannel.setParent(ticketCategory.id);

          await newChannel.permissionOverwrites.edit(user, {
            ViewChannel: true,
            SendMessages: true,
          });

          ticketWhitelistRolesId.forEach(async (roleId) => {
            const role = guild.roles.cache.find((role) => role.id == roleId);
            if (role) {
              await newChannel.permissionOverwrites.edit(role, {
                ViewChannel: true,
                SendMessages: true,
              });
            }
          });

          const res = new EmbedBuilder()
            .setTitle(`Ticket #${ticketId}`)
            .setColor([0, 255, 0])
            .setDescription(
              `Twój ticket został pomyślnie stworzony. <#${newChannel.id}>`
            )
            .setTimestamp()
            .setFooter({
              text: "SpaceMTA - Ticket",
              iconURL:
                "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
            });

          await interaction.reply({ embeds: [res], ephemeral: true });

          res
            .setTitle(`Ticket #${ticketId}`)
            .setColor([74, 148, 215])
            .setDescription(
              "Opisz swój problem, następnie cierpliwie oczekuj na odpowiedź od Naszego zespołu.\nPamiętaj, aby nikogo nie oznaczać."
            )
            .setTimestamp()
            .setFooter({
              text: "SpaceMTA - Ticket",
              iconURL:
                "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
            });

          const closeTicket = new ButtonBuilder()
            .setCustomId("closeTicket")
            .setLabel("Zamknij ticket")
            .setStyle(ButtonStyle.Danger);

          const row = new ActionRowBuilder().addComponents(closeTicket);

          await newChannel.send({
            content: `<@${user.id}>`,
            embeds: [res],
            components: [row],
          });

          ticketsData.push({
            id:
              ticketsData.length > 0
                ? ticketsData[ticketsData.length - 1].id + 1
                : 1,
            creatorId: user.id,
            channelId: newChannel.id,
          });
          fs.writeFileSync("tickets.json", JSON.stringify(ticketsData));
        } catch (error) {
          console.log(error);
          const res = new EmbedBuilder()
            .setColor([255, 0, 0])
            .setTitle("Wystąpił błąd")
            .setDescription("Spróbuj ponownie później.")
            .setTimestamp()
            .setFooter({
              text: "SpaceMTA - Ticket",
              iconURL:
                "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
            });

          await interaction.reply({ embeds: [res], ephemeral: true });
        }
      } else if (interaction.customId === "closeTicket") {
        const ticketsJson = fs.readFileSync("tickets.json");
        const ticketsData = JSON.parse(ticketsJson);

        const { channelId, channel, guild } = interaction;
        const ticket = ticketsData.find(
          (ticket) => ticket.channelId == channelId
        );
        const res = new EmbedBuilder()
          .setColor([255, 0, 0])
          .setTimestamp()
          .setFooter({
            text: "SpaceMTA - Ticket",
            iconURL:
              "https://cdn.discordapp.com/attachments/1133444411603304520/1189956418997075978/space-travel_1.png?ex=65a00c46&is=658d9746&hm=8fb05b40294eb4948fbc882a6d3343d6ab9779500fe7302bf8f68178e26be51f&",
          });

        if (!ticketsData.find((ticket) => ticket.channelId === channelId)) {
          res
            .setTitle("Wystąpił błąd")
            .setDescription("Ticket został już zamknięty.");

          return await interaction.reply({ embeds: [res], ephemeral: true });
        }

        try {
          fs.writeFileSync(
            "tickets.json",
            JSON.stringify(
              ticketsData.filter((ticket) => ticket.channelId !== channelId)
            )
          );

          res.setDescription("Ticket został zamknięty.").setAuthor({
            name: interaction.user.displayName,
            iconURL: interaction.user.displayAvatarURL(),
          });

          const deleteTicket = new ButtonBuilder()
            .setCustomId("deleteTicket")
            .setLabel("Usuń ticket")
            .setStyle(ButtonStyle.Danger);

          const row = new ActionRowBuilder().addComponents(deleteTicket);

          await interaction.reply({ embeds: [res], components: [row] });

          const creator = guild.members.cache.find(
            (user) => user.id === ticket.creatorId
          );

          channel.edit({
            name: `closed-${ticket.id.toString().padStart(3, "0")}`,
          });
          channel.permissionOverwrites.edit(creator, { ViewChannel: false });
        } catch (error) {
          res
            .setTitle("Wystąpił błąd")
            .setDescription("Spróbuj ponownie później.");

          await interaction.reply({ embeds: [res] });
        }
      } else if (interaction.customId === "deleteTicket") {
        const { channel } = interaction;

        await interaction.reply({ content: "Ticket został usunięty" });

        await channel.delete();
      }
    }
  },
};
