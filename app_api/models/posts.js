const { Schema, model } = require("mongoose");
const SeqCounter = require("./seqCounter");

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    postId: { type: Number },
    visitors: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (this.isNew) {
    const postId = await SeqCounter.increment("postsId");
    this.postId = postId;
  }
  next();
});

schema.set("toJSON", {
  virtuals: true,
});

module.exports = model("Posts", schema);
