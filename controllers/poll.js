/* eslint-disable no-loop-func */
/* eslint-disable no-plusplus */
const mongoose = require('mongoose');

const Poll = mongoose.model('Poll');
const PollOption = mongoose.model('PollOption');
const Project = mongoose.model('Project');
function formate(v) {
    let j = '';
    j = v;
    if (typeof (v) === 'string') j = new Date(v);
    return `${j.getFullYear()}-${j.getMonth()}-${j.getDate()}`;
}
exports.addOption = (req, res)=>{
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if (req.session.auth.type == 'VOTER') {
        return res.send({ status: null, errors: { auth: 'PermissionDeniet' } });
    }
    Poll.findOne({ _id: req.body._id}).populate('options').exec((err, poll)=>{
        if (err) {
            return res.send({ status: false, errors: err });
        }
        if(!poll)return res.send({ status: false });
        errors = false;
        
        let i = 0;
        let date = new Date();
        let options = [];
        for (const option of req.body.options) {
            PollOption.create({
                time_create: date,
                time_update: date,
                text: option.text || '',
                project: new mongoose.Types.ObjectId(option),
            }).then((op) => {
                options.push(op._id);
                if (++i && (i == req.body.options.length)) {
                    if (errors) {
                        res.send({ status: false, errors });
                        Poll.deleteOne({ _id: poll._id });
                        for (const opd of options) {
                            PollOption.deleteOne({ _id: opd });
                        }
                    }
                    // lancement du callback
                    if (req.body.status == 'wait') {

                    }
                    for (const p of req.body.options) {
                        Project.updateOne({ _id: p }, { state: 'submited' }, (_err) => {

                        });
                    }

                    for (const opt of options) {
                        poll.options.push(new mongoose.Types.ObjectId(opt));
                    }
                    poll.save().then((ok) => {
                        res.send({ status: true });
                    }).catch((err) => {
                        console.log(err);
                        Poll.deleteOne({ _id: poll._id });
                        for (const opd of options) {
                            PollOption.deleteOne({ _id: opd });
                        }
                        res.send({ status: false, errors: err });
                    });
                }
            }).catch((_err) => {
                errors = _err;
                if (++i && i == req.body.options.length) {
                    res.send({ status: false, errors });
                }
            });
        }
        
    })
}
exports.add = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if (req.session.auth.type == 'VOTER') {
        return res.send({ status: null, errors: { auth: 'PermissionDeniet' } });
    }


    let errors = {};
    const options = [];
    if (!req.body.options || req.body.options.length < 2) {
        errors.options = 'required';
    }
    if (new Date(req.body.expiration) < new Date(req.body.start)) {
        errors.date = 'invalidRange';
    }
    if (formate(req.body.start) == formate(new Date())) {
        req.body.status = 'inprocess';
    }
    if (!req.body.status) {
        errors.status = 'required';
    }
    if (!req.body.question) {
        errors.status = 'required';
    }

    if (errors.question || errors.status || errors.options || errors.date) {
        return res.send({ status: false, errors });
    }
    const date = new Date();
    Poll.create({
        creator_id: new mongoose.Types.ObjectId(req.session.auth._id),
        status: req.body.status,
        question: req.body.question,
        expiration: req.body.expiration,
        start: req.body.start,
        time_create: date,
        time_update: date,
        options: [],
    }).then((poll) => {
        errors = false;
        let i = 0;
        for (const option of req.body.options) {
            PollOption.create({
                time_create: date,
                time_update: date,
                text: option.text || '',
                project: new mongoose.Types.ObjectId(option),
            }).then((op) => {
                options.push(op._id);
                if (++i && (i == req.body.options.length)) {
                    if (errors) {
                        res.send({ status: false, errors });
                        Poll.deleteOne({ _id: poll._id });
                        for (const opd of options) {
                            PollOption.deleteOne({ _id: opd });
                        }
                    }
                    // lancement du callback
                    if (req.body.status == 'wait') {

                    }
                    for (const p of req.body.options) {
                        Project.updateOne({ _id: p }, { state: 'submited' }, (_err) => {

                        });
                    }

                    for (const opt of options) {
                        poll.options.push(new mongoose.Types.ObjectId(opt));
                    }
                    poll.save().then((ok) => {
                        res.send({ status: true });
                    }).catch((err) => {
                        console.log(err);
                        Poll.deleteOne({ _id: poll._id });
                        for (const opd of options) {
                            PollOption.deleteOne({ _id: opd });
                        }
                        res.send({ status: false, errors: err });
                    });
                }
            }).catch((_err) => {
                errors = _err;
                if (++i && i == req.body.options.length) {
                    res.send({ status: false, errors });
                }
            });
        }
    }).catch((err) => {
        res.send({ status: false, errors: err });
    });
};
exports.delete = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if (req.session.auth.type == 'VOTER') {
        return res.send({ status: null, errors: { auth: 'PermissionDeniet' } });
    }
    Poll.findOne({ _id: req.params.id })
        .populate({
            path: 'options',

        })
        .exec((err, po) => {
            
            if (err) {
                return res.send({ status: false, errors: err });
            }
            
            if (req.session.auth.type != 'SUPERUSER') {
                if (req.session.auth._id != po._id) {
                    return res.send({ status: false, errors: { auth: 'PermissionDeniet' } });
                }
            }
            if(!po)return res.send({ status: false, errors: 'NotFound' });
            let i = 0;

            if (!po.options || po.options.length == 0) {return  Poll.deleteOne({ _id: req.params.id },(err2) =>{
            if(err2){
                return res.send({ status: false , errors: err2 })
            }
            console.log(po.options)
            res.send({ status: true });
        });}
            for (const option of po.options) {
                PollOption.findOne({ _id: option }, (err, opt) => {
                    if (err) {
                        console.log('Big ', err);
                    }
                    Project.updateOne({ _id: opt.project }, { state: 'accepted' }, (err, ok) => {
                        console.log(err, ok);
                    });
                    PollOption.deleteOne({ _id: option });
                    if (++i && i == po.options.length) {
                        Poll.deleteOne({ _id: req.params.id }, (err2) => {
                            if (err2) {
                                return res.send({ status: false, errors: err2 });
                            }
                            res.send({ status: true });
                            if (po.status == 'inprocess') {
                            // notify all user that admin delete the poll
                            }
                        });
                    }
                });
            }
        });
};
exports.close = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if (req.session.auth.type != 'SUPERUSER') {
        return res.send({ status: null, errors: { auth: 'PermissionDeniet' } });
    }
    Poll.updateOne({ _id: req.params.id }, { status: 'close' }, (err, pb) => {
        if (err) {
            return res.send({ status: false, errors: err });
        }
        // notify that
        res.send({ status: true });
    });
};
exports.put = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if (req.session.auth.type == 'VOTER') {
        return res.send({ status: null, errors: { auth: 'PermissionDeniet' } });
    }
    errors = {};
  
    if (new Date(req.body.expiration) < new Date(req.body.start)) {
        errors.date = 'invalidRange';
    }
  
    if (!req.body.status) {
        errors.status = 'required';
    }
    if (!req.body.question) {
        errors.status = 'required';
    }

    if (errors.question || errors.status  || errors.date) {
        return res.send({ status: false, errors });
    }
    Poll.findById(req.body._id, (err, good) => {
        if (err) {
            return res.send({ status: false, errors: err });
        }
        if (good) {
            if (good.status == 'wait') {
                if (formate(req.body.start) == formate(new Date())) {
                    req.body.status = 'inprocess';
                }
                Poll.updateOne({ _id: req.body._id }, {
                    time_update: new Date(), expiration: new Date(req.body.expiration), start: new Date(req.body.start), question: req.body.question 
                }, (err1, pb) => {
                    if (err1) {
                        return res.send({ status: false, errors: err1 });
                    }
                    // notify that
                    res.send({ status: true });
                });
            } else if(good.status == 'inprocess'){
               
                    Poll.updateOne({ _id: req.body._id }, { time_update: new Date(), expiration: new Date(req.body.expiration), question: req.body.question }, (err1, pb)=>{
                        if (err1) {
                            return res.send({ status: false, errors: err1 });
                        }
                        //notify that 
                        res.send({ status: true })
                    })
                }else{
                    res.send({ status: false, errors: 'ProjectClose'})
                }
        }
    });
};
exports.deleteOption = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if (req.session.auth.type == 'VOTER') {
        return res.send({ status: null, errors: { auth: 'PermissionDeniet' } });
    }
    Poll.findOne({ _id: req.params.id })
        .populate({
            path: 'options',

        }).exec((err, poll) => {
            
            if (err) {
                return res.send({ status: false, errors: err });
            }
            if(!poll){
                return res.send({ status: false, errors: 'NotFound' });
            }
            if (poll.options.length <= 2) {
                return res.send({ status: false, errors: { options: 'AddOptionBefore' } });
            }
            if (poll.status == 'inprocess' ||  poll.status == 'close') {
                return res.send({ status: false, errors: { poll: 'Start' } });
            }
            let elm;
            const options = [];
            for (const option of poll.options) {
                if (option._id == req.params.option) {
                    elm = option;
                    continue;
                }
                options.push(new mongoose.Types.ObjectId(option._id));
            }
            if (!elm) return res.send({ status: false, errors: { option: 'NotFound' } });
            poll.options = options;

            poll.save((err, ok) => {
                if (err) {
                    return res.send({ status: false, errors: err });
                }
                PollOption.deleteOne({ _id: req.params.option });
                Project.updateOne({ _id: elm.project }, { state: 'accepted' },(no,ok)=>{
                    if(no){
                        return res.send({ status: false, errors: no });
                    }   
                    res.send({ status: true });
                });
                // notify that project update to any one
                
            });
        });
};
exports.getPoll = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if (req.session.auth.type == 'VOTER') {
        return res.send({ status: null, errors: { auth: 'PermissionDeniet' } });
    }
    Poll.find({})


        .populate({
            path: 'options',
            populate: { path: 'project', populate: { path: 'image docs' } },
        })
        .populate({
            path: 'vote',
            populate: {
                path: 'voter',
                select: 'name short_bio url _id',
                populate: { path: 'image' },
            },
        })
        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log(err);
            }

            return res.send(results || []);
        });
};
exports.getPollByAny = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }

    Poll.find({})

        .populate({
            path: 'cathegories',
            select: 'name _id',
        })
        .select('question expiration start time_create time_update')
        .populate({
            path: 'options',
            populate: { path: 'project' },
        })

        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log(err);
            }

            return res.send(results || []);
        });
};
exports.nb = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    Poll.find({}).count((err, nb) => {
        if (err) {
            return res.send({ status: false, errors: err });
        }
        res.send({ status: true, nb });
    });
};
