const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 1 //seconds 

module.exports = {
  name: 'flight',
  description: 'Announce, ask or cancel a flight.',
  execute(message, args, client){
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {
        client.guilds.fetch("" + process.env.guildid) .then((guild) => {
        if (!guild.members.cache.get(message.author.id).roles.cache.some(role => role.id === '1021148159042392246')) return message.reply("You do not have the permissions do to this command!\nYou need the role <@&1021148159042392246> to do this!")
        const member = message.author

        var hasResponded = false

        function announce() {
            const row = new ActionRowBuilder()
            .addComponents(
            new SelectMenuBuilder()
            .setCustomId('aflight timeframe')
            .setPlaceholder('No timeframe selected')
            .addOptions(
                {
                label: 'Now',
                value: 'now',
                },
                {
                label: '5 minutes',
                value: '5m',
                },
                {
                label: '10 minutes',
                value: '10m',
                },
                {
                label: '15 minutes',
                value: '15m',
                },
                {
                label: '20 minutes',
                value: '20m',
                },
                {
                label: '25 minutes',
                value: '25m',
                },
                {
                label: '30 minutes',
                value: '30m',
                },
                {
                label: '45 minutes',
                value: '45m',
                },
                {
                label: '1 hour',
                value: '1h',
                },
                {
                label: '1 hour and 15 minutes',
                value: '1h15m',
                },
                {
                label: '1 hour and 30 minutes',
                value: '1h30m',
                },
                {
                label: '1 hour and 45 minutes',
                value: '1h45m',
                },
                {
                label: '2 hours',
                value: '2h',
                },
                {
                label: '3 hours',
                value: '3h',
                },
                {
                label: '4 hours',
                value: '4h',
                },
                {
                label: '5 hours',
                value: '5h',
                },
                {
                label: '6 hours',
                value: '6h',
                },
                {
                label: 'Nothing - Cancel',
                description: 'If this is selected, the announcement will be cancelled. No announcement will be made.',
                value: 'cancel',
                },
            ),
            );
            const row2 = new ActionRowBuilder()
            .addComponents(
            new SelectMenuBuilder()
            .setCustomId('aflight destination')
            .setPlaceholder('No destination selected.')
            .addOptions(
                {
                label: 'N/A',
                value: 'unknown',
                },
                {
                label: 'Robloxia Town',
                value: 'Robloxia Town',
                },
            ),
            );

            const row3cantpost = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('cancelAnn')
                    .setLabel('Cancel Announcement')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('postAnn')
                    .setLabel('Post Announcement')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true)
            )

            if (message.guild != null) {
            member.send( {content: "You did the command `.flight announce` in `Jet2 Communications Server`.\nPlease select the time frame below to send your flight announcement.", components: [row, row2, row3cantpost]} ) .then(() => {
                message.delete()
            }) .catch((err) => {
                message.reply("You cannot recieve a DM from me to set-up a flight announcement. This may be because your discord account does not support DMs from me or that you have blocked me.\nHowever, there could be a bug preventing me from allowing you to send an announcement form.")
                console.log(err)
            })
            } else {
            member.send( {content: "You did the command `.flight announce` in `DMs`.\nPlease select the time frame below to send your flight announcement.", components: [row, row2, row3cantpost]} ) .catch((err) => {
                message.reply("You cannot recieve a DM from me to set-up a flight announcement. This may be because your discord account does not support DMs from me or that you have blocked me.\nHowever, there could be a bug preventing me from allowing you to send an announcement form.")
            })
            }
        }

        switch (args[1]) {
            case "a":
                hasResponded = true
                announce()
            break;

            case "announce":
                hasResponded = true
                announce()
            break;

            case "ask":
                hasResponded = true
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
            break;

            case "c":
                hasResponded = true
                guild.channels.fetch("" + process.env.announcementchannelid) .then((channel) => {
                    if (message.guild != null) message.delete()
          
                    channel.lastMessage.reply("This has been cancelled. Sorry!")
                    
                  }) .catch((err) => {
                    message.reply("There was a problem while getting the last post in the channel. Sorry!\n\nTechnical details:\n```" + err + "```")
                })
            break;

            case "cancel":
                hasResponded = true
                guild.channels.fetch("" + process.env.announcementchannelid) .then((channel) => {
                    if (message.guild != null) message.delete()
          
                    channel.lastMessage.reply("This has been cancelled. Sorry!")
                    
                  }) .catch((err) => {
                    message.reply("There was a problem while getting the last post in the channel. Sorry!\n\nTechnical details:\n```" + err + "```")
                })
            break;
        }

        if (hasResponded == false) {
            message.reply("Please add an argument! Possible arguments: `announce, ask, cancel`")
        }
      
      // Adds the user to the set so that they can't talk for a minute
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        talkedRecently.delete(message.author.id);
      }, commandDelay * 1000);
      }) .catch((err) => {
        message.reply("There was an error doing `.flight`.\n**You may have to type something in the `Jet2 Communications Server` before you do `.flight` if this was a DM command.**\nThis is because the bot needs to store the cache of the guild. Sorry!\n\nTechnical details:```" + err + "```")
      })
    }
  }
}