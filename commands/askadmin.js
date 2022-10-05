const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 1 //hour 

const adminRoleID = 1021385937437065287

module.exports = {
  name: 'askadmin',
  description: "Ask an admin (With the role '[QS] Question Staff') a question, 1h cooldown.",
  execute(message, args, client){
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Please wait " + commandDelay + " hour until you can use this command again");
    } else {
      client.guilds.fetch("" + process.env.guildid) .then((guild) => {
        if (guild.members.cache.get(message.author.id).roles.cache.some(role => role.id === '1021385937437065287')) return message.reply("You cannot do this command, as you are a <@&1021385937437065287>!")
        const member = message.author

        guild.channels.fetch("" + process.env.announcementchannelid) .then((channel) => {
          
          const row = new ActionRowBuilder()
          .addComponents(
          new SelectMenuBuilder()
            .setCustomId('askadmin admin select')
            .setPlaceholder('Please select an admin here:')
            .addOptions(
              {
                label: 'Lego#7909',
                value: '926858136785137704',
              },
              {
                label: 'DeadFry#5445',
                value: '529331877727698954',
              },
              {
                label: 'Cancel',
                value: 'Cancel',
              },
            ),
    			);

          args.shift()
          let reason = args.join(" ")

          if (args.join(" ") == null || args.join(" ") == "") {
            if (message.guild != null) {
              member.send("You did the command `.askadmin` in `Jet2 Communications Server`, however, you did not add a reason. Please add a reason to the end of command!\nYour cooldown for 1h has not started, as it starts when you add a reason to the command.")
              message.delete()
              return 0
            } else if (message.guild == null) {
              member.send("You did the command `.askadmin` in `DMs`, however, you did not add a reason. Please add a reason to the command!\nYour cooldown for 1h has not started, as it starts when you add a reason to the command.")
              return 0
            } 
          }

          if (message.guild != null) {
           // Adds the user to the set so that they can't talk for an hour
          talkedRecently.add(message.author.id);
          setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
          }, commandDelay * 36000000);
          member.send(
            {
              content: "You did the command `.askadmin` in `Jet2 Communications Server`.\nPlease select the admin below that you'd like to contact!\nMessage:\n```" + reason + "```", 
              components: [row]
            })
            message.delete()
          } else {
           member.send(
             {
              content: "You did the command `.askadmin` in `DMs`.\nPlease select the admin below that you'd like to contact!\nMessage:\n```" + reason + "```", 
              components: [row]
            }) 
          }
        }) .catch((err) => {
          console.log(err)
          message.reply("There was a problem while making an ask request. Sorry!\n\nTechnical details:\n```" + err + "```")
        })
      }) .catch((err) => {
        message.reply("There was an error doing `.askadmin`.\n**You may have to type something in the `Jet2 Communications Server` before you do `.askadmin` if this was a DM command.**\nThis is because the bot needs to store the cache of the guild. Sorry!")
      })
    }
  }
}