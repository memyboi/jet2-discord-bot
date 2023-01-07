const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js')
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
    return "went good :)"
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
    return "went good :)"
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
    return "went good :)"
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
          { name: 'LexunPoints', value: 'points' },
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
    const xpSchema = require('../gainxp.js')
    const amnt = interaction.options.getInteger("amount")
    const operator = interaction.options.getString("operator")
    const stat = interaction.options.getString("stat")
    const user = interaction.options.getUser("target")
    changebyoperator(operator, amnt) .then(realamnt => {
      if (stat == "points") {
        addCoins(interaction.guild.id, user.id, realamnt, xpSchema) .then(how => {
          if (operator == "+") {
            interaction.reply({content: "The user "+user.username+" has been granted "+realamnt+" Lexun points.", ephemeral: true})
          } else {
            interaction.reply({content: "The user "+user.username+" has lost "+realamnt*-1+" of their Lexun points.", ephemeral: true})
          }
        }) .catch((e) => {
          interaction.reply({content: "There was an error while changing this user's stats. Try again later.", ephemeral: true})
        })
      } else if (stat == "xp") {
        addXP(interaction.guild.id, user.id, realamnt, xpSchema) .then(how => {
          if (operator == "+") {
            interaction.reply({content: "The user "+user.username+" has been granted "+realamnt+" Experience.", ephemeral: true})
          } else {
            interaction.reply({content: "The user "+user.username+" has lost "+realamnt*-1+" of their Experience.", ephemeral: true})
          }
        }) .catch((e) => {
          interaction.reply({content: "There was an error while changing this user's stats. Try again later.", ephemeral: true})
        })
      } else if (stat == "lvls") {
        addLevelCmd(interaction.guild.id, user.id, realamnt, xpSchema) .then(how => {
          if (operator == "+") {
            interaction.reply({content: "The user "+user.username+" has been granted "+realamnt+" levels.", ephemeral: true})
          } else {
            interaction.reply({content: "The user "+user.username+" has lost "+realamnt*-1+" of their levels.", ephemeral: true})
          }
        }) .catch((e) => {
          interaction.reply({content: "There was an error while changing this user's stats. Try again later.", ephemeral: true})
        })
      }
    })
	} 
};