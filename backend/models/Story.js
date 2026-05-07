const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, default: "" },
    points: { type: Number, default: 0 },
    author: { type: String, default: "unknown" },
    postedAt: { type: String, default: "" },
    hnId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
