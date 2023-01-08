const { SlashCommandBuilder, PermissionsBitField, ButtonStyle, ButtonBuilder, ButtonComponent, ActionRowBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('insert')
		.setDescription('Attempts to ghostping a user in the current channel. Could be used to ping people for events.')
    .addSubcommand(subcommand => 
      subcommand
        .setName("button")
        .setDescription("Inserts a button with a certain label, style and id.")
        .addStringOption(option =>
          option
            .setName("label")
            .setDescription("The label that the button will have.")
            .setRequired(true)
          )
          .addStringOption(option =>
            option
              .setName("id")
              .setDescription("The id that the button will have.")
              .setRequired(true)
            )
            .addStringOption(option =>
              option
                .setName("style")
                .setDescription("The style that the button will have.")
                .setRequired(true)
                .addChoices(
                  { name: 'Primary', value: 'Primary'},
                  { name: 'Secondary', value: 'Secondary'},
                  { name: 'Danger', value: 'Danger'},
                  { name: 'Success', value: 'Success'},
                  { name: 'Link', value: 'Link'},
                )
              )
              .addStringOption(option =>
                option
                  .setName("content")
                  .setDescription("The content of the main message")
                  .setRequired(true)
                )
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    ,
	async execute(interaction, client) {
    if (interaction.options.getSubcommand() == "button") {
      let content = interaction.options.getString("content")
      let style = interaction.options.getString("style")
      let id = interaction.options.getString("id")
      let label = interaction.options.getString("label")

      switch(style) {
        case "Primary":
          style = ButtonStyle.Primary
        break;
        case "Secondary":
          style = ButtonStyle.Secondary
        break;
        case "Danger":
          style = ButtonStyle.Danger
        break;
        case "Success":
          style = ButtonStyle.Success
        break;
        case "Link":
          style = ButtonStyle.Link
        break;
      }

      const button = new ButtonBuilder()
          .setCustomId(id)
          .setLabel(label)
          .setStyle(style)

      const row = new ActionRowBuilder().addComponents(button);
      interaction.channel.send({content: content, components: [
        row
      ]})
    }
	} 
};