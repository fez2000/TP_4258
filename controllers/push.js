const webPush = require("web-push");
const mongoose = require("mongoose");

const Subscription = mongoose.model("Subscription");
webPush.setGCMAPIKey(process.env.GCM_API_KEY);
webPush.setVapidDetails(
    process.env.BASE_URL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);
exports.getVapidKey = function(req, res) {
    res.send(process.env.VAPID_PUBLIC_KEY);
};
exports.register = function(req, res) {
    if (!req.body.keys) return res.send({ status: false });
    Subscription.findOne({
        endpoint: req.body.endpoint,
        p256dh: req.body.keys.p256dh,
        auth: req.body.keys.auth
    }).exec((err, sub) => {
        if (sub) {
            if (!sub.target && typeof req.session.auth !== "undefined") {
                Subscription.updateOne(
                    {
                        endpoint: req.body.endpoint,
                        p256dh: req.body.keys.p256dh,
                        auth: req.body.keys.auth
                    },
                    { target: req.body.auth._id }
                );
            }
            return res.send({ status: true });
        }
        if (typeof req.session.auth === "undefined") {
            Subscription.create({
                endpoint: req.body.endpoint,
                p256dh: req.body.keys.p256dh,
                auth: req.body.keys.auth
            })
                .then(() => {
                    res.send({ status: true });
                })
                .catch(() => {
                    res.send({ status: false });
                });
        } else {
            Subscription.create({
                endpoint: req.body.endpoint,
                p256dh: req.body.keys.p256dh,
                auth: req.body.keys.auth,
                target: req.body.auth._id
            })
                .then(() => {
                    res.send({ status: true });
                })
                .catch(() => {
                    res.send({ status: false });
                });
        }
    });
};
exports.send = function(req, res) {
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthErr" });
    }

    const subscription = req.body.subscription;

    const payload = null;
    const options = {
        TTL: req.body.ttl
    };

    setTimeout(function() {
        webPush
            .sendNotification(subscription, payload, options)
            .then(function() {
                res.sendStatus(201);
            })
            .catch(function(error) {
                res.sendStatus(500);
                console.log(error);
            });
    }, req.body.delay * 1000);
};
