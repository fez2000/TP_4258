/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const VoteSchema = new Schema(
    {
        time_create: { type: Date },
        time_update: { type: Date },
        code: { type: String },
        poll_id: { type: Schema.Types.ObjectId, ref: 'Poll' },
        voter_id: { type: Schema.Types.ObjectId, ref: 'Voter' },
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('Vote', VoteSchema);
