const mongoose = require('mongoose');


const Like = mongoose.model('Like');
const Voter = mongoose.model('Voter');
const Event = mongoose.model('Event');
const Project = mongoose.model('Project');
const { get, getDynamic } = require('./socketmanage');
const io = getDynamic();
exports.add = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthError' });
    }
    if (req.body.type === 'voter') {
        return Voter.findById(req.body.target_id, (err, voter) => {
            if (err) {
                return res.send({ status: false, errors: err });
            }
            if (!voter) {
                return res.send({ status: false, errors: 'voter don\'t exist' });
            }
            Like.findOne({ target_id: req.body.target_id }, (err2, like) => {
                if (err2) {
                    return res.send({ status: false, errors: err });
                }
                if (like) {
                    for (const liker of like.voters) {
                        if (liker == req.session.auth._id) {
                            return res.send({ status: false, errors: 'You have voted' });
                        }
                    }
                    like.voters.push(new mongoose.Types.ObjectId(req.session.auth._id));
                    like.updateOne(like, (err3, ok) => {
                        if (err3) {
                            return res.send({ status: false, errors: err });
                        }
                        io.emit('synlike',{ _id: req.body.target_id, type: req.body.type,  nb: like.voters.length })
                        return res.send({ status: true, nb: like.voters.length });
                    });
                } else {
                    Like.create({
                        target_id: new mongoose.Types.ObjectId(req.body.target_id),
                        type: req.body.type,
                        voters: [new mongoose.Types.ObjectId(req.session.auth._id)],
                    })
                        .then((result) => {
                            res.send({ status: true, nb: 1 });
                            io.emit('synlike',{ _id: req.body.target_id, type: req.body.type,  nb: 1});
                        })
                        .catch((err2) => {
                            res.send({ status: false, errors: err2 });
                        });
                }
            });
        });
    }
    if (req.body.type === 'project') {
        return Project.findById(req.body.target_id, (err, project) => {
            if (err) {
                return res.send({ status: false, errors: err });
            }
            if (!project) {
                return res.send({ status: false, errors: 'voter don\'t exist' });
            }
            if (!project.isPublic) {
                return res.send({ status: false, errors: 'we like only public project' });
            }
            Like.findOne({ target_id: req.body.target_id }, (err2, like) => {
                if (err2) {
                    return res.send({ status: false, errors: err });
                }
                if (like) {
                    for (const liker of like.voters) {
                        if (liker == req.session.auth._id) {
                            return res.send({ status: false, errors: 'You have voted' });
                        }
                    }
                    like.voters.push(new mongoose.Types.ObjectId(req.session.auth._id));
                    like.updateOne(like, (err3, ok) => {
                        if (err3) {
                            return res.send({ status: false, errors: err });
                        }
                        io.emit('synlike',{ _id: req.body.target_id, type: req.body.type,  nb: like.voters.length })
                        return res.send({ status: true, nb: like.voters.length });
                    });
                } else {
                    Like.create({
                        target_id: new mongoose.Types.ObjectId(req.body.target_id),
                        type: req.body.type,
                        voters: [new mongoose.Types.ObjectId(req.session.auth._id)],
                    })
                        .then((result) => {
                            res.send({ status: true, nb: 1 });
                            io.emit('synlike',{ _id: req.body.target_id, type: req.body.type,  nb: 1})
                        })
                        .catch((err2) => {
                            res.send({ status: false, errors: err2 });
                        });
                }
            });
        });
    }
    if (req.body.type === 'event') {
        return Event.findById(req.body.target_id, (err, event) => {
            if (err) {
                return res.send({ status: false, errors: err });
            }
            if (!event) {
                return res.send({ status: false, errors: 'event don\'t exist' });
            }

            Like.findOne({ target_id: req.body.target_id }, (err2, like) => {
                if (err2) {
                    return res.send({ status: false, errors: err });
                }
                if (like) {
                    for (const liker of like.voters) {
                        if (liker == req.session.auth._id) {
                            return res.send({ status: false, errors: 'You have voted' });
                        }
                    }
                    like.voters.push(new mongoose.Types.ObjectId(req.session.auth._id));
                    like.updateOne(like, (err3, ok) => {
                        if (err3) {
                            return res.send({ status: false, errors: err });
                        }
                        io.emit('synlike',{ _id: req.body.target_id, type: req.body.type,  nb: like.voters.length})
                        return res.send({ status: true, nb: like.voters.length });
                    });
                } else {
                    Like.create({
                        target_id: new mongoose.Types.ObjectId(req.body.target_id),
                        type: req.body.type,
                        voters: [new mongoose.Types.ObjectId(req.session.auth._id)],
                    })
                        .then((result) => {
                            res.send({ status: true, nb: 1 });
                            io.emit('synlike',{ _id: req.body.target_id, type: req.body.type,  nb: 1})
                        })
                        .catch((err2) => {
                            res.send({ status: false, errors: err2 });
                        });
                }
            });
        });
    }
    return res.send({ status: false, errors: 'invalid type' });
};

exports.get = (req, res) => {
    Like.findOne({ target_id: req.prams.id })
        .exec((err, like) => {
            if (err) {
                return res.send({ status: false, errors: err });
            }
            if (like) {
                return req.send({ status: true, nb: like.voters.length });
            }
            return req.send({ status: true, nb: 0 });
        });
};
exports.remove = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthError' });
    }

    Like.findOne({ target_id: req.body.target_id }, (err2, like) => {
        if (err2) {
            return res.send({ status: false, errors: err });
        }
        if (like) {
            const voters = [];
            for (const liker of like.voters) {
                if (liker == req.session.auth._id) {
                    continue;
                }
                voters.push(liker);
            }
            like.voters = voters;
            like.updateOne(like, (err3, ok) => {
                if (err3) {
                    return res.send({ status: false, errors: err });
                }
                io.emit('synlike',{ id: like.target_id, type: like.type,  nb: like.voters.length })
                return res.send({ status: true, nb: like.voters.length });
            });
        } else {
            res.send({ status: false, errors: 'not exist' });
        }
    });
};
