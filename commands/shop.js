const { EmbedBuilder } = require('discord.js')

const { SlashCommandBuilder, PermissionsBitField } = require('discord.js')
const { SelectMenuComponent } = require("discord-modals")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Sends the shop contents.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
    ,
	async execute(interaction, client) {
    const exampleEmbed = new EmbedBuilder()
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
      .setDescription(`Shop, 1 (Roles)`)
      .addFields(
        { name: "Exotic Role", value: "25 Jet2 Points\nOnly people with '[E] Exotic' can talk in 'Exotic Channel'.\n`/buy Exotic`", inline: true },
      )
      .setColor("#ff0000")
    
    interaction.reply({ embeds: [exampleEmbed], ephemeral: true});
	} 
};