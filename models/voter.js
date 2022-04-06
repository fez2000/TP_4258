/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const VoterSchema = new Schema(
    {
        language: { type: String, default: 'fr' },
        time_create: { type: Date },
        time_update: { type: Date },
        name: {
            type: String, trim: true, required: true, lowercase: true, minlength: process.env.NAME_MIN_LENGTH,
        },
        password: { type: String },
        email: { type: String, required: true, unique: true },
        short_bio: { type: String },
        bio: { type: String },
        bio_html: { type: String, trim: true, default: '' },
        code: { type: String },
        token: { type: String },
        image: { type: Schema.Types.ObjectId, ref: 'Doc' },
        location: { type: String, default: '' },
        state: { type: String, enum: ['public', 'private'], default: 'public' },
        token_validity: { type: Date },
        isVerify: { type: Boolean, default: false },
        type: { type: String, enum: ['ADMIN', 'SUPERUSER', 'VOTER'], default: 'VOTER' },
        url: { type: String },
        roleLevel: { type: Number, enum: [1, 2, 3], default: 3 },
        mailNotificationPermission: { type: Boolean, default: true },
        socials: [
            { type: Schema.Types.ObjectId, ref: 'SocialLink' },
        ],
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('Voter', VoterSchema);
