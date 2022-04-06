const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema(
    {
        time_create: { type: Date },
        time_update: { type: Date },
        content: {
            type: String,
            trim: true,
            required: true
        },
        author: { type: Schema.Types.ObjectId, ref: 'Voter' },
        post: { type: Schema.Types.ObjectId, ref: 'EventPost' },
        event: { type: Schema.Types.ObjectId, ref: 'Event' },
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('Comment', CommentSchema);