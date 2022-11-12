const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Shows you the stats of a user you specify.')
    .addUserOption(Option =>
			Option
				.setName('target')
				.setDescription('The user that you would like to know the stats of.')
			)
    ,
	async execute(interaction, client) {
    const xpSchema = require('../gainxp.js')
    let member = interaction.options.getUser("target")

    if (!member) member = interaction.user

    const findRes = await xpSchema.find({ userId: member.id, guildId: interaction.guild.id })
    try {
      let lvl = findRes[0].level
      let xp = findRes[0].xp
      let coins = findRes[0].coins
      let nextLvlUpThingy = Math.floor(((lvl * 1.3) * 100))
      
      const exampleEmbed = new EmbedBuilder()
      .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL()})
      .setDescription(`${process.env.emojilogo}${member}'s stats: ${process.env.emojilogo}`)
      .addFields(
        { name: "**Level** ", value: "" + lvl, inline: true },
        { name: "**XP** ", value: "" + xp, inline: true },
        { name: "**Jet2 Points** ", value: "" + coins, inline: true },
        { name: "**XP Needed until level up:** ", value: "" + nextLvlUpThingy, inline: false },
      )
      .setColor("#ff0000")
  
      interaction.reply({ embeds: [exampleEmbed], ephemeral: true});
    } catch(e) {
      console.log(e)
      return interaction.reply({content:"This member's stats cannot be found!", ephemeral: true})
    }
	} 
};