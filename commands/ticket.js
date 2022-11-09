const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
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
        const modal = new ModalBuilder()
          .setCustomId('iquiryset')
          .setTitle('Create a ticket...');

        const txt = new TextInputBuilder()
          .setCustomId('inquirytitle')
          .setLabel("Title")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(50)
          .setRequired(true);

        const desc = new TextInputBuilder()
          .setCustomId('inquitydesc')
          .setLabel("Description")
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(500)
          .setRequired(true);
      
        const row = new ActionRowBuilder().addComponents(txt);
        const row2 = new ActionRowBuilder().addComponents(desc);
      
        modal.addComponents(row, row2);
      
        await interaction.showModal()
        talkedRecently.add(interaction.user.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(interaction.user.id);
        }, commandDelay * 3600000);
      }
    }
	},
};