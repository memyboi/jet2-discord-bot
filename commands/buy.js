const { EmbedBuilder } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 1 //seconds 

module.exports = {
  name: 'buy',
  description: "Buys a certain item from .shop",
  async execute(message, args, client, xpSchema){
    if (message.guild == null) return message.reply("You cannot do this command in DMs.");
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {

      async function availableTB(cost) { //available to buy
        const findRes = await xpSchema.find({ userId: message.author.id, guildId: message.guild.id })
        try {
          let coins = findRes[0].coins
          if (coins >= cost) {
            return 0
          } else {
            return 1
          }
        } catch(e) {
          return 2
        }
      }

      let guildId = message.guild.id
      let userId = message.author.id
      
      if (args[1] == "exotic") {
        console.log(args[1])
        let status = await availableTB(25)
        if (status == 0) {
          //buy
          if (message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.id === '1021523901500624946')) {
            //owns
            message.reply("You already own this item!")
          } else {
             try {
              const result = await xpSchema.findOneAndUpdate({
                guildId,
                userId
              }, {
                guildId,
                userId,
                $inc: {
                  coins: -25
                }
              }, {
                upsert: true,
                new: true
              })
              let role = message.guild.roles.cache.find(r => r.id === "1021523901500624946");
              message.guild.members.cache.get(message.author.id).roles.add(role)
              message.reply("Successfully purchased Exotic Role!")
            } catch(e) {
              console.log(e)
            }
          }
        } else if (status == 1) {
          //not enough coins
          message.reply("You do not have enough Jet2 Points to purchase Exotic Role.")
        } else if (status == 2) {
          //error
          message.reply("An error occured while doing the command. No change has occured.")
        }
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