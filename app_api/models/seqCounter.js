const { Schema, model } = require("mongoose");

const seqCounter = new Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
  },
});

seqCounter.statics = {
  async increment(seqName) {
    const count = await this.findByIdAndUpdate(
      seqName,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return count.seq;
  },
};

module.exports = model("seqCounter", seqCounter);
