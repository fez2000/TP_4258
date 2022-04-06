const mongoose = require("mongoose");

const { Schema } = mongoose;

const SubscriptionSchema = new Schema(
    {
        endpoint: { type: String },
        auth: { type: String },
        p256dh: { type: String },
        target: { type: Schema.Types.ObjectId, ref: "Voter" }
    },
    { sparse: true, unique: true, index: true }
);

mongoose.model("Subscription", SubscriptionSchema);
