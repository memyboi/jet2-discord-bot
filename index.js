require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const musername = process.env.MONGO_USERNAME
const mpassword = process.env.MONGO_PASSWORD
const mongoose = require('mongoose')
const url = `mongodb+srv://${musername}:${mpassword}@jet2-bot-db.vzm6jkt.mongodb.net/?retryWrites=true&w=majority`

//SETTINGS
const SendAnnInEmbed = true //Send Announcements in Embeds or not
const SendTestAnnouncements = false //Send Announcements as a 'test announcement', which pings @here and states it is a test.
const minXpForLvlUp = 100 //Minimum XP required to level up.
const lvlMultiplier = 1.3 //How much the minimum XP cap multiplies by on level up
const minCoinReward = 5 //Minimum coins you get for leveling up
const maxCoinReward = 10 //Maximum coins you get for leveling up
const lvlRewardMultiplier = 1.2 //How much the reward multiplies by when leveling up

const xpSchema = require('./commands/gainxp.js')

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const Discord = require("discord.js");
const client = new Client({
  intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildBans,
  ],
  partials: [
  Partials.Channel
  ]
});
const fs = require('fs');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ActivityType, ButtonStyle } = require('discord.js');


client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command)
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const addLevel = async (guildId, userId, cLevel) => {
  try {
    const result = await xpSchema.findOneAndUpdate({
      guildId,
      userId
    }, {
      guildId,
      userId,
      xp: 0,
      $inc: {
        level: 1,
        coins: getRandomArbitrary(minCoinReward, maxCoinReward) * (lvlRewardMultiplier * cLevel)
      }
    }, {
      upsert: true,
      new: true
    })
  } catch(e) {
    console.log(e)
  }
}

