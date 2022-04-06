const mongoose = require('mongoose');

const { Schema } = mongoose;

const InfoSchema = new Schema(
    {
        time_create: { type: Date },
        time_update: { type: Date },
        title: {
            type: String, trim: true, required: true, maxlength: 150,
        },
        content: {
            type: String, trim: true, required: true,
        },
        hidden: {
            type: Boolean, default: false
        }
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('Info', InfoSchema);