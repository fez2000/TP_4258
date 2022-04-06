/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const PollOptionSchema = new Schema({
    
    time_create: { type: Date, default: new Date() },
    time_update: { type: Date },
    votes: { type: Number, default: 0 },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    text: { type: String },
}, { sparse: true, unique: true, index: true });

mongoose.model('PollOption', PollOptionSchema);
