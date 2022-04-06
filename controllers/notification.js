const mongoose = require('mongoose');
const { get } = require('./socketmanage');

const io = get();

const Notification = mongoose.model('Notification');
exports.findAllUnReadCount = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthErr' });
    }
    Notification.find({ target: req.session.auth._id })
    .where('read', false)
    .count((err, nb) => {
        if (err) {
            return res.send({ status: false, errors: err });
        }
        res.send({ status: true, nb });
    });
};

exports.findAllUnread = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthErr' });
    }
    Notification.find({ target: req.session.auth._id })
        .where('read', false)
        .populate({
            path: 'project',
            populate: { path: 'voter image docs', select: 'src name url description short_descrition email' },
        })
        
        .populate({
            path: 'voter',
            select: 'name url description short_descrition email',
            populate: { path: 'image' },
        })
        .populate({
            path: 'event',
            populate: { path: 'document' },
        })
        .populate({
            path: 'like',
        })
        .sort({ time_create: -1 })
        // .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            return res.send(results);
        });
};
exports.read = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthError' });
    }
    Notification.updateOne({ _id: req.params.id, target: req.session.auth._id }, { read: true }, (err, ok) => {
        if (err) {
            return req.send({ status: false, errors: err });
        }
        io.of(`/voter/${req.session.auth._id}`).emit('messageRead', { _id: req.params.id });
        res.send({ status: true });
    });
};

exports.findAllStartAt = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthError' });
    }
    Notification.find({ target: req.session.auth._id })
        .populate({
            path: 'project',
            populate: { path: 'voter image docs', select: 'name url description short_descrition email' },
        })
        .populate({
            path: 'voter',
            select: 'name url description short_descrition email',
            populate: { path: 'image' },
        })
        .populate({
            path: 'event',
            populate: { path: 'document' },
        })
        .populate({
            path: 'like',
        })
        .sort({ time_create: -1 })
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
                return res.send({ status: null, errors: err });
            }
            if (!results) {
                res.send({ status: true, notifications: [], continue: false });
            }
            let i = -1; let j = 0;
            for (const notif of results) {
                if (notif._id == req.params.id) {
                    i = j;
                    break;
                }
                j++;
            }
            if (i < 0) {
                res.send({ status: false, errors: 'Not Found' });
            }
            req.session.currentNotif = i;
            if (results.length > i + 15) {
                req.session.currentNotif = i + 15;
                return res.send({ status: true, notifications: results.slice(i, i + 15), continue: true });
            }
            console.log('localhost:3000->get notifs 200ok');
            return res.send({ status: true, notifications: results.slice(i, results.length), continue: false });
        });
};
exports.findAllStartAtDate = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthError' });
    }
    Notification.find({ target: req.session.auth._id })
        .populate({
            path: 'project',
            populate: { path: 'voter image docs', select: 'name url description short_descrition email' },
        })
        .populate({
            path: 'voter',
            select: 'name url description short_descrition email',
            populate: { path: 'image' },
        })
        .populate({
            path: 'event',
            populate: { path: 'document' },
        })
        .populate({
            path: 'like',
        })
        .sort({ time_create: -1 })
        .where('time_create')
        .lte(req.body.time)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
                return res.send({ status: null, errors: err });
            }
            if (!results) {
                res.send({ status: true, notifications: [], continue: false });
            }
            let i = -1; let j = 0;
            for (const notif of results) {
                if (notif._id == req.params.id) {
                    i = j;
                    break;
                }
                j++;
            }
            if (i < 0) {
                res.send({ status: false, errors: 'Not Found' });
            }
            req.session.currentNotif = i;
            if (results.length > i + 15) {
                req.session.currentNotif = i + 15;
                return res.send({ status: true, notifications: results.slice(i, i + 15), continue: true });
            }
            console.log('localhost:3000->get notifs 200ok');
            return res.send({ status: true, notifications: results.slice(i, results.length), continue: false });
        });
};
exports.findAllStart = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthError' });
    }
    Notification.find({ target: req.session.auth._id })
        .populate({
            path: 'project',
            populate: { path: 'voter image docs', select: 'name url description short_descrition email' },
        })
        .populate({
            path: 'voter',
            select: 'name url description short_descrition email',
            populate: { path: 'image' },
        })
        .populate({
            path: 'event',
            populate: { path: 'document' },
        })
        .populate({
            path: 'like',
        })
        .sort({ time_create: -1 })
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
                return res.send({ status: null, errors: err });
            }
            if (!results) {
                res.send({ status: true, notifications: [], continue: false });
            }
            req.session.currentNotif = 0;
            if (results.length > 15) {
                req.session.currentNotif = 15;
                return res.send({ status: true, notifications: results.slice(0, 15), continue: true });
            }
            console.log('localhost:3000->get voters 200ok');
            return res.send({ status: true, notifications: results, continue: false });
        });
};
exports.findAllNext = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthErr' });
    }
    Notification.find({ target: req.session.auth._id })
        .populate({
            path: 'project',
            populate: { path: 'voter image docs', select: 'name url description short_descrition email' },
        })
        .populate({
            path: 'voter',
            select: 'name url description short_descrition email',
            populate: { path: 'image' },
        })
        .populate({
            path: 'event',
            populate: { path: 'document' },
        })
        .populate({
            path: 'like',
        })
        .sort({ time_create: -1 })
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
                return res.send({ status: null, errors: err });
            }
            if (!results) {
                res.send({ status: true, notifications: [], continue: false });
            }
            if (results.length >= req.session.currentNotif) {
                if (results.length < (req.session.currentNotif + 15)) {
                    res.send({ status: true, notifications: results.slice(req.session.currentNotif, results.length), continue: false });
                    return req.session.currentNotif = results.length;
                }
                res.send({ status: true, notifications: results.slice(req.session.currentNotif, req.session.currentNotif + 15), continue: true });
                return req.session.currentNotif = req.session.currentNotif + 15;
            }
            return res.send({ status: false, errors: 'notifs limit excced' });
        });
};
exports.findById = (req, res) => {
    const { id } = req.params;
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthErr' });
    }
    Notification.findOne({ _id: id })
        .populate({
            path: 'project',
            populate: { path: 'voter image docs', select: 'name url description short_descrition email' },
        })
        .populate({
            path: 'voter',
            select: 'name url description short_descrition email',
            populate: { path: 'image' },
        })
        .populate({
            path: 'event',
            populate: { path: 'document' },
        })
        .populate({
            path: 'like',
        })
        .exec((err, result) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            if (result) return res.send(result);
            res.send({});
        });
};
