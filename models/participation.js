/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const ParticipationSchema = new Schema({
    time_create: { type: Date },
    time_update: { type: Date },
    code: { type: String },
    poll_id: { type: Schema.Types.ObjectId },
    voter_id: { type: Schema.Types.ObjectId },
}, { sparse: true, unique: true, index: true });

mongoose.model('Participation', ParticipationSchema);
