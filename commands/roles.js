const { EmbedBuilder } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 1 //seconds 

module.exports = {
  name: 'roles',
  description: 'Displays all of someones roles. Mention them in the command to see them',
  execute(message, args, client){
    if (message.guild == null) return message.reply("You cannot do this command in DMs.");
     if (talkedRecently.has(message.author.id)) {
            message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {

        const member = message.mentions.members.first();
    if (!member) return message.reply("Please specify a member!")

    const memberRoles = member.roles.cache
      .filter((roles) => roles.id !== message.guild.id)
      .map((role) => role.toString());

    const exampleEmbed = new EmbedBuilder()
      .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL()})
      .setDescription(`${member}'s role(s) => ${memberRoles}`)
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