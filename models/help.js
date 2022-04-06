const mongoose = require('mongoose');

const { Schema } = mongoose;

const HelpSchema = new Schema(
    {
        time_create: { type: Date },
        time_update: { type: Date },
        data: {
            type: String, trim: true, required: true,
        },
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('Help', HelpSchema);