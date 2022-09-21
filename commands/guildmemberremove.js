const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, AttachmentBuilder } = require('discord.js')
const Canvas = require('@napi-rs/canvas');
const talkedRecently = new Set();
const commandDelay = 2.5 //seconds 

module.exports = {
  name: 'guildmemberremove',
  description: 'Force the join image you get when joining the server',
  async execute(member, client){
    client.guilds.fetch("" + process.env.guildid) .then((guild) => {
      guild.channels.fetch("" + process.env.leavingchannelid) .then((channel) => {
        channel.send("_Bye, _**" + member.user.tag + "!**_\nWe hope you had a great stay!_")
      })
    })
  }
}