const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 0.1 //seconds 

module.exports = {
  name: 'askflight',
  description: 'This command is outdated. Please use `.flight ask`.',
  execute(message, args, client){
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {
      client.guilds.fetch("" + process.env.guildid) .then((guild) => {
        if (!guild.members.cache.get(message.author.id).roles.cache.some(role => role.id === '1021148159042392246')) return message.reply("You do not have the permissions do to this command!\nYou need the role <@&1021148159042392246> to do this!")
        const member = message.author

        message.reply("This command is outdated! Please use `.flight ask`!")

        // Adds the user to the set so that they can't talk for a minute
        talkedRecently.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(message.author.id);
        }, commandDelay * 1000);
      }) .catch((err) => {
        message.reply("There was an error doing `.askflight`.\n**You may have to type something in the `Jet2 Communications Server` before you do `.askflight` if this was a DM command.**\nThis is because the bot needs to store the cache of the guild. Sorry!\n\nTechnical details:```" + err + "```")
      })
    }
  }
}