const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Doc = mongoose.model('Doc');
const Voter = mongoose.model('Voter');
const { removeSpace, timeToString } = require('../util/fonctions');
const { sendMailOrNotification } = require('../util/notifOrEmail');
const mailTemplate = require('../util/mailTemplateManager');
const message = require('../config/message');

exports.getDocByVoterId = (req, res) => {
    Doc.findOne({ voter: req.params.id, src: `${req.params.id}/${req.params.name}` }, (err, doc) => {
        if (err) {
            return res.status(500).send({ status: null, errors: err });
        }
        if (!doc) {
            return res.status(404).send({ status: false });
        }
        if (doc.state === 'private') {
            if (typeof (req.session.auth) === 'undefined') {
                return res.status(401).send({ status: false, errors: 'AuthErr' });
            }
        }
        const src = path.join(__dirname, '../images', doc.src);
        fs.access(src, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ status: false });
            }
            res.sendFile(src);
        });
    });
};
exports.rename = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthErr' });
    }
    Doc.findOne({ _id: req.body._id })
        .exec((err, doc) => {
            if (err) {
                return { status: null, errors: err };
            }
            if (req.session.auth._id != doc.voter) {
                if (req.session.auth.type != 'SUPERUSER') return res.send({ status: false, errors: 'AuthErr' });
            }
            if (!req.body.name) {
                return res.send({ status: false, errors: 'missing name' });
            }
            const src = path.join(__dirname, '../images/', doc.src);
            fs.access(src, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
                if (err) {
                    console.log(err);
                    return res.send({ status: false });
                }

                const date = new Date();
                const pt = `${doc.voter}/${removeSpace(req.body.name)}${timeToString(date)}.${removeSpace(req.body.data.type)}`;
                const src2 = `${__dirname}/../images/${pt}`;
                fs.rename(src, src2, (err2) => {
                    if (err2) {
                        console.log(err2);
                        return res.status(500).send({ status: false });
                    }
                    doc.updateOne({ name: req.body.name, src: pt, time_update: date }, (err4, ready) => {
                        if (err4) {
                            console.log(err4);
                            return res.send({ status: false });
                        }
                        res.send({ status: true });
                    });
                });
            });
        });
};
exports.delete = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthErr' });
    }
    Doc.findOne({ _id: req.params.id })
        .exec((err, doc) => {
            if (err) {
                return res.send({ status: null, errors: err });
            }
            if(!doc){
                return res.send({ status: null, errors: 'NotFound' })
            }
            if (req.session.auth._id !== doc.voter) {
                if (req.session.auth.type != 'SUPERUSER') return res.send({ status: false, errors: 'AuthErr' });
            }
            const src = path.join(__dirname, '../images/', doc.src);
            fs.access(src, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
                if (err) {
                    console.log(err);
                    return res.send({ status: false });
                }

                fs.unlink(src, (err2) => {
                    if (err2) {
                        console.log(err2);
                        return res.status(500).send({ status: false });
                    }
                    doc.remove((err4) => {
                        if (err4) {
                            console.log(err4);
                            return res.send({ status: false });
                        }
                        res.send({ status: true });
                    });
                });
            });
        });
};
exports.getAll = (req, res)=>{
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthErr' });
    }
    let state = ['public', 'private']
    if (req.session.auth.type != 'SUPERUSER'){
        state = ['public']
    }
    Doc.find({  }).where('state').in(state).populate({
        path: "voter",
        select: "name url type roleLevel email image bio short_bio time_create time_update"
    }).exec((err, docs)=>{
        if(err){
            return res.send({ status: false, errors: err });
        }
        res.send({ status: true, docs});
    })
}
exports.update = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthErr' });
    }
    if (!req.body.type) {
        return res.send({ status: false, errors: 'TypeIsRequired' });
    }
    if (!req.file || req.file.fieldname !== 'document') {
        return res.send({ status: false, errors: 'FileNotSend' });
    }
    if (!req.body.cathegorie) {
        return res.send({ status: false, errors: 'CathegorieUnSet' });
    }
    if (!req.body.name) {
        return res.send({ status: false, errors: 'NameIsRequired' });
    }
    Doc.findOne({ _id: req.body._id })
        .exec((err, doc) => {
            if (err) {
                return { status: null, errors: err };
            }
            if (req.session.auth._id != doc.voter) {
                if (req.session.auth.type !== 'SUPERUSER') return res.send({ status: false, errors: 'AuthErr' });
            }


            const src = path.join(__dirname, '../images/', doc.src);
            fs.access(src, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
                if (err) {
                    console.log(err);
                    return res.send({ status: false });
                }

                fs.unlink(src, (err2) => {
                    if (err2) {
                        console.log(err2);
                        return res.status(500).send({ status: false });
                    }
                    const date = new Date();
                    const pt = `${doc.voter}/${removeSpace(req.body.name)}${timeToString(date)}.${removeSpace(req.body.type)}`;
                    const src2 = `${__dirname}/../images/${pt}`;
                    fs.writeFile(src2, Buffer.from(new Uint8Array(req.file.buffer)), (err3) => {
                        if (err3) {
                            console.log(err3);
                            return res.send({ status: false });
                        }

                        doc.updateOne({
                            name: req.body.name,
                            type: removeSpace(req.body.type),
                            cathegorie: req.body.cathegorie,
                            
                            src: pt,
                            time_update: date,
                        }, (err4, ready) => {
                            if (err4) {
                                console.log(err4);
                                return res.send({ status: false });
                            }
                            res.send({
                                status: true,
                                doc: {
                                    name: req.body.name,
                                    type: req.body.type,
                                    cathegorie: req.body.cathegorie,
                                    src: pt,
                                    time_update: date,
                                },
                            });
                        });
                    });
                });
            });
        });
};

