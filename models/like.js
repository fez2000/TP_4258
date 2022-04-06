/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const LikeSchema = new Schema({
    target_id: { type: Schema.Types.ObjectId, required: true, unique: true },
    type: { type: String, required: true, enum: ['voter', 'project', 'event', 'vote'] },
    voters: [{ type: Schema.Types.ObjectId, ref: 'Voter' }],
}, { sparse: true, unique: true, index: true });

mongoose.model('Like', LikeSchema);
