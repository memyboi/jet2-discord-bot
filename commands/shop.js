const { EmbedBuilder } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 1 //seconds 

module.exports = {
  name: 'shop',
  description: "Shows you everything you can buy",
  async execute(message, args, client){
    if (message.guild == null) return message.reply("You cannot do this command in DMs.");
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {
      const exampleEmbed = new EmbedBuilder()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL()})
      .setDescription(`Shop, 1 (Roles)`)
      .addFields(
        { name: "Exotic Role", value: "25 Jet2 Points\nOnly people with '[E] Exotic' can talk in 'Exotic Channel'.\n`.buy Exotic`", inline: true },
      )
      .setColor("#ff0000")
    
      message.reply({ embeds: [exampleEmbed]});

      // Adds the user to the set so that they can't talk for a minute
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        talkedRecently.delete(message.author.id);
      }, commandDelay * 1000);
    }
  }
}