exports.add = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthErr' });
    }
    if (!req.body.name) {
        return res.send({ status: false, errors: 'NameIsRequired' });
    }
    if (!req.body.type) {
        return res.send({ status: false, errors: 'TypeIsRequired' });
    }
    if (!req.file || req.file.fieldname !== 'document') {
        return res.send({ status: false, errors: 'FileNotSend' });
    }
    if (!req.body.cathegorie) {
        return res.send({ status: false, errors: 'CathegorieUnSet' });
    }
    const userSpace = path.join(__dirname, '../images/', req.session.auth._id, '/');
    fs.access(userSpace, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
            console.log(err);
            if (err == fs.constants.F_OK) {
                fs.mkdirSync(userSpace);
            }
            return res.send({ status: false });
        }
        const date = new Date();
        
        const pt = `${removeSpace(req.body.name)}${timeToString(date)}.${removeSpace(req.body.type)}`;
        fs.writeFile(path.join(userSpace, pt), Buffer.from(new Uint8Array(req.file.buffer)), (err2) => {
            if (err2) {
                console.log(err2);
                return res.send({ status: false });
            }
            Doc
                .create({
                    name: req.body.name,
                    src: `${req.session.auth._id}/${pt}`,
                    time_create: date,
                    time_update: date,
                    type: removeSpace(req.body.type),
                    voter: req.session.auth._id,
                    cathegorie: req.body.cathegorie,
                })
                .then((doc) => {
                    res.send({ status: true, document: doc });
                    const date = new Date();
                    const notif = {
                        time_create: date,
                        time_update: date,
                        url: req.session.auth.url,
                        read: false,
                        type: 'profilPictureUpdate',
                        voter: req.session.auth._id,
                    };
                    if(doc._id == req.session.auth.image._id){
                        let mail = mailTemplate.getTemplate('profilPictureChange');
                        mail.subject = mail.subject.replace('<%userName%>', req.session.auth.name);
                            mail.html = mail.html
                                .replace('<%title%>', message.picture.title.replace('<%userName%>', req.session.auth.name))
                                .replace('<%description%>', message.picture.description)
                                .replace('<%profil%>', `${process.env.BASE_URL}in/${req.session.auth.url}`)
                                .replace('<%url%>', `${process.env.BASE_URL}in/${req.session.auth.url}`)
                                .replace('<%image%>', `${process.env.BASE_URL}api/img/${doc.src}`);
                            sendMailOrNotification(mail, notif, { followers: true, ignore: req.session.auth._id },
                                {
                                    names: ['voter'],
                                    data: {
                                        voter: {
                                            image: doc,
                                            name: req.session.auth.name,
                                            _id: req.session.auth._id,
                                            url: req.session.auth.url,
                                        },
                                    },
                                });
                    }
                })
                .catch((errn) => {
                    console.log(errn);
                    res.send({ status: false });
                });
        });
    });
};
