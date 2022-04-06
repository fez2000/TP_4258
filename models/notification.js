const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationSchema = new Schema(
    {
        time_create: { type: Date },
        time_update: { type: Date },
        url: {
            type: String, trim: true,
        },
        read: {
            type: Boolean, default: false,
        },
        target: { type: Schema.Types.ObjectId, required: true, ref: 'Voter' },
        type: { type: String, default: '' },
        voter: {
            type: Schema.Types.ObjectId, ref: 'Voter',
        },
        project: {
            type: Schema.Types.ObjectId, ref: 'Project',
        },
        event: {
            type: Schema.Types.ObjectId, ref: 'Event',
        },
        poll: {
            type: Schema.Types.ObjectId, ref: 'Poll',
        },
        like: {
            type: Schema.Types.ObjectId, ref: 'Like',
        },
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('Notification', NotificationSchema);