const addXP = async (guildId, userId, xpToAdd) => {
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

const addCoins = async (guildId, userId, coinsToAdd) => {
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

const addLevelCmd = async (guildId, userId, levels) => {
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

async function doXp(message) {
  addXP(message.guild.id, message.author.id, getRandomArbitrary(1, 5))
  let cLevel = 1
  let cXp = 0
  let oCoins = 0
  const findRes = await xpSchema.find({ userId: message.author.id, guildId: message.guild.id })
  try {
    cLevel = findRes[0].level
    cXp = findRes[0].xp
    oCoins = findRes[0].coins
    let nextLvlUpThingy = ((cLevel * lvlMultiplier) * minXpForLvlUp)
    if (cXp >= nextLvlUpThingy) {
      //level up
      addLevel(message.guild.id, message.author.id, cLevel)
      let nCoins
      const findRes2 = await xpSchema.find({ userId: message.author.id, guildId: message.guild.id })
      try {
        nCoins = findRes2[0].coins
      } catch(e) {
        console.log(e)
      }
      coins = Math.floor(nCoins - oCoins)
      message.author.send("**You've leveled up!**\n\nYou have levelled up to level " + (cLevel + 1) + "!\nYou now have " + nCoins + " Jet2 Points!") 
    }
  } catch(e) {
    console.log(e)
  }
}

const prefix = '.';

client.on("messageCreate", async message => {
  if (!message.content.toLowerCase().startsWith(prefix) && !message.author.bot && message.guild != null) doXp(message)
  if (message.content.toLowerCase().startsWith(prefix) && !message.author.bot) {
    let args = message.content.substring(prefix.length).toLowerCase().split(" ")

    switch(args[0]){
      case 'roles':
        client.commands.get('roles').execute(message, args, client);
      break;

      case 'aflight':
        client.commands.get('aflight').execute(message, args, client);
      break;

      case 'af':
        client.commands.get('aflight').execute(message, args, client);
      break;

      case 'askflight':
        client.commands.get('askflight').execute(message, args, client);
      break;

      case 'askf':
        client.commands.get('askflight').execute(message, args, client);
      break;

      case 'cancelflight':
        client.commands.get('cancelflight').execute(message, args, client);
      break;

      case 'cf':
        client.commands.get('cancelflight').execute(message, args, client);
      break;

      case 'aa':
        client.commands.get('askadmin').execute(message, args, client);
      break;

      case 'askadmin':
        client.commands.get('askadmin').execute(message, args, client);
      break;

      case 'stats':
        client.commands.get('stats').execute(message, args, client, xpSchema, lvlMultiplier, minXpForLvlUp);
      break;

      case 'buy':
        client.commands.get('buy').execute(message, args, client, xpSchema);
      break;

      case 'shop':
        client.commands.get('shop').execute(message, args, client);
      break;

      case 'flight':
        client.commands.get('flight').execute(message, args, client);
      break;

      case 'f':
        client.commands.get('flight').execute(message, args, client);
      break;

      case 'givexp':
        if (!message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.id === '1022242671202418809')) return message.reply("You do not have the permissions do to this command!\nYou need the role <@&1022242671202418809> to do this!")
        const mentionedMember = message.mentions.members.first()
        const memberUserId = mentionedMember.id
        addXP(message.guild.id, memberUserId, parseInt(args[2]))
        message.reply("Added " + args[2] + " xp to " + mentionedMember.tag + "'s stats")
      break;

      case 'givepoints':
        if (!message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.id === '1022242671202418809')) return message.reply("You do not have the permissions do to this command!\nYou need the role <@&1022242671202418809> to do this!")
        const mentionedMembera = message.mentions.members.first()
        const memberUserIda = mentionedMembera.id
        addCoins(message.guild.id, memberUserIda, parseInt(args[2]))
        message.reply("Added " + args[2] + " points to " + mentionedMembera.tag + "'s stats")
      break;

      case 'givelevels':
        if (!message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.id === '1022242671202418809')) return message.reply("You do not have the permissions do to this command!\nYou need the role <@&1022242671202418809> to do this!")
        const mentionedMemberaa = message.mentions.members.first()
        const memberUserIdaa = mentionedMemberaa.id
        addLevelCmd(message.guild.id, memberUserIdaa, parseInt(args[2]))
        message.reply("Added " + args[2] + " levels to " + mentionedMemberaa.tag + "'s stats")
      break;
        
      case 'help':
        const helpEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Command help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('Do ' + prefix + "help [1-4] for info about me!")
          .setTimestamp()
        
        const helpEmbed1 = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Command help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('' + prefix + "help page 1")
          .addFields(
            { name: "How do i gain xp up?", value: "You can gain xp by chatting! You get a minimum of 1 and a maximum of 5 XP when you chat! Using commands does not grant XP, however.", inline: false },
            { name: "How do i level up?", value: "You can level up by gaining XP! Once you have a certain amount of XP, you will level up! You will also get a few Jet2 Points!", inline: false },
            { name: "What do i do with Jet2 Points?", value: "You can do " + prefix + "shop for a menu of all the things you can buy with your Jet2 Points!", inline: false },
          )
          .setTimestamp()

        const helpEmbed2 = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Command help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('' + prefix + "help page 2")
          .addFields(
            { name: prefix + client.commands.get('roles').name, value: client.commands.get('roles').description, inline: true },
            { name: prefix + client.commands.get('stats').name, value: client.commands.get('stats').description, inline: true },
            { name: prefix + client.commands.get('askadmin').name, value: client.commands.get('askadmin').description, inline: true },
          )
          .setTimestamp()

        const helpEmbed3 = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Command help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('' + prefix + "help page 3")
          .addFields(
            { name: prefix + client.commands.get('flight').name, value: client.commands.get('flight').description, inline: true },
            { name: prefix + client.commands.get('aflight').name, value: client.commands.get('aflight').description, inline: true },
            { name: prefix + client.commands.get('cancelflight').name, value: client.commands.get('cancelflight').description, inline: true },
            { name: prefix + client.commands.get('askflight').name, value: client.commands.get('askflight').description, inline: true },
          )
          .setTimestamp()

        const helpEmbed4 = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Command help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('' + prefix + "help page 4")
          .addFields(
            { name: "Who created me?", value: "DeadFry42#5445", inline: true },
            { name: "What is my purpose?", value: "My purpose is to assist with the Jet2 Staff! I may offer some things to passengers, too, but my priority is helping staff.", inline: true },
          )
          .setTimestamp()

        if (args[1] == "1") {
          return message.reply({ embeds: [helpEmbed1]});
        } else if (args[1] == "2") {
          return message.reply({ embeds: [helpEmbed2]});
        } else if (args[1] == "3") {
          return message.reply({ embeds: [helpEmbed3]});
        } else if (args[1] == "4") {
          return message.reply({ embeds: [helpEmbed4]});
        }
        message.reply({ embeds: [helpEmbed]});
      break;
    }
  } else {
    if (message.author.bot) return;
  }
})

client.on("ready", async () => {
  await mongoose.connect(
    url,
    {
      keepAlive: true
    }
  )
  console.log("ready and on")
  client.user.setActivity(prefix + 'help for help', { type: ActivityType.Playing })
})

