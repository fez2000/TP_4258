const mongoose = require('mongoose');

const { Schema } = mongoose;

const DocSchema = new Schema(
    {
        time_create: { type: Date, default (){ return new Date()} },
        time_update: { type: Date,  default: function (){ return new Date()} },
        name: {
            type: String, trim: true, required: true, lowercase: true,
        },
        src: {
            type: String, trim: true, required: true,
        },
        type: {
            type: String, trim: true, required: true, lowercase: true,
        },
        cathegorie: {
            type: String, required: true, lowercase: true, enum: ["image", "voix", "link", "audio", "video", "pdf", "zip", "application" ]
        },
        voter: { type: Schema.Types.ObjectId, ref: 'Voter' },
        state: { type: String, enum: ['public', 'private'], default: 'public' },
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('Doc', DocSchema);
