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
    const member = interaction.options.getUser("target")

    const findRes = await xpSchema.find({ userId: member.id, guildId: message.guild.id })
    try {
      let lvl = findRes[0].level
      let xp = findRes[0].xp
      let coins = findRes[0].coins
      let nextLvlUpThingy = Math.floor(((lvl * lvlMultiplier) * minXpForLvlUp))
      
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
  
    message.reply({ embeds: [exampleEmbed]});
    } catch(e) {
      return message.reply("This member's stats cannot be found!")
    }
	} 
};