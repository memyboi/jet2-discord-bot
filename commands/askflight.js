const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 0.1 //seconds 

module.exports = {
  name: 'askflight',
  description: 'Ask in <#' + process.env.announcementchannelid + "> if we should host a flight.",
  execute(message, args, client){
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {
      client.guilds.fetch("" + process.env.guildid) .then((guild) => {
        if (!guild.members.cache.get(message.author.id).roles.cache.some(role => role.id === '1021148159042392246')) return message.reply("You do not have the permissions do to this command!\nYou need the role <@&1021148159042392246> to do this!")
        const member = message.author

        guild.channels.fetch("" + process.env.announcementchannelid) .then((channel) => {
          if (message.guild != null) message.delete()
          const announcementEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(process.env.emojilogo + " Should we do a flight? " + process.env.emojilogo)
            .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
            .setDescription('Please vote with a ✅ or a ❎ if we should fly!')
            .setTimestamp()

          channel.send({content: "||@everyone||", embeds: [announcementEmbed]}) .then((msg) => {
            msg.react('✅')
            msg.react('❎')
          }) .catch((err) => {
            message.reply("There was a problem while adding reactions to the ask post. The post is up in <#" + process.env.announcementchannelid + ">, but you need to add the reactions manually, Sorry!\n\nTechincal Details:\n```" + err + "```")
          })
        }) .catch((err) => {
          message.reply("There was a problem while making an ask post. Sorry!\n\nTechnical details:\n```" + err + "```")
        })

        // Adds the user to the set so that they can't talk for a minute
        talkedRecently.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(message.author.id);
        }, commandDelay * 1000);
      }) .catch((err) => {
        message.reply("There was an error doing `.aflight`.\n**You may have to type something in the `Jet2 Communications Server` before you do `.aflight` if this was a DM command.**\nThis is because the bot needs to store the cache of the guild. Sorry!\n\nTechnical details:```" + err + "```")
      })
    }
  }
}