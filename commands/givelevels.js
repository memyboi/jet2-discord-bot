const { EmbedBuilder } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 1 //seconds 

const addLevelCmd = async (guildId, userId, levels, xpSchema) => {
  try {
    const result = await xpSchema.findOneAndUpdate({
      guildId,
      userId
    }, {
      guildId,
      userId,
      $inc: {
        level: levels,
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
  name: 'givelevels',
  description: 'Gives a certain user the specifed amount of levels.',
  execute(message, args, client, xpSchema){
    if (!message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.id === '1022242671202418809')) return message.reply("You do not have the permissions do to this command!\nYou need the role <@&1022242671202418809> to do this!")
    const mentionedMemberaa = message.mentions.members.first()
    const memberUserIdaa = mentionedMemberaa.id
    addLevelCmd(message.guild.id, memberUserIdaa, parseInt(args[2]), xpSchema)
    message.reply("Added " + args[2] + " levels to " + mentionedMemberaa.tag + "'s stats")
  }
}