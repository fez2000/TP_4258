/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const PollSchema = new Schema(
    {
        creator_id: { type: Schema.Types.ObjectId },
        code: { type: String },
        status: { type: String, enum: ['wait', 'inprocess', 'close'], required: true },
        visibility: { type: String, enum: ['All', 'ONLYMEMBER'], default: 'ONLYMEMBER' },
        mode: { type: Number, enum: [1, 2], default: 1 },
        question: { type: String, required: true },
        expiration: { type: Date, required: true },
        start: { type: Date, default: new Date() },
        time_create: { type: Date },
        time_update: { type: Date },
        options: [{ type: Schema.Types.ObjectId, ref: 'PollOption' }],
        votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('Poll', PollSchema);
