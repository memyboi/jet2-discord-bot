const { EmbedBuilder, PermissionsBitField } = require('discord.js')
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

const changebyoperator = async (opr, num) => {
  if (opr == "+") {
    return num
  }
  if (opr == "-") {
    return num * -1
  }
}

const { EmbedBuilder } = require('discord.js')

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changestats')
		.setDescription('Changes the stats of a certain user in a certain way..')
    .addUserOption(option => 
      option
        .setName("target")
        .setDescription("The target that the stat changes should occur to.")
        .setRequired(true)
      )
    .addStringOption(option =>
      option
        .setName("stat")
        .setDescription("The stat to change.")
        .addChoices(
          { name: 'Jet2Points', value: 'points' },
          { name: 'Experience', value: 'xp' },
          { name: 'Levels', value: 'lvls' },
        )
        .setRequired(true)
      )
    .addStringOption(option =>
      option
        .setName("operator")
        .setDescription("The operator to change a stat by. Can be +, -, * or /")
        .addChoices(
          { name: '+ (Addition)', value: '+' },
          { name: '- (Subtraction)', value: '-' },
        )
        .setRequired(true)
      )
    .addIntegerOption(option => 
      option
        .setName("amount")
        .setDescription("The amount to change the stat by. Dependant on operator.")
        .setRequired(true)
      )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    ,
	async execute(interaction, client) {
    const amnt = interaction.options.getInteger("amount")
    const operator = interaction.options.getString("operator")
    const stat = interaction.options.getString("stat")
    const user = interaction.options.getUser("target")
    const realamnt = changebyoperator(operator, amnt)
    if (stat == "points") {
      addCoins(interaction.guild.id, user.id, realamnt)
      if (operator == "+") {
        interaction.reply({content: "The user "+user.username+" has been granted "+realamnt+" points.", ephemeral: true})
      } else {
        interaction.reply({content: "The user "+user.username+" has "+realamnt*-1+" been removed from their points.", ephemeral: true})
      }
    } else if (stat == "xp") {
      addXP(interaction.guild.id, user.id, realamnt)
      if (operator == "+") {
        interaction.reply({content: "The user "+user.username+" has been granted "+realamnt+" XP.", ephemeral: true})
      } else {
        interaction.reply({content: "The user "+user.username+" has "+realamnt*-1+" been removed from their XP.", ephemeral: true})
      }
    } else if (stat == "lvls") {
      addLevelCmd(interaction.guild.id, user.id, realamnt)
      if (operator == "+") {
        interaction.reply({content: "The user "+user.username+" has been granted "+realamnt+" Levels.", ephemeral: true})
      } else {
        interaction.reply({content: "The user "+user.username+" has "+realamnt*-1+" been removed from their Levels.", ephemeral: true})
      }
    }
	} 
};