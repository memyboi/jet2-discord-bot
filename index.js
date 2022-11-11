require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const musername = process.env.MONGO_USERNAME
const mpassword = process.env.MONGO_PASSWORD
const mongoose = require('mongoose')
const url = `mongodb+srv://${musername}:${mpassword}@jet2-bot-db.vzm6jkt.mongodb.net/?retryWrites=true&w=majority`

//BUILD SETTINGS
const devBuild = false
const buildNum = 37

//SETTINGS
const SendTestAnnouncements = true //Send Announcements as a 'test announcement', which pings @here and states it is a test.
const minXpForLvlUp = 100 //Minimum XP required to level up.
const lvlMultiplier = 1.3 //How much the minimum XP cap multiplies by on level up
const minCoinReward = 5 //Minimum coins you get for leveling up
const maxCoinReward = 10 //Maximum coins you get for leveling up
const lvlRewardMultiplier = 1.2 //How much the reward multiplies by when leveling up

const xpSchema = require('./gainxp.js')

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
const path = require('path');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ActivityType, ButtonStyle, ChannelType } = require('discord.js');
const { AttachmentBuilder } = require('discord.js')
const Canvas = require('@napi-rs/canvas');

const discordModals = require("discord-modals")
discordModals(client)


client.commands = new Discord.Collection();

const commandsPath = path.join(__dirname, 'commands');

const { Routes } = require('discord.js');
const { REST } = require("@discordjs/rest")
const clientId = "1021122838163365969"
const guildId = process.env.guildid
const token = process.env.token

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  try {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  } catch {
    console.log("There was an error instantiating a command.")
  }
  
}

console.log(REST)

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    console.log(commands)

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function setCharAt(str,index,chr) {
  if(index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
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
    if (message.content == 'help') {
      const helpEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle("Command help:")
        .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
        .setDescription('Do ' + prefix + "help [1-5] for info about me!")
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
          { name: prefix + client.commands.get('givepoints').name, value: client.commands.get('givepoints').description, inline: true },
          { name: prefix + client.commands.get('givexp').name, value: client.commands.get('givexp').description, inline: true },
          { name: prefix + client.commands.get('givelevels').name, value: client.commands.get('givelevels').description, inline: true },
        )
        .setTimestamp()

      const helpEmbed5 = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle("Command help:")
        .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
        .setDescription('' + prefix + "help page 5")
        .addFields(
          { name: "Who created me?", value: "DeadFry42#5445", inline: true },
          { name: "What is my purpose?", value: "My purpose is to assist with the Jet2 Staff! I may offer some things to passengers, too, but my priority is helping staff.", inline: true },
        )
        .setTimestamp()

      if (lowerargs[1] == "1") {
        return message.reply({ embeds: [helpEmbed1]});
      } else if (lowerargs[1] == "2") {
        return message.reply({ embeds: [helpEmbed2]});
      } else if (lowerargs[1] == "3") {
        return message.reply({ embeds: [helpEmbed3]});
      } else if (lowerargs[1] == "4") {
        return message.reply({ embeds: [helpEmbed4]});
      } else if (lowerargs[1] == "5") {
        return message.reply({ embeds: [helpEmbed5]});
      }
      message.reply({ embeds: [helpEmbed]});
    }
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
  if (devBuild) {
    client.user.setActivity('dev build ' + buildNum, { type: ActivityType.Playing })
  } else {
    client.user.setActivity(prefix + 'help [1-5] for help', { type: ActivityType.Playing })
  }
})

