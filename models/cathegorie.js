const mongoose = require('mongoose');

const { Schema } = mongoose;

const CathegorieSchema = new Schema(
    {
        time_create: { type: Date },
        time_update: { type: Date },
        name: {
            type: String, trim: true, required: true, lowercase: true, minlength: process.env.NAME_MIN_LENGTH,
        },
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('Cathegorie', CathegorieSchema);
