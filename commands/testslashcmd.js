const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('GGEZ')
    ,
	async execute(interaction, client) {
		
	},
};