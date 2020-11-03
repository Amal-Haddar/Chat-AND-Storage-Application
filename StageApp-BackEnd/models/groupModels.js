const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  creatorname: { type: String, default: "" },
  groupname: { type: String, default: "" },
  description: { type: String},
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: { type: String, default: "" },
      picVersion: { type: String, default:'1602591277'},
      picId: { type: String, default:"default-men_l2to0e.png"},
      createdAt: { type: Date, default: Date.now() },
    },
  ],
  created: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Group", groupSchema);
