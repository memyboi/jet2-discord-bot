const mongoose = require('mongoose')

const rString = {
  type: String,
  required: true
}

const schema = new mongoose.Schema({
  guildId: rString,
  userId: rString,
  xp: {
    type: Number,
    default: 0,
  },
  coins: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  }
})
module.exports = mongoose.model('xptesting2', schema, 'xptesting2')
