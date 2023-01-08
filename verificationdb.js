const mongoose = require('mongoose')

const rString = {
  type: String,
  required: true
}

const schema = new mongoose.Schema({
  guildId: rString,
  userId: rString,
  vc: {
    type: rString,
    default: "",
  },
  vts: { //verification Timestamp
    type: Number,
    default: 0
  },
  rbxuserId: { //verification Timestamp
    type: rString,
    default: "0"
  }
})
module.exports = mongoose.model('verification', schema, 'verification')
