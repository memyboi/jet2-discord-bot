const { EmbedBuilder } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 1 //seconds 

module.exports = {
  name: 'stats',
  description: "Displays all of someone's stats, including XP, Level and Coins!",
  async execute(message, args, client, xpSchema, lvlMultiplier, minXpForLvlUp){
    if (message.guild == null) return message.reply("You cannot do this command in DMs.");
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {
      let member = message.mentions.members.first();
      if (!member) return message.reply("Please mention a user.")

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
      
      // Adds the user to the set so that they can't talk for a minute
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        talkedRecently.delete(message.author.id);
      }, commandDelay * 1000);
    }
  }
}