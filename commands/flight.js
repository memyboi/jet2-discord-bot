const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionsBitField, TextInputStyle, TextInputComponent, ModalBuilder, TextInputBuilder } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 1 //seconds 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flight')
        .setDescription('Has 2 commands. Announce and Ask.')
        .addSubcommand(subcommand =>
            subcommand
                .setName("announce")
                .setDescription("Announce a flight with details.")
                .addStringOption(option =>
                    option
                        .setName("timeframe")
                        .setDescription("The time at which the flight should take place.")
                        .setRequired(true)
                        .addChoices(
                            { name: 'now', value: 'now! Join up! (link in <#1007959104611946547>)' },
                            { name: '5m', value: 'in 5 minutes' },
                            { name: '10m', value: 'in 10 minutes' },
                            { name: '15m', value: 'in 15 minutes' },
                            { name: '20m', value: 'in 20 minutes' },
                            { name: '25m', value: 'in 25 minutes' },
                            { name: '30m', value: 'in 30 minutes' },
                            { name: '35m', value: 'in 35 minutes' },
                            { name: '40m', value: 'in 40 minutes' },
                            { name: '45m', value: 'in 45 minutes' },
                            { name: '50m', value: 'in 50 minutes' },
                            { name: '55m', value: 'in 55 minutes' },
                            { name: '1h', value: 'in 1 hour' },
                            { name: '1h15m', value: 'in 1 hour and 15 minutes' },
                            { name: '1h30m', value: 'in 1 hour and 30 minutes' },
                            { name: '1h45m', value: 'in 1 hour and 45 minutes' },
                            { name: '2h', value: 'in 2 hours' },
                            { name: '2h15m', value: 'in 2 hours and 15 minutes' },
                            { name: '2h30m', value: 'in 2 hours and 30 minutes' },
                            { name: '2h45m', value: 'in 2 hours and 45 minutes' },
                            { name: '3h', value: 'in 3 hours' },
                            { name: '4h', value: 'in 4 hours' },
                            { name: '5h', value: 'in 5 hours' },
                            { name: '6h', value: 'in 6 hours' },
                            { name: 'tomorrow', value: 'tommorow! (in 24 hours)' },
                        )
                )
                .addStringOption(option =>
                    option
                        .setName("destination")
                        .setDescription("The destination that the flight will fly to.")
                        .setRequired(true)
                        .addChoices(
                            { name: 'robloxia-town', value: 'Robloxia Town' },
                            { name: 'cloud-city', value: 'Cloud City' },
                            { name: 'unknown', value: 'N/A' },
                        )
                )
                .addStringOption(option => 
                    option
                        .setName("additional-info")
                        .setDescription("Any additional info you would like to add on.")
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("ask")
                .setDescription("Ask if we should host a flight. You will be able to add any additional info.")
                .addStringOption(option => 
                    option
                        .setName("additional-info")
                        .setDescription("This is if you have any additional info you would like to add to the ask.")
                )
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MentionEveryone && PermissionsBitField.Flags.ManageEvents)
    ,
    async execute(interaction, client) {
        if (interaction.options.getSubcommand() == "announce") {
            const ai = interaction.options.getString("additional-info")
            const t = interaction.options.getString("timeframe")
            const d = interaction.options.getString("destination")

            interaction.guild.channels.fetch("" + process.env.announcementchannelid) .then((channel) => {
                const announcementEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle(process.env.emojilogo + " Flight Announcement! " + process.env.emojilogo)
                    .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
                    .setDescription('This is an announcement for a flight!')
                    .addFields(
                    { name: "When is it happening?", value: "Happening " + t + "!", inline: false },
                    { name: "Where is it going to?", value: d, inline: false },
                    )
                    .setTimestamp()
                const announcementEmbedWAI = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle(process.env.emojilogo + " Flight Announcement! " + process.env.emojilogo)
                    .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
                    .setDescription('This is an announcement for a flight!')
                    .addFields(
                    { name: "When is it happening?", value: "Happening " + t + "!", inline: false },
                    { name: "Where is it going to?", value: d, inline: false },
                    { name: "Aditional info:", value: "" + ai, inline: false },
                    )
                    .setTimestamp()
                if (ai != null || ai != "") {
                    channel.send({ content: "||@everyone||", embeds: [announcementEmbedWAI]});
                } else {
                    channel.send({ content: "||@everyone||", embeds: [announcementEmbed]});
                }
            })
            interaction.deferReply({content: "The announcement embed has been sent.", ephemeral: true})
        } else if (interaction.options.getSubcommand() == "ask") {
            interaction.guild.channels.fetch("" + process.env.announcementchannelid).then((channel) => {
                const additionalinfo = interaction.options.getString("additional-info")
                const announcementEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle(process.env.emojilogo + " Should we do a flight? " + process.env.emojilogo)
                    .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}` })
                    .setDescription('Please vote with a ✅ or a ❎ if we should fly!')
                    .setTimestamp()

                if (additionalinfo != null || additionalinfo != "") {
                    const announcementEmbedAI = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle(process.env.emojilogo + " Should we do a flight? " + process.env.emojilogo)
                        .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}` })
                        .setDescription('Please vote with a ✅ or a ❎ if we should fly!')
                        .setTimestamp()
                        .addFields({name: "Additional info", value: ""+additionalinfo, inline: true})
                    channel.send({ content: "||@everyone||", embeds: [announcementEmbedAI] }).then((msg) => {
                        msg.react('✅')
                        msg.react('❎')
                    })
                } else {
                    channel.send({ content: "||@everyone||", embeds: [announcementEmbed] }).then((msg) => {
                        msg.react('✅')
                        msg.react('❎')
                    })
                }
            })
            interaction.deferReply({content: "The ask embed has been sent.", ephemeral: true})
        }
    }
};