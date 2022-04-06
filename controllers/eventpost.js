/* eslint-disable consistent-return */
/* eslint-disable operator-assignment */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
const mongoose = require("mongoose");

const EventPost = mongoose.model("EventPost");

const { get, getDynamic } = require("./socketmanage");
const io = getDynamic();
exports.findAll = (req, res) => {
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthErr" });
    }
    EventPost.find({})
        .populate({
            path: "document",
            select: "type name src _id cathegorie"
        })
        .sort({ time_create: -1 })
        // .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log("localhost:3000->db error 504");
            }
            console.log("localhost:3000->get eventPosts 200ok");
            return res.send(results);
        });
};
exports.findAllStartAt = (req, res) => {
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthError" });
    }
    EventPost.find({})
        .populate({
            path: "document",
            select: "type name src _id cathegorie"
        })
        .sort({ time_create: -1 })
        .exec((err, results) => {
            if (err) {
                console.log("localhost:3000->db error 504");
                return res.send({ status: null, errors: err });
            }
            if (!results) {
                res.send({ status: true, notifications: [], continue: false });
            }
            let i = -1;
            let j = 0;
            for (const notif of results) {
                if (notif._id == req.params.id) {
                    i = j;
                    break;
                }
                j++;
            }
            if (i < 0) {
                res.send({ status: false, errors: "Not Found" });
            }
            req.session.currentNotif = i;
            if (results.length > i + 15) {
                req.session.currentNotif = i + 15;
                return res.send({
                    status: true,
                    notifications: results.slice(i, i + 15),
                    continue: true
                });
            }
            console.log("localhost:3000->get users 200ok");
            return res.send({
                status: true,
                notifications: results.slice(i, results.length),
                continue: false
            });
        });
};
exports.updateEventPost = (req, res) => {
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthError" });
    }
   
    if (!req.body.title || !req.body.text) {
        return res.send({ status: false, errors: "RequiredFields" });
    }
    EventPost.findByIdAndUpdate(req.body._id, {
        time_update: new Date(),
        title: req.body.title,
        description: req.body.text,
        tags: req.body.tags
    })
        .populate({
            path: "document",
            select: "type name src _id cathegorie"
        })
        .exec((err, eventPost) => {
            if (err) {
                return res.send({ status: false, errors: err });
            }
            const post = eventPost.toJSON();
            post.document = req.body.document;
            res.send({ status: true, post });
            io.emit("updatedEventPost", post);
        });
};
exports.deleteEventPost = (req, res) => {
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthError" });
    }
    let find = {
        _id: req.params.id
    };
    
    if (!(req.session.auth.type === "SUPERUSER")) {
        find.creator_id = req.session.auth._id;
    }

    EventPost.findOneAndDelete(find)
        .populate({
            path: "document",
            select: "type name src _id cathegorie"
        })
        .exec((err, post) => {
            if (err) {
                return res.send({ status: false, errors: err });
            }
            if (!post) {
                return res.send({ status: false, errors: "NotFound" });
            }

            res.send({ status: true, post });
            setTimeout(() => {
                io.emit("deletedEvent1", post);
            }, 150);
        });
};
exports.postEventPost = (req, res) => {
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthError" });
    }
    
    if (!req.body.title || !req.body.text) {
        return res.send({ status: false, errors: "RequiredFields" });
    }
    let date = new Date();
    let s = {
        creator_id: new mongoose.Types.ObjectId(req.session.auth._id),
        time_create: date,
        time_update: date,
        title: req.body.title,
        description: req.body.text,
        tags: req.body.tags,
        language: req.session.auth.language,
        type: "post"
    };

    if (req.body.document) {
        s.document = new mongoose.Types.ObjectId(req.body.document._id);
    }

    EventPost.create(s)
        .then(eventPost => {
            const post = eventPost.toJSON();
            post.document = req.body.document;
            res.send({ status: true, post });
            setTimeout(() => {
                io.emit("newEvent1", post);
            }, 150);
        })
        .catch(err2 => {
            res.send({ status: false, errors: err2 });
        });
};
exports.findAllStart = (req, res) => {
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthError" });
    }
    EventPost.find({})
        .populate({
            path: "document",
            select: "type name src  cathegorie"
        })
        .sort({ time_create: -1 })
        .exec((err, results) => {
            if (err) {
                console.log("localhost:3000->db error 504");
                return res.send({ status: null, errors: err });
            }
            if (!results) {
                return res.send({ status: true, eventPost: [], continue: false });
            }

            req.session.currentE = 0;
            if (results.length > 20) {
                req.session.currentE = 20;
                return res.send({
                    status: true,
                    eventPosts: results.splice(0, 20),
                    continue: true
                });
            }

            console.log("localhost:3000->get eventPosts 200ok");
            return res.send({ status: true, eventPosts: results, continue: false });
        });
};
exports.findAllNext = (req, res) => {
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthErr" });
    }
    EventPost.find({})
        .populate({
            path: "document",
            select: "type name src _id cathegorie"
        })
        .sort({ time_create: -1 })
        .exec((err, results) => {
            if (err) {
                console.log("localhost:3000->db error 504");
                return res.send({ status: null, errors: err });
            }

            if (results.length >= req.body.currentE) {
                if (results.length < req.body.currentE + 15) {
                    res.send({
                        status: true,
                        eventPosts: results.splice(
                            req.body.currentEventPost,
                            results.length - req.body.currentEventPost
                        ),
                        nb: results.length,
                        continue: false
                    });
                    return;
                }
                res.send({
                    status: true,
                    eventPosts: results.splice(req.body.currentE, 15),
                    continue: true,
                    nb: req.body.currentE + 15
                });

                return;
            }
            return res.send({ status: false, errors: "message limit excced" });
        });
};
exports.findById = (req, res) => {
    const { id } = req.params;
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthErr" });
    }
    EventPost.findOne({ _id: id })
        .populate({
            path: "document",
            select: "type name src _id cathegorie"
        })
        .exec((err, result) => {
            if (err) {
                console.log("localhost:3000->db error 504");
            }
            console.log("localhost:3000->get eventPost 200ok");
            if (result) return res.send(result);
            res.send({});
        });
};
