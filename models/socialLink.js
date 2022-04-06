/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const SocialLinkSchema = new Schema(
    {
        id: { type: String, enum: ['Facebook', 'Linkedin', 'Twitter', 'Website'], required: true },
        value: { type: String }
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('SocialLink', SocialLinkSchema);
