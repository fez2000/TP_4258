const mongoose = require("mongoose");

const { Schema } = mongoose;

const EventSchema = new Schema(
    {
        creator_id: { type: Schema.Types.ObjectId, ref: "Voter" },
        time_create: { type: Date },
        time_update: { type: Date },
        tags: {
            type: String
        },
        language: {
            type: String,
            trim: true,
            default: "fr"
        },
        link: {
            type: String,
            trim: true
        },
        title: {
            type: String,
            trim: true,
            required: true
        },
        type: {
            type: String,
            trim: true,
            required: true,
            lowercase: true
        },
        description: {
            type: String,
            trim: true,
            required: true,
            lowercase: true
        },
        document: { type: Schema.Types.ObjectId, ref: "Doc" }
    },
    { sparse: true, unique: true, index: true }
);

mongoose.model("Event", EventSchema);
