const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProjectSchema = new Schema(
    {
        time_create: { type: Date },
        time_update: { type: Date },
        code: { type: String },
        url: { type: String, required: true },
        name: { type: String, required: true, maxlength: process.env.PROJECT_NAME_MAX_LENGTH },
        description: { type: String, maxlength: process.env.PROJECT_DESCRIPTION_MAX_LENGTH },
        description_html: { type: String, trim: true },
        pourcentage: {
            type: Number, default: 0, min: 0, max: 100,
        },
        cathegories: [{ type: Schema.Types.ObjectId, ref: 'Cathegorie' }],
        short_description: { type: String, required: true, maxlength: process.env.PROJECT_SHORT_DESCRIPTION_MAX_LENGTH },
        image: { type: Schema.Types.ObjectId, ref: 'Doc' },
        state: { type: String, enum: ['new', 'toBeValidate', 'submited', 'refused', 'accepted', 'voted', 'start', 'end'], default: 'new' },
        isPublic: { type: Boolean, default: false },
        docs: [{ type: Schema.Types.ObjectId, ref: 'Doc' }],
        voter: { type: Schema.Types.ObjectId, ref: 'Voter' },
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('Project', ProjectSchema);