client.on("interactionCreate", async interaction => {
  if (interaction.isSelectMenu()) {
    //select menu here
    switch(interaction.customId){
      case "aflight timeframe":
        //aflight select menu for timeframe of flight
        let time = interaction.values[0]
        console.log("" + interaction.user.tag + " selected " + time + " for the time for an announcement!")
        let numaa = time.slice(0, 1)
        let numbb = time.slice(1, 2)
        let nnewMsg = interaction.message.content
        nnewMsg = setCharAt(nnewMsg, 1, numaa)
        nnewMsg = setCharAt(nnewMsg, 2, numbb)
        interaction.message.edit(nnewMsg)
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

      case "aflight destination":
        let dest = interaction.values[0]
        console.log("" + interaction.user.tag + " selected " + dest + " for a destination for an announcement!")
        let numa = dest.slice(0, 1)
        let numb = dest.slice(1, 2)
        let newMsg = interaction.message.content
        newMsg = setCharAt(newMsg, 4, numa)
        newMsg = setCharAt(newMsg, 5, numb)
        interaction.message.edit(newMsg)
        interaction.deferUpdate();
      break;
    }
  } else if (interaction.isButton()) {
    switch(interaction.customId){
      case "cancelAnn":
        //cancel announcement form
        let cancelMsg = "This announcement has been cancelled. Please post `.flight announce` in `Jet2 Communications Server` or `here, in DMs` to announce a flight."
        interaction.message.edit({content: cancelMsg, components: [], embeds: []})
        interaction.deferUpdate();
      break;

      case "postAnn":
        let timeofflight = "undefined"
        let destofflight = "undefined"
        let additionalinfo = null
        let timesmNum = 0
        let destsmNum = 0

        let msg = interaction.message
        let splitMsg = msg.content.split(" ")
        //args[1] = (##,##)
        //first ## = time num, second ## = dest num
        timesmNum = splitMsg[0].substring(1).trim(4)
        destsmNum = splitMsg[0].substring(4).trim(1)
        console.log(splitMsg)
        console.log("\n\n\n\n\njet2:\n"+splitMsg[20])
        console.log("\n\n\n\n\ndms:\n"+splitMsg[18])
        if (splitMsg[20] == "announcement.\nAdditional" && splitMsg[9] == "`Jet2" || splitMsg[18] == "announcement.\nAdditional" && splitMsg[9] == "`DMs`.\nPlease") {
          //additional info present, starts at 23
          console.log("additional info detected")
          let addArgs = splitMsg
          const skiptillmessage = 22
          var counter = 0
          while (counter < skiptillmessage) {
            addArgs.shift()
            counter++
          }
          //info begins at 1 of addArgs
          additionalinfo = addArgs.join(" ")
          additionalinfo.substring(3)
          additionalinfo.trim(3)
          console.log(additionalinfo)
        }
        if (timesmNum.startsWith("0")) timesmNum.substring(1)
        if (destsmNum.startsWith("0")) destsmNum.substring(1)
        
        if (timesmNum.startsWith("#") || destsmNum.startsWith("#")) {
          return interaction.reply("You need to specify a time AND destination to be able to post!")
        }

        timesmNum = parseInt(timesmNum)
        destsmNum = parseInt(destsmNum)

        function docomponentstuffs(row, idx, allrows) {
          if (idx == 0) {
            //First row, time row
            let selectMenu = row.components[0]
            timeofflight = selectMenu.options[timesmNum].value
          } else if (idx == 1) {
            //Second row, dest row
            let selectMenu = row.components[0]
            destofflight = selectMenu.options[destsmNum].value
          } else if (idx == 2) {
            //Third row, Post and cancel buttons row
            //we dont really need these.
          }
        }
        interaction.message.components.forEach(docomponentstuffs)

        timeofflight = timeofflight.substring(2)
        destofflight = destofflight.substring(2)
        


        //post announcement form to flight-announcements
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
                .setDescription('THIS IS NOT A FLIGHT, IT IS A BOT TEST.')
                .addFields(
                  { name: "When is it happening?", value: "Happening " + timeofflight + "!", inline: false },
                  { name: "Where is it going to?", value: destofflight, inline: false },
                )
                .setTimestamp()
              const testAnnouncementEmbedWAI = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(process.env.emojilogo + " TEST Flight Announcement! " + process.env.emojilogo)
                .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
                .setDescription('THIS IS NOT A FLIGHT, IT IS A BOT TEST.')
                .addFields(
                  { name: "When is it happening?", value: "Happening " + timeofflight + "!", inline: false },
                  { name: "Where is it going to?", value: destofflight, inline: false },
                  { name: "Aditional info:", value: "" + additionalinfo, inline: false },
                )
                .setTimestamp()
              const announcementEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(process.env.emojilogo + " Flight Announcement! " + process.env.emojilogo)
                .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
                .setDescription('This is an announcement for a flight!')
                .addFields(
                  { name: "When is it happening?", value: "Happening " + timeofflight + "!", inline: false },
                  { name: "Where is it going to?", value: destofflight, inline: false },
                )
                .setTimestamp()
              const announcementEmbedWAI = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(process.env.emojilogo + " Flight Announcement! " + process.env.emojilogo)
                .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
                .setDescription('This is an announcement for a flight!')
                .addFields(
                  { name: "When is it happening?", value: "Happening " + timeofflight + "!", inline: false },
                  { name: "Where is it going to?", value: destofflight, inline: false },
                  { name: "Aditional info:", value: "" + additionalinfo, inline: false },
                )
                .setTimestamp()
              if (additionalinfo != null) {
                if (SendTestAnnouncements) channel.send({ content: "||there is no ping, this is a test||", embeds: [testAnnouncementEmbedWAI]});
                if (!SendTestAnnouncements) channel.send({ content: "||@everyone||", embeds: [announcementEmbedWAI]});
              } else {
                if (SendTestAnnouncements) channel.send({ content: "||there is no ping, this is a test||", embeds: [testAnnouncementEmbed]});
                if (!SendTestAnnouncements) channel.send({ content: "||@everyone||", embeds: [announcementEmbed]});
              }
              
            }
          })
        })
        interaction.message.edit(
          {
            content: "This `.flight announce` command has been used. Please post `.flight announce` in `Jet2 Communications Server` or `here, in DMs` to announce another flight.",
            components: [],
            embeds: []
          }
          )
        interaction.deferUpdate()
      break;
    }
  }
  if (interaction.isModalSubmit()) {
    if (interaction.customId == "iquiryset") {
      const catergory = '1039252815643693106'
      const title = interaction.fields.getTextInputValue('inquirytitle')
      const desc = interaction.fields.getTextInputValue('inquirydesc')
      interaction.guild.channels.create({
        type: ChannelType.GuildText,
        name: title,
        parent: catergory,
      }) .then((channel) => {
        channel.permissionOverwrites.create(interaction.user, {
          ViewChannel: true,
          ReadMessageHistory: true,
          SendMessages: true,
          UseApplicationCommands: true,
        }) .then(() => {
          const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            .setDescription(`**This is a ticket by ${interaction.user.username}**

            ${desc}`)
            .setColor("0x000000")

            channel.send({content: "", embeds: [embed]})
          savepersonalchatid(channel.id, interaction.user.id)
        }) .catch((err) => {
          console.log(err)
        })
      })
    } else if (interaction.customId == "announceflight") {
      client.guilds.fetch("" + process.env.guildid) .then((guild) => {
        guild.channels.fetch("" + process.env.announcementchannelid) .then((channel) => {
          const destofflight = interaction.fields.getSelectMenuValue("ad")
          const timeofflight = interaction.fields.getSelectMenuValue("at")
          const additionalinfo = interaction.fields.getTextInputValue("ai")
          const testAnnouncementEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(process.env.emojilogo + " TEST Flight Announcement! " + process.env.emojilogo)
            .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
            .setDescription('THIS IS NOT A FLIGHT, IT IS A BOT TEST.')
            .addFields(
              { name: "When is it happening?", value: "Happening " + timeofflight + "!", inline: false },
              { name: "Where is it going to?", value: destofflight, inline: false },
            )
            .setTimestamp()
          const testAnnouncementEmbedWAI = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(process.env.emojilogo + " TEST Flight Announcement! " + process.env.emojilogo)
            .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
            .setDescription('THIS IS NOT A FLIGHT, IT IS A BOT TEST.')
            .addFields(
              { name: "When is it happening?", value: "Happening " + timeofflight + "!", inline: false },
              { name: "Where is it going to?", value: destofflight, inline: false },
              { name: "Aditional info:", value: "" + additionalinfo, inline: false },
            )
            .setTimestamp()
          const announcementEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(process.env.emojilogo + " Flight Announcement! " + process.env.emojilogo)
            .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
            .setDescription('This is an announcement for a flight!')
            .addFields(
              { name: "When is it happening?", value: "Happening " + timeofflight + "!", inline: false },
              { name: "Where is it going to?", value: destofflight, inline: false },
            )
            .setTimestamp()
          const announcementEmbedWAI = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(process.env.emojilogo + " Flight Announcement! " + process.env.emojilogo)
            .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
            .setDescription('This is an announcement for a flight!')
            .addFields(
              { name: "When is it happening?", value: "Happening " + timeofflight + "!", inline: false },
              { name: "Where is it going to?", value: destofflight, inline: false },
              { name: "Aditional info:", value: "" + additionalinfo, inline: false },
            )
            .setTimestamp()
          if (additionalinfo != null) {
            console.log("wai")
            if (SendTestAnnouncements) channel.send({ content: "||there is no ping, this is a test||", embeds: [testAnnouncementEmbedWAI]});
            if (!SendTestAnnouncements) channel.send({ content: "||@everyone||", embeds: [announcementEmbedWAI]});
          } else {
            if (SendTestAnnouncements) channel.send({ content: "||there is no ping, this is a test||", embeds: [testAnnouncementEmbed]});
            if (!SendTestAnnouncements) channel.send({ content: "||@everyone||", embeds: [announcementEmbed]});
          }
        })
      })
    }
    interaction.deferUpdate()
  }
  if (interaction.isCommand() || interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
})

