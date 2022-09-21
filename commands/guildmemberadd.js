const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, AttachmentBuilder } = require('discord.js')
const Canvas = require('@napi-rs/canvas');
const talkedRecently = new Set();
const commandDelay = 2.5 //seconds 

module.exports = {
  name: 'guildmemberadd',
  description: 'Force the join image you get when joining the server',
  async execute(member, client){
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
  }
}