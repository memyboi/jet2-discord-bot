const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, PermissionsBitField } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 2 //hour 
const { SelectMenuComponent } = require("discord-modals")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('This command has everything to do with tickets.')
    .addSubcommand(subcommand =>
			subcommand
				.setName('open')
				.setDescription('Open a ticket.')
						
			)
    .addSubcommand(subcommand =>
      subcommand
        .setName('close')
        .setDescription('Close the ticket channel that you are currently in.')
            
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
          .setCustomId('inquirydesc')
          .setLabel("Description")
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(1000)
          .setRequired(true);
      
        const row = new ActionRowBuilder().addComponents(txt);
        const row2 = new ActionRowBuilder().addComponents(desc);
      
        modal.addComponents(row, row2);
      
        await interaction.showModal(modal)
        talkedRecently.add(interaction.user.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(interaction.user.id);
        }, commandDelay * 3600000);
      }
    } else if(interaction.options.getSubcommand() == "close") {
      if (interaction.channel.parentId == "1039252815643693106") {
        try {
          interaction.channel.delete()
          interaction.guild.members.fetch() .then(async members => {
            members.forEach(async member => {
              permissionsofuser = interaction.channel.permissionsFor(member.user)
              if (member.roles.cache.some(role => role.id === '1021385937437065287') || permissionsofuser && permissionsofuser.has(PermissionsBitField.Flags.ViewChannel, true)) {
                member.user.send("A ticket that you are a part of has been closed.")
              }
            })
          })
        } catch {

        }
      } else {
        interaction.reply({content: "This is not a ticket channel >:(", ephemeral: true})
      }
    }
	} 
};