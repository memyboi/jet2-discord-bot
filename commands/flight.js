const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionsBitField, TextInputStyle, TextInputComponent, ModalBuilder } = require('discord.js')
const talkedRecently = new Set();
const commandDelay = 1 //seconds 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flight')
        .setDescription('Has 2 commands. Announce and Ask.')
        .addSubcommand(subcommand =>
            subcommand
                .setName("announce")
                .setDescription("Announce a flight.")
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
        if (interaction.options.getSubCommand() == "announce") {
            const modal = new ModalBuilder()
                .setCustomId('announceflight')
                .setTitle('Create a flight announcement...');
            const row = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('at')
                        .setPlaceholder('No timeframe selected')
                        .addOptions(
                            {
                                label: 'Now',
                                value: '00now! Join up! (link in <#1007959104611946547>)',
                            },
                            {
                                label: '5 minutes',
                                value: '01in 5 minutes',
                            },
                            {
                                label: '10 minutes',
                                value: '02in 10 minutes',
                            },
                            {
                                label: '15 minutes',
                                value: '03in 15 minutes',
                            },
                            {
                                label: '20 minutes',
                                value: '04in 20 minutes',
                            },
                            {
                                label: '25 minutes',
                                value: '05in 25 minutes',
                            },
                            {
                                label: '30 minutes',
                                value: '06in 30 minutes',
                            },
                            {
                                label: '35 minutes',
                                value: '07in 35 minutes',
                            },
                            {
                                label: '40 minutes',
                                value: '08in 40 minutes',
                            },
                            {
                                label: '45 minutes',
                                value: '09in 45 minutes',
                            },
                            {
                                label: '50 minutes',
                                value: '10in 50 minutes',
                            },
                            {
                                label: '55 minutes',
                                value: '11in 55 minutes',
                            },
                            {
                                label: '1 hour',
                                value: '12in 1 hour',
                            },
                            {
                                label: '1 hour and 15 minutes',
                                value: '13in 1 hour and 15 minutes',
                            },
                            {
                                label: '1 hour and 30 minutes',
                                value: '14in 1 hour and 30 minutes',
                            },
                            {
                                label: '1 hour and 45 minutes',
                                value: '15in 1 hour and 45 minutes',
                            },
                            {
                                label: '2 hours',
                                value: '16in 2 hours',
                            },
                            {
                                label: '2 hours and 15 minutes',
                                value: '17in 2 hours and 15 minutes',
                            },
                            {
                                label: '2 hours and 30 minutes',
                                value: '18in 2 hours and 30 minutes',
                            },
                            {
                                label: '2 hours and 45 minutes',
                                value: '19in 2 hours and 45 minutes',
                            },
                            {
                                label: '3 hours',
                                value: '20in 3 hours',
                            },
                            {
                                label: '4 hours',
                                value: '21in 4 hours',
                            },
                            {
                                label: '5 hours',
                                value: '22in 5 hours',
                            },
                            {
                                label: '6 hours',
                                value: '23in 6 hours',
                            },
                            {
                                label: 'Tomorrow (24 hours)',
                                value: '24tommorow (24 hours)',
                            },
                        ),
                );
            const row2 = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('ad')
                        .setPlaceholder('No destination selected')
                        .addOptions(
                            {
                                label: 'N/A',
                                value: '00N/A',
                            },
                            {
                                label: 'Robloxia Town',
                                value: '01Robloxia Town',
                            },
                        ),
                );

            const row3 = new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('ai')
                        .setLabel("Additional info")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMaxLength(1000)
                        .setRequired(false),
                )

            modal.addComponents(row, row2, row3)

            await interaction.showModal(modal);
        } else if (interaction.options.getSubCommand() == "ask") {
            guild.channels.fetch("" + process.env.announcementchannelid).then((channel) => {
                const additionalinfo = interaction.option.getString("additonal-info")
                const announcementEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle(process.env.emojilogo + " Should we do a flight? " + process.env.emojilogo)
                    .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}` })
                    .setDescription('Please vote with a ✅ or a ❎ if we should fly!')
                    .setTimestamp()

                if (additionalinfo != null) {
                    announcementEmbed.addFields({name: "Additional info", value: additionalinfo, inline: true})
                    channel.send({ content: "||@everyone||", embeds: [announcementEmbed] }).then((msg) => {
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
        }
    }
};