client.on("interactionCreate", async interaction => {
  if (interaction.isSelectMenu()) {
    //select menu here
    switch(interaction.customId){
      case "aflight timeframe":
        //aflight select menu for timeframe of flight
        if (interaction.values[0] == "cancel") return interaction.message.edit({
          content: "This announcement has been cancelled. Please post `.flight announce` in `Jet2 Communications Server` or `here, in DMs` to announce a flight.",
          components: []
        })
        interaction.message.edit({
          content: "This `.flight announce` command has been used. Please post `.flight announce` in `Jet2 Communications Server` or `here, in DMs` to announce another flight.\nOption: " + interaction.values[0],
          components: []
        }) .then((msg) => {
          let time = "nil value"
          switch(interaction.values[0]){
            case "now":
              time = "now! Join up *(link in <#1007959104611946547>)*"
            break;

            case "5m":
              time = "in 5 minutes"
            break;
              
            case "10m":
              time = "in 10 minutes"
            break;
              
            case "15m":
              time = "in 15 minutes"
            break;

            case "20m":
              time = "in 20 minutes"
            break;

            case "25m":
              time = "in 25 minutes"
            break;

            case "30m":
              time = "in 30 minutes"
            break;

            case "45m":
              time = "in 45 minutes"
            break;
              
            case "1h":
              time = "in 1 hour"
            break;

            case "1h15m":
              time = "in 1 hour and 15 minutes"
            break;
              
            case "1h30m":
              time = "in 1 hour and 30 minutes"
            break;

            case "1h45m":
              time = "in 1 hour and 45 minutes"
            break;

            case "2h":
              time = "in 2 hours"
            break;

            case "3h":
              time = "in 3 hours"
            break;

            case "4h":
              time = "in 4 hours"
            break;
              
            case "5h":
              time = "in 5 hours"
            break;

            case "6h":
              time = "in 6 hours"
            break;
          }
          
          console.log("" + interaction.user.tag + " selected " + time + " for an announcement!")

          client.guilds.fetch("" + process.env.guildid) .then((guild) => {
            guild.channels.fetch("" + process.env.announcementchannelid) .then((channel) => {
              if (SendAnnInEmbed == false) {
                if (SendTestAnnouncements) channel.send("||@here||\nTHIS IS A TEST, DO NOT JOIN\n\n" + process.env.emojilogo + "**Flight Announcement by " + interaction.user.tag + "** " + process.env.emojilogo + "\nHappening " + time + "!")
                if (!SendTestAnnouncements) channel.send("||@everyone||\n\n" + process.env.emojilogo + "**Flight Announcement by " + interaction.user.tag + "** " + process.env.emojilogo + "\nHappening " + time + "!")
              } else {
                const testAnnouncementEmbed = new EmbedBuilder()
                  .setColor('#ff0000')
                  .setTitle(process.env.emojilogo + " TEST Flight Announcement! " + process.env.emojilogo)
                  .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
                  .setDescription('This is an announcement for a test flight!')
                  .addFields(
                    { name: "When is it happening?", value: "Happening " + time + "!", inline: false },
                  )
                  .setTimestamp()
                const announcementEmbed = new EmbedBuilder()
                  .setColor('#ff0000')
                  .setTitle(process.env.emojilogo + " Flight Announcement! " + process.env.emojilogo)
                  .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
                  .setDescription('This is an announcement for a flight!')
                  .addFields(
                    { name: "When is it happening?", value: "Happening " + time + "!", inline: false },
                  )
                  .setTimestamp()
                if (SendTestAnnouncements) channel.send({ content: "||@here||", embeds: [testAnnouncementEmbed]});
                if (!SendTestAnnouncements) channel.send({ content: "||@everyone||", embeds: [announcementEmbed]});
              }
              
              
            })
          })
        }) .catch((err) => {
          console.log(err)
        })
        interaction.deferUpdate();
      break;

      case "askadmin admin select":
        if (interaction.values[0] == "Cancel") return interaction.message.edit({
          content: "This request has been cancelled. Please post `.askadmin` in `Jet2 Communications Server` or `here, in DMs` to send another request.",
          components: []
        })

        if (interaction.values[0] != "Cancel") {
          const adminId = interaction.values[0]
          const messageArgs = interaction.message.content.split(" ")
          const jord = messageArgs[6]
          if (jord == "`Jet2") {
            //Sent in Jet2
            let message = "message not found"
            const skiptillmessage = 17
            const cut = 17
            let counter = 0
            while (counter < skiptillmessage) {
              messageArgs.shift()
              counter++;
            }
            message = messageArgs.join(" ")
            message = message.substring(cut)
             client.users.fetch('' + adminId).then((user) => {
              user.send("You have been sent a request by <@" + interaction.user.id + ">!\nMessage:\n" + message)
              interaction.message.edit({
                content: "This request has been sent to <@" + adminId + ">. Please post `.askadmin` in `Jet2 Communications Server` or `here, in DMs` to send another request.",
                components: []
              })
            }).catch(console.error);
          } else {
            //Sent in DMs.
            let message = "message not found"
            const skiptillmessage = 15
            const cut = 17
            let counter = 0
            while (counter < skiptillmessage) {
              messageArgs.shift()
              counter++
            }
            message = messageArgs.join(" ")
            message = message.substring(cut)
             client.users.fetch('' + adminId).then((user) => {
              user.send("You have been sent a request by <@" + interaction.user.id + ">!\nMessage:\n" + message)
              interaction.message.edit({
                content: "This request has been sent to <@" + adminId + ">. Please post `.askadmin` in `Jet2 Communications Server` or `here, in DMs` to send another request.",
                components: []
              })
            }).catch(console.error);
          }
         
        }
        
        interaction.deferUpdate();
      break;
    }
  }
})

client.on("guildMemberAdd", function(member){
  console.log(member)
  client.commands.get('guildmemberadd').execute(member, client);
})

client.on("guildMemberRemove", function(member){
  console.log(member)
  client.commands.get('guildmemberremove').execute(member, client);
})

client.login(process.env.token)