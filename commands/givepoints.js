const { EmbedBuilder } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 1 //seconds 

const addCoins = async (guildId, userId, coinsToAdd, xpSchema) => {
  try {
    const result = await xpSchema.findOneAndUpdate({
      guildId,
      userId
    }, {
      guildId,
      userId,
      $inc: {
        coins: coinsToAdd
      }
    }, {
      upsert: true,
      new: true
    })
  } catch(e) {
    console.log(e)
  }
}

module.exports = {
  name: 'givepoints',
  description: 'Gives a certain user the specifed amount of Jet2Points.',
  execute(message, args, client, xpSchema){
    if (!message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.id === '1022242671202418809')) return message.reply("You do not have the permissions do to this command!\nYou need the role <@&1022242671202418809> to do this!")
    const mentionedMember = message.mentions.members.first()
    const memberUserId = mentionedMember.id
    addCoins(message.guild.id, memberUserId, parseInt(args[2]), xpSchema)
    message.reply("Added " + args[2] + " points to " + mentionedMember.tag + "'s stats")
  }
}