client.on("guildMemberAdd", async function(member){
  const canvas = Canvas.createCanvas(800, 500);
    const context = canvas.getContext('2d');
    const bg = await Canvas.loadImage('./images/joinbg.PNG')
    const pfp = await Canvas.loadImage(member.displayAvatarURL({format: "png"}))
    context.fillstyle = '#FFFFFF'
    context.font = '40px arial'
    let text = "" + member.user.tag
    
    context.drawImage(bg, 0, 0, canvas.width, canvas.height)
    context.drawImage(pfp, 175, 300, 75, 75)
    context.fillText(text, 250, 350)

    const newimg = new AttachmentBuilder(await canvas.encode('png'), { name: 'join-image.png' })
    client.guilds.fetch("" + process.env.guildid) .then((guild) => {
      guild.channels.fetch("" + process.env.welcomechannelid) .then((channel) => {
        channel.send({ files: [newimg] })
        member.send("**Welcome abroad!**\n\nHello, " + member.user.tag + "! Welcome to the Jet2 Communications Server!\nHere, you'll recieve notifications on upcoming flights and get asked if we should host a flight!\nWe hope you have a good time whilst here!")
      })
    })
})

client.on("guildMemberRemove", function(member){
  client.guilds.fetch("" + process.env.guildid) .then((guild) => {
    guild.channels.fetch("" + process.env.leavingchannelid) .then((channel) => {
      channel.send("_Bye, _**" + member.user.tag + "!**_\nWe hope you had a great stay!_")
    })
  })
})

client.login(process.env.token)