const { SlashCommandBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ghostping')
		.setDescription('Attempts to ghostping a user in the current channel. Could be used to ping people for events.')
    .addSubcommand(subcommand => 
      subcommand
        .setName("everyone")
        .setDescription("Ghostpings @everyone")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MentionEveryone && PermissionsBitField.Flags.ManageEvents)
    )
    .addSubcommand(subcommand => 
      subcommand
        .setName("user")
        .setDescription("Ghostpings a user you specify.")
        .addUserOption(option =>
          option
            .setName("target")
            .setDescription("The specific user you would like to ghostping")
        )
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    ,
	async execute(interaction, client) {
    if (interaction.options.getSubcommand() == "everyone") {
      interaction.channel.send({content: "@everyone"}) .then(msg => {
        msg.Delete()
      }) .catch(e => {
        console.log(e)
        interaction.deferReply({content: "There was an error while creating a ghostping.", ephemeral: true})
      })
    } else if (interaction.options.getSubcommand("user")) {
      const target = interaction.options.getUser("target")
      interaction.channel.send({content: "<@"+target.id+">"}) .then(msg => {
        msg.Delete()
      }) .catch(e => {
        console.log(e)
        interaction.deferReply({content: "There was an error while creating a ghostping.", ephemeral: true})
      })
    }
	} 
};