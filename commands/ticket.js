const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals'); // Import all
const talkedRecently = new Set();
const commandDelay = 2 //hour 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('This command has everything to do with tickets.')
    .addSubcommand(subcommand =>
			subcommand
				.setName('open')
				.setDescription('Open a ticket.')
						
			)
    ,
	async execute(interaction, client) {
    if (interaction.options.getSubcommand() == "open") {
      if (talkedRecently.has(interaction.user.id)) {
        interaction.reply({content:"Please wait " + commandDelay + " hours until you can use this command again", ephemeral: true});
      } else {
        const modal = new Modal()
          .setCustomId('iquiryset')
          .setTitle('Create a ticket...');

        const txt = new TextInputComponent()
          .setCustomId('inquirytitle')
          .setLabel("Title")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(50)
          .setRequired(true);

        const desc = new TextInputComponent()
          .setCustomId('inquitydesc')
          .setLabel("Description")
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(500)
          .setRequired(true);

        const type = new SelectMenuBuilder()
          .setCustomId('inquirytype')
          .setPlaceholder('No ticket type selected')
          .addOptions(
            {
              label: "Support",
              description: "This will mark your ticket as support",
              emoji: "🆘",
              value: "asking for help on a specific topic"
            },
            {
              label: "Suggestion",
              description: "This will mark your ticket as a suggestion",
              emoji: "💡",
              value: "suggesting something"
            },
            {
              label: "Bug",
              description: "This will mark your ticket as a bug report",
              emoji: "🐛",
              value: "reporting a bug"
            },
          )
          .setRequired
      
        const row = new ActionRowBuilder().addComponents(txt);
        const row2 = new ActionRowBuilder().addComponents(desc);
        const row3 = new ActionRowBuilder().addComponents(type);
      
        modal.addComponents(row, row2, row3);
      
        await showModal({
          client: client,
          interaction: interaction
        })
        talkedRecently.add(interaction.user.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(interaction.user.id);
        }, commandDelay * 3600000);
      }
    }
	},
};