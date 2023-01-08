const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const talkedRecently = new Set();
const commandDelay = 1 //seconds 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buys a certain item from /shop')
    .addStringOption(option =>
      option
        .setName('item')
        .setDescription('The item to purchase')
        .setRequired(true)
        .addChoices(
          { name: 'Exotic role', value: 'exotic' },
        )
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
    ,
	async execute(interaction, client) {
    const xpSchema = require('../gainxp.js')
    async function availableTB(cost) { //available to buy
      const findRes = await xpSchema.find({ userId: interaction.user.id, guildId: interaction.guild.id })
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

    let guildId = interaction.guild.id
    let userId = interaction.user.id
    
    let item = interaction.options.getString("item")

    if (item == "exotic") {
      let status = await availableTB(25)
      if (status == 0) {
        //buy
        if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.some(role => role.id === '1021523901500624946')) {
          //owns
          interaction.reply({content: "You already own this item!", ephemeral: true})
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
            let role = interaction.guild.roles.cache.find(r => r.id === "1021523901500624946");
            interaction.guild.members.cache.get(interaction.user.id).roles.add(role)
            interaction.reply({content:"Successfully purchased Exotic Role!", ephemeral: true})
          } catch(e) {
            console.log(e)
          }
        }
      } else if (status == 1) {
        //not enough coins
        interaction.reply({content: "You do not have enough Jet2 Points to purchase Exotic Role.", ephemeral:true})
      } else if (status == 2) {
        //error
        interaction.reply({content: "An error occured while doing the command. No change has occured.", ephemeral:true })
      } else {
        interaction.reply({content: "An error occured while checking the transaction. No change has occured.", ephemeral: true})
      }
    }
	}
};