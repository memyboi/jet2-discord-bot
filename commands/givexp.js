const { EmbedBuilder } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 1 //seconds 

const addXP = async (guildId, userId, xpToAdd, xpSchema) => {
  try {
    const result = await xpSchema.findOneAndUpdate({
      guildId,
      userId
    }, {
      guildId,
      userId,
      $inc: {
        xp: xpToAdd
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
  name: 'givexp',
  description: 'Gives a certain user the specifed amount of XP.',
  execute(message, args, client, xpSchema){
    if (!message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.id === '1022242671202418809')) return message.reply("You do not have the permissions do to this command!\nYou need the role <@&1022242671202418809> to do this!")
    const mentionedMember = message.mentions.members.first()
    const memberUserId = mentionedMember.id
    addXP(message.guild.id, memberUserId, parseInt(args[2]), xpSchema)
    message.reply("Added " + args[2] + " xp to " + mentionedMember.tag + "'s stats")
  }
}