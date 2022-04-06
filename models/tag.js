const mongoose = require("mongoose");

const { Schema } = mongoose;

const TagSchema = new Schema(
    {
        name: { type: String, trim: true, lowercase: true },
        frequence: { type: Number, default: 1 }
    },
    { sparse: true, unique: true, index: true }
);

mongoose.model("Tag", TagSchema);
