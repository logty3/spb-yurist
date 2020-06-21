const { Schema, model } = require("mongoose");
const SeqCounter = require("./seqCounter");

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    reviewId: { type: Number },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (this.isNew) {
    const reviewId = await SeqCounter.increment("reviewsId");
    this.reviewId = reviewId;
  }
  next();
});

schema.set("toJSON", {
  virtuals: true,
});

module.exports = model("Reviews", schema);
