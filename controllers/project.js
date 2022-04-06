/* eslint-disable func-names */
/* eslint-disable linebreak-style */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { mailApi } = require('../util/mail');
const mailTemplate = require('../util/mailTemplateManager');
const Project = mongoose.model('Project');
const Doc = mongoose.model('Doc');
const tokenGenerator = require('uuid-token-generator');
const { removeSpace } = require('../util/fonctions');
const i18n = require('i18n');
const mintoken = new tokenGenerator(128);
const validState = ['accepted', 'voted', 'start', 'end'];

const { sendMailOrNotification } = require('../util/notifOrEmail');
const Notification = mongoose.model('Notification');
const Event = mongoose.model('Event');
const Voter = mongoose.model('Voter');
const { get, getDynamic } = require('./socketmanage');
let io = getDynamic();
let gIo = get();
function checkState(state){
    for(let i of validState){
        if(state == i) return true;
    }
    return false;
}
exports.removeDoc = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthError' });
    }
    Doc.findById(req.params.docId, (err, doc) => {
        if (err) {
            return res.send({ status: false, errors: err });
        }
        if (!doc) {
            return res.send({ status: false, errors: 'Document don\'t existe' });
        }
        if (req.session.auth._id !== `${doc.voter}` && req.session.auth.type === 'VOTER') {
            return res.send({ status: false, errors: 'PermissionDeniet' });
        }

        Project.findById(req.params.id, (err1, project) => {
            if (err1) {
                return res.send({ status: false, errors: err1 });
            }
            if (!project) {
                return res.send({ status: false, errors: 'Project don\'t existe' });
            }
            if (req.session.auth._id !== `${project.voter}` && req.session.auth.type === 'VOTER') {
                return res.send({ status: false, errors: 'Permission Deniet for this project update' });
            }
            
            const docs = [];
            for (const document of project.docs) {
                if (document == req.params.docId) {
                    continue;
                }
                docs.push(document);
            }
            project.docs = docs;
            project.updateOne(project, (err3, ok) => {
                if (err3) {
                    return res.send({ status: false, errors: err3 });
                }
                if(project.isPublic){
                    let date = new Date();
                    const notif = {
                        time_create: date,
                        time_update: date,
                        url: project.url,
                        read: false,
                        type: 'update',
                        project: project._id,
                        target: req.session.auth._id,
                    };
                   
                        let mail = mailTemplate.getTemplate('activity');
                    mail.subject = res.__('project_update.subject', project.name);
                    mail.html = mail.html
                        .replace('<%the%>', res.__('the'))
                        .replace('<%on%>', res.__('on'))
                        .replace('<%and%>', res.__('and'))
                        .replace('<%follow%>', res.__('follow'))
                        .replace('<%home%>', res.__('home'))
                        .replace('<%title%>', res.__('project_update.title', project.short_description))
                            .replace('<%url%>', `${process.env.BASE_URL}project/${project.url}`)
                            .replace('<%description%>', res.__('project_update.description', project.description) )
                            
                            
                        sendMailOrNotification(mail, notif, { followers: true, ignore: [req.session.auth._id] }, {
                            names: ['project'],
                            data: {
                                project
                            },
                        });
                        
                        Event.create({
                            type: 'project',
                            time_create: date,
                            language: req.getLocale(),
                            link: project.url,
                            time_update: date,
                            tags: 'project,project_update',
                            title: res.__('project_update.d_r_title', project.name),
                            description: res.__('project_update.d_r_description', project.short_description, project.description),
                            document: project.image._id,
                        }).then((event)=>{
                            let t= event;
                            t.document = project.image
                            io.emit('newEvent', t)       
                        })
                }
                res.send({ status: true });
            });
        });
    });
};
exports.addDoc = (req, res) => {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthError' });
    }
    Doc.findById(req.body._id, (err, doc) => {
        if (err) {
            return res.send({ status: false, errors: err });
        }
        if (!doc) {
            return res.send({ status: false, errors: 'Document don\'t existe' });
        }
        if (req.session.auth._id !== `${doc.voter}` && req.session.auth.type === 'VOTER') {
            return res.send({ status: false, errors: 'PermissionDeniet' });
        }

        Project.findById(req.params.id, (err1, project) => {
            if (err1) {
                return res.send({ status: false, errors: err1 });
            }
            if (!project) {
                return res.send({ status: false, errors: 'Project don\'t existe' });
            }
            if (req.session.auth._id !== `${project.voter}` && req.session.auth.type === 'VOTER') {
                return res.send({ status: false, errors: 'Permission Deniet for this project update' });
            }
            project.docs.push(new mongoose.Types.ObjectId(req.body._id));
            project.updateOne(project, (err3, ok) => {
                if (err3) {
                    return res.send({ status: false, errors: err3 });
                }
                if(project.isPublic){
                    let date = new Date();
                    const notif = {
                        time_create: date,
                        time_update: date,
                        url: project.url,
                        read: false,
                        type: 'update',
                        project: project._id,
                        target: req.session.auth._id,
                    };
                   
                        let mail = mailTemplate.getTemplate('activity');
                    mail.subject = res.__('project_update.subject', project.name);
                        const src = path.join(__dirname, '../images', doc.src);
                        mail.attachments = [{
                            filename: doc.name+doc.type,
                            path: src
                        }];
                    mail.html = mail.html
                        .replace('<%the%>', res.__('the'))
                        .replace('<%on%>', res.__('on'))
                        .replace('<%and%>', res.__('and'))
                        .replace('<%follow%>', res.__('follow'))
                        .replace('<%home%>', res.__('home'))
                        .replace('<%title%>', res.__("project_update.title", project.short_description))
                            .replace('<%url%>', `${process.env.BASE_URL}project/${project.url}`)
                        .replace('<%description%>', res.__('project_update.a_description', project.description) )
                            
                            
                        sendMailOrNotification(mail, notif, { followers: true, ignore: [req.session.auth._id] }, {
                            names: ['project'],
                            data: {
                                project
                            },
                        });
                        
                        Event.create({
                            type: 'project',
                            time_create: date,
                            link: project.url,
                            time_update: date,
                            language: req.getLocale(),
                            tags: 'project,project_update',
                            title: res.__('project_update.d_a_title'),
                            description: res.__('project_update.d_r_description', project.short_description, project.description),
                            document: project.image._id,
                        }).then((event)=>{
                            let t= event;
                            t.document = project.image
                            io.emit('newEvent', t)       
                        });
                }
                res.send({ status: true });
            });
        });
    });
};
exports.numProject = (req, res) => {
    Project.countDocuments({ isPublic: true }, (err, count) => {
        if (err) return res.send({ status: false });
        res.send({ status: true, nb: count });
    });
};
exports.numProjectBySate = (req, res) => {
    if (!checkState(req.params.state))return res.send({ state: false, errors: 'InvalidSate' });
    Project.countDocuments({ isPublic: true, state: req.params.state }, (err, count) => {
        if (err) return res.send({ status: false });
        res.send({ status: true, nb: count });
    });
};
exports.numMyProject = (req, res) => {
    
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: false, errors: 'AuthError' });
    }
    Project.countDocuments({ voter: req.session.auth._id }, (err, count) => {
        if (err) return res.send({ status: false });
        res.send({ status: true, nb: count });
    });
};

exports.testurl = (req, res) => {
    let state = ['public'];
    if(typeof (req.session.auth) !== 'undefined'){
        state = ['public','private']
    }
    Project
        .findOne({ url: req.params.url })
        .populate({
            path: 'cathegories',
            select: 'name _id',
        })
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .populate({
            path: 'docs',
            select: 'src name _id',
        })
        .populate({
            path: 'voter',
            select: 'name bio short_bio _id url ',
            match: { state: { $in: state } },
            populate: { path: 'image' },
        })
        .exec((err, project) => {
            if (err) {
                return res.send({ status: false, err });
            }
            if (project) {
                if (project.isPublic) {
                    return res.send({ status: true, project });
                }
                if (typeof (req.session.auth) === 'undefined') {
                    return res.send({ status: false, errors: 'PrivateProject' });
                }
               if(project.voter){
                if (req.session.auth._id == project.voter._id || req.session.auth.type !== 'VOTER') {
                    return res.send({ status: true, project });
                }
               }else{
                return res.send({ status: true, project });
               }
                
            }

            return res.send({ status: false, errors: 'NotFound' });
        });
};
exports.accept = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if(req.session.auth.type == 'VOTER'){
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
   
    Project.findOneAndUpdate({ _id: req.params.id, state: 'toBeValidate' }, { state: 'accepted', isPublic: true }).populate('image').populate('docs').exec((err, project)=>{
        if(err){
            return res.send({ status: false, errors: err });
        }
        if(!project){
            return res.send({ status: false, errors: 'NotFound' })
        }
            let attachments = []
            for(let doc of project.docs){
                const src = path.join(__dirname, '../images', doc.src);
                 
                attachments.push({
                    filename: doc.name+doc.type,
                    path: src
                })
            };
                             
            let date = new Date();
            const notif2 = {
                time_create: date,
                time_update: date,
                url: project.url,
                read: false,
                type: 'accepted',
                project: project._id,
                target: project.voter._id,
            };    
            let mail2 = mailTemplate.getTemplate('activity');  
        mail2.subject = i18n. __({ phrase: 'project_update.p_accepted', locale: project.voter.language }, process.env.APP_NAME);
        
        mail2.html = mail2.html
            .replace('<%the%>', i18n.__({ phrase: 'the', locale: project.voter.language }))
            .replace('<%on%>', i18n.__({ phrase: 'on', locale: project.voter.language }))
            .replace('<%follow%>', i18n.__({ phrase: 'follow', locale: project.voter.language }))
            .replace('<%and%>', i18n.__({ phrase: 'and', locale: project.voter.language }))
            .replace('<%home%>', i18n.__({ phrase: 'home', locale: project.voter.language }))
            .replace('<%title%>', i18n.__({ phrase: 'project_update.title', locale: project.voter.language }, project.short_description) )
                .replace('<%url%>', `${process.env.BASE_URL}project/${project.url}`)
                .replace('<%description%>', ` <img width="280px" heigth="280px" src="${process.env.BASE_URL+'api/img/'+ project.image.src} alt="${project.image.src}"> <br/>${project.description}`);  
            sendMailOrNotification(mail2, notif2, { single: true, _id: project.voter._id, email: project.voter.email }, {
                names: ['project'],
                data: {
                    project
                },
            }); 
            const notif = {
                time_create: date,
                time_update: date,
                url: project.url,
                read: false,
                type: 'new',
                project: project._id,
                target: req.session.auth._id,
            };
            
                let mail = mailTemplate.getTemplate('activity');
        mail.subject = res.__('project_update.n_subject');
                mail.attachments = attachments;
                mail.html = mail.html
                    .replace('<%the%>', res.__('the'))
                    .replace('<%on%>', res.__('on'))
                    .replace('<%and%>', res.__('and'))
                    .replace('<%follow%>', res.__('follow'))
                    .replace('<%home%>', res.__('home'))
                    .replace('<%title%>', res.__('project_update.n_description', project.name, project.short_description, project.description))
                    .replace('<%url%>', `${process.env.BASE_URL}project/${project.url}`)
                    .replace('<%description%>', ` <img width="280px" heigth="280px" src="${process.env.BASE_URL+'api/img/'+ project.image.src} alt="${project.image.src}"> <br/>${project.description}`)
                       
                sendMailOrNotification(mail, notif, { all: true, ignore: [req.session.auth._id, project.voter._id] }, {
                    names: ['project'],
                    data: {
                        project
                    },
                });
                
                Event.create({
                    type: 'project',
                    time_create: date,
                    link: project.url,
                    time_update: date,
                    language: req.getLocale(),
                    tags: 'project,project_update',
                    title: res.__('project_update.n_subject'),
                    description: res.__('project_update.n_subject', project.name, project.short_description, project.description),
                    document: project.image._id,
                }).then((event)=>{
                    let t= event;
                    t.document = project.image;
                    io.emit('newEvent', t);       
                })
        
        return res.send({ status: true });
    })
    
}
exports.decline = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if(req.session.auth.type == 'VOTER'){
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    Project.findOneAndUpdate({ _id: req.params.id, state: 'toBeValidate' }, { state: 'refused' }).populate('voter').exec((err, project)=>{
        if(err){
            return res.send({ status: false, errors: err });
        }
        let date = new Date();
        const notif = {
                time_create: date,
                time_update: date,
                url: project.url,
                read: false,
                type: 'decline',
                project: project._id,
                target: project.voter._id,
            };
        let mail = mailTemplate.getTemplate('activity');
        mail.subject = i18n.__({ phrase: 'project_update.r_subject', locale: project.voter.language }, process.env.APP_NAME);
        
        mail.html = mail.html
            .replace('<%the%>', i18n.__({ phrase: 'the', locale: project.voter.language }))
            .replace('<%on%>', i18n.__({ phrase: 'on', locale: project.voter.language }))
            .replace('<%follow%>', i18n.__({ phrase: 'follow', locale: project.voter.language }))
            .replace('<%and%>', i18n.__({ phrase: 'and', locale: project.voter.language }))
            .replace('<%home%>', i18n.__({ phrase: 'home', locale: project.voter.language }))
            .replace('<%title%>', i18n.__({ phrase: 'project_update.r_title', locale: project.voter.language }, project.name))
        .replace('<%url%>', `${process.env.BASE_URL}project/${project.url}`)
        .replace('<%description%>', `${project.description}`)
        sendMailOrNotification(mail, notif, { single: true, email: project.voter.email, _id: project.voter._id }, {
            names: ['project'],
            data: {
                project,
            },
        })            
        
        return res.send({ status: true });
    })
    
}
exports.getProjectTocheckStart = (req, res)=>{
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if(req.session.auth.type == 'VOTER'){
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    Project.find({})
        .where('isPublic')
        .equals(false)
        .where('state')
        .equals('toBeValidate')
        .populate('cathegories')
        .populate({
            path: 'docs',

        })
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .populate({
            path: 'voter',
            select: 'name _id url bio short_bio',
            populate: { path: 'image socials' },
        })
        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            if (!results) {
                res.send({ status: true, projects: [], continue: false });
            }
            req.session.currentProjectC = 0;
            if (results.length > 15) {
                req.session.currentProjectC = 15;
                return res.send({ status: true, projects: results.slice(0, 15), continue: true });
            }
            return res.send({ status: true, projects: results, continue: false });
        });
}
exports.getProjectTocheckNext = (req, res)=>{
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if(req.session.auth.type == 'VOTER'){
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    Project.find({})
        .where('isPublic')
        .equals(false)
        .where('state')
        .equals('toBeValidate')
        .populate('cathegories')
        .populate({
            path: 'docs',

        })
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .populate({
            path: 'voter',
            select: 'name _id url email bio short_bio',
            populate: { path: 'image socials' },
        })
        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            if (!results) {
                res.send({ status: true, projects: [], continue: false });
            }
            if (results.length >= req.session.currentProjectC) {
                if (results.length < (req.session.currentProjectC + 15)) {
                    res.send({ status: true, projects: results.slice(req.session.currentProjectC, results.length), continue: false });
                    return req.session.currentProjectC = results.length;
                }
                res.send({ status: true, projects: results.slice(req.session.currentProjectC, req.session.currentProjectC + 15), continue: true });
                return req.session.currentProjectC = req.session.currentProjectC + 15;
            }
            return res.send({ status: false, errors: 'message limit excced' });
        });
}
exports.getProjectPendingStart = (req, res)=>{
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if(req.session.auth.type == 'VOTER'){
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    Project.find({})
        .where('isPublic')
        .equals(true)
        .where('state')
        .in(['accepted', 'submited', 'voted'])
        .populate('cathegories')
        .populate({
            path: 'docs',

        })
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .populate({
            path: 'voter',
            select: 'name _id url bio short_bio',
            populate: { path: 'image socials' },
        })
        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            if (!results) {
                res.send({ status: true, projects: [], continue: false });
            }
            req.session.currentProjectP = 0;
            if (results.length > 15) {
                req.session.currentProjectP = 15;
                return res.send({ status: true, projects: results.slice(0, 15), continue: true });
            }
            return res.send({ status: true, projects: results, continue: false });
        });
}
exports.waitSelection = (req, res)=>{
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    
    Project.find({})
        .where('isPublic')
        .equals(true)
        .where('state')
        .in(['accepted'])
        .populate('cathegories')
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
           
            return res.send(results || []);
        });
}

exports.getProjectPendingNext = (req, res)=>{
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    if(req.session.auth.type == 'VOTER'){
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    Project.find({})
        .where('isPublic')
        .equals(true)
        .where('state')
        .in(['accepted', 'submited', 'voted'])
        .populate('cathegories')
        .populate({
            path: 'docs',

        })
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .populate({
            path: 'voter',
            select: 'name _id url email bio short_bio',
            populate: { path: 'image socials' },
        })
        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            if (!results) {
                res.send({ status: true, projects: [], continue: false });
            }
            if (results.length >= req.session.currentProjectP) {
                if (results.length < (req.session.currentProjectP + 15)) {
                    res.send({ status: true, projects: results.slice(req.session.currentProjectP, results.length), continue: false });
                    return req.session.currentProjectP = results.length;
                }
                res.send({ status: true, projects: results.slice(req.session.currentProjectP, req.session.currentProjectP + 15), continue: true });
                return req.session.currentProjectP = req.session.currentProjectP + 15;
            }
            return res.send({ status: false, errors: 'message limit excced' });
        });
}
exports.submitProject = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }

    Project
        .findOne({ _id: req.params.id }).populate({
            path: 'image',
            select: 'src name _id',
        }).populate('docs').exec ((err, project) => {
            if (err) {
                return res.send({ status: false, errors: err });
            }
            if (!project) {
                return res.send({ status: false, errors: 'ProjetDontExist' });
            }
            if(!project.image){
                return res.send({ status: false, errors: 'PleaseAddImage' });
            }
            // check permission here
            if ((req.session.auth.type === 'VOTER') && (`${req.session.auth._id}` !== `${project.voter}`)) {
                return res.send({ status: false, errors: 'YouDontHavePermissionToUpdateThisProject' });
            }
          
            let modif = {
                 state: 'toBeValidate' 
            }
            if(req.session.auth.type != 'VOTER'){
                modif.state = 'accepted',
                modif.isPublic = true;
            }else{
                
            }
            Project.updateOne({ _id: req.params.id }, modif, (errn, project2) => {
                if (errn) return res.send({ status: false });
                res.send({ status: true, project: project2 });
                if(req.session.auth.type != 'VOTER'){
                    let date = new Date();
                    const notif = {
                        time_create: date,
                        time_update: date,
                        url: project.url,
                        read: false,
                        type: 'new',
                        project: project._id,
                        target: req.session.auth._id,
                    };
                    
                        let mail = mailTemplate.getTemplate('activity');
                    mail.subject = res.__('project_update.n_subject');
                        
                    mail.html = mail.html
                        .replace('<%the%>', res.__('the'))
                        .replace('<%on%>', res.__('on'))
                        .replace('<%follow%>', res.__('follow'))
                        .replace('<%and%>', res.__('and'))
                        .replace('<%home%>', res.__('home'))
                            .replace('<%title%>', res.__('project_update.n_description', project.name, project.short_description, project.description))
                            .replace('<%url%>', `${process.env.BASE_URL}project/${project.url}`)
                            .replace('<%description%>', ` <img width="280px" heigth="280px" src="${process.env.BASE_URL+'api/img/'+ project.image.src} alt="${project.image.src}"> <br/>${project.description}`)
                               
                        sendMailOrNotification(mail, notif, { all: true, ignore: [req.session.auth._id, project.voter._id] }, {
                            names: ['project'],
                            data: {
                                project
                            },
                        });
                        
                        Event.create({
                            type: 'project',
                            time_create: date,
                            link: project.url,
                            time_update: date,
                            language: req.getLocale(),
                            tags: 'project',
                            title: res.__('project_update.n_subject'),
                            description: res.__('project_update.n_subject', project.name, project.short_description, project.description),
                            document: project.image._id,
                        }).then((event)=>{
                            const t= event;
                            t.document = project.image;
                            io.emit('newEvent', t)       
                        })
                }else{
                    Voter.findOne({ type: 'SUPERUSER' },(err9, admin)=>{
                        let attachments = []
                    for(let doc of project.docs){
                        const src = path.join(__dirname, '../images', doc.src);
                        
                        attachments.push({
                            filename: doc.name+doc.type,
                            path: src
                        })
                    };
                    let date = new Date();
                    const notif = {
                        time_create: date,
                        time_update: date,
                        url: project.url,
                        read: false,
                        type: 'submit',
                        project: project._id,
                        target: admin._id,
                    };
                        let mail = mailTemplate.getTemplate('activity');
                        mail.subject = i18n.__({ phrase: 'project_update.c_subject', locale: admin.language });
                        mail.attachments = attachments;
                        mail.html = mail.html
                            .replace('<%the%>', i18n.__({ phrase: 'the', locale: admin.language }))
                            .replace('<%on%>', i18n.__({ phrase: 'on', locale: admin.language }))
                            .replace('<%follow%>', i18n.__({ phrase: 'follow', locale: admin.language }))
                            .replace('<%and%>', i18n.__({ phrase: 'and', locale: admin.language }))
                            .replace('<%home%>', i18n.__({ phrase: 'home', locale: admin.language }))
                            .replace('<%title%>', i18n.__({ phrase: 'project_update.title', locale: admin.language }, project.name))
                            .replace('<%url%>', `${process.env.BASE_URL}project/${project.url}`)
                            .replace('<%description%>', i18n.__({ phrase: 'project_update.d_r_description', locale: admin.language }, project.short_description, project.description,) )
                        sendMailOrNotification(mail, notif, { single: true, email: admin.email, _id: admin._id }, {
                            names: ['project'],
                            data: {
                                project,
                            },
                        })
                    })
                }
            });
        });
};
exports.changeImg = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }

    Project
        .findOne({ _id: req.params.projectId }, (err, project) => {
            if (err) {
                return res.send({ status: false, errors: err });
            }
            if (!project) {
                return res.send({ status: false, errors: 'ProjetDontExist' });
            }
            // check permission here
            if ((req.session.auth.type === 'VOTER') && (`${req.session.auth._id}` !== `${project.voter}`)) {
                return res.send({ status: false, errors: 'YouDontHavePermissionToUpdateThisProject' });
            }
            Doc.findOne({ _id: req.params.docId }, (err2, doc) => {
                if (err2) {
                    return res.send({ status: false, errors: err2 });
                }
                if (!doc) {
                    return res.send({ status: false, errors: 'DocumentDontExist' });
                }
                if (req.session.auth.type === 'VOTER' && (`${req.session.auth._id}` !== `${doc.voter}`)) {
                    return res.send({ status: false, errors: 'YouDontHavePermission' });
                }
                // check if is and image
                Project.updateOne({ _id: req.params.projectId }, { image: doc._id }, (errn, project2) => {
                    if (errn) return res.send({ status: false });
                    res.send({ status: true, project: project2 });
                    if(project.isPublic){
                        let date = new Date();
                        const notif = {
                                time_create: date,
                                time_update: date,
                                url: project.url,
                                read: false,
                                type: 'update',
                                project: project._id,
                                target: project.voter,
                            };
                        let mail = mailTemplate.getTemplate('activity');
                        mail.subject = res.__('project_update.subject', project.name);
                        mail.html = mail.html
                            .replace('<%the%>', res.__('the'))
                            .replace('<%home%>', res.__('home'))
                            .replace('<%and%>', res.__('and'))
                            .replace('<%on%>', res.__('on'))
                            .replace('<%follow%>', res.__('follow'))
                            .replace('<%title%>', res.__('project_update.title', project.short_description))
                                    .replace('<%url%>', `${process.env.BASE_URL}project/${project.url}`)
                                    .replace('<%description%>', `${project.description}`)
                        sendMailOrNotification(mail, notif, { followers: true, ignore: [req.session.auth._id] }, {
                            names: ['project'],
                            data: {
                                project,
                            },
                        });
                        Event.create({
                            type: 'project',
                            time_create: date,
                            link: project.url,
                            time_update: date,
                            language: req.getLocale(),
                            tags: 'project,project_update',
                            title: res.__('project_update.p_title', project.name),
                            description:  project.short_description,
                            document: project.image,
                        }).then((event)=>{
                            let t= event;
                            t.document = doc;
                            io.emit('newEvent', t)
                        })
                    }
                });
            });
        });
};

exports.findAllStartByState = (req, res) => {
    let state = ['public'];
    if(req.session.auh){
        state = ['public','private']
    }
    if (!checkState(req.params.state))return res.send({ state: false, errors: 'InvalidSate' });
    Project.find({})
        .where('isPublic')
        .equals(true)
        .where('state')
        .equals(req.params.state)
        .populate({
            path: 'cathegories',
            select: 'name _id',
        })
        .populate({
            path: 'docs',

        })
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .populate({
            path: 'voter',
            select: 'name _id url bio short_bio',
            populate: { path: 'image socials' },
            match: { state: { $in: state } },
        })
        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            if (!results) {
                res.send({ status: true, projects: [], continue: false });
            }
            req.session[req.params.state] = 0;
            if (results.length > 15) {
                req.session[req.params.state] = 15;
                return res.send({ status: true, projects: results.slice(0, 15), continue: true });
            }
            return res.send({ status: true, projects: results, continue: false });
        });
};
exports.findAllNextByState = (req, res) => {
    let state = ['public'];
    if(req.session.auh){
        state = ['public','private']
    }
    if (!checkState(req.params.state))return res.send({ state: false, errors: 'InvalidSate' });
    Project.find({})
        .where('isPublic')
        .equals(true)
        .where('state')
        .equals(req.params.state)
        .populate({
            path: 'cathegories',
            select: 'name _id',
        })
        .populate({
            path: 'docs',

        })
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .populate({
            path: 'voter',
            select: 'name _id email bio short_bio',
            populate: { path: 'image socials' },
            match: { state: { $in: state } },
        })
        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            if (!results) {
                res.send({ status: true, projects: [], continue: false });
            }
            if (results.length >= req.session[req.params.state]) {
                if (results.length < (req.session.currentProject + 15)) {
                    res.send({ status: true, projects: results.slice(req.session[req.params.state], results.length), continue: false });
                    return req.session[req.params.state] = results.length;
                }
                res.send({ status: true, projects: results.slice(req.session[req.params.state], req.session[req.params.state] + 15), continue: true });
                return req.session[req.params.state] = req.session[req.params.state] + 15;
            }
            return res.send({ status: false, errors: 'message limit excced' });
        });
};

exports.findAllStart = (req, res) => {
    let state = ['public'];
    if(req.session.auth){
        state = ['public','private']
    }
    Project.find({})
        .where('isPublic')
        .equals(true)
        .populate({
            path: 'cathegories',
            select: 'name _id',
        })
        .populate({
            path: 'docs',

        })
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .populate({
            path: 'voter',
            select: 'name _id url bio short_bio',
            populate: { path: 'image socials' },
            match: { state: { $in:  state }} ,
        })
        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            if (!results) {
                res.send({ status: true, projects: [], continue: false });
            }
            req.session.currentProject = 0;
            if (results.length > 15) {
                req.session.currentProject = 15;
                return res.send({ status: true, projects: results.slice(0, 15), continue: true });
            }
            return res.send({ status: true, projects: results, continue: false });
        });
};
exports.findAllNext = (req, res) => {
    let state = ['public'];
    if(req.session.auth){
        state = ['public','private']
    }
    Project.find({})
        .where('isPublic')
        .equals(true)
        .populate({
            path: 'cathegories',
            select: 'name _id',
        })
        .populate({
            path: 'docs',

        })
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .populate({
            path: 'voter',
            select: 'name _id email bio short_bio',
            populate: { path: 'image socials' },
            match: { state: { $in:  state }} ,
        })
        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            if (!results) {
                res.send({ status: true, projects: [], continue: false });
            }
            if (results.length >= req.session.currentProject) {
                if (results.length < (req.session.currentProject + 15)) {
                    res.send({ status: true, projects: results.slice(req.session.currentProject, results.length), continue: false });
                    return req.session.currentProject = results.length;
                }
                res.send({ status: true, projects: results.slice(req.session.currentProject, req.session.currentProject + 15), continue: true });
                return req.session.currentProject = req.session.currentProject + 15;
            }
            return res.send({ status: false, errors: 'message limit excced' });
        });
};
exports.findAll = function (req, res) {
    Project.find({})
        .where('isPublic')
        .equals(true)
        .populate({
            path: 'cathegories',
            select: 'name _id',
        })
        .populate({
            path: 'docs',

        })
        .populate({
            path: 'voter',
            select: 'name _id email',
            populate: { path: 'image socials' },
        })
        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }

            return res.send(results);
        });
};
exports.my = function (req, res) {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    return Project.find({})
        .where('voter')
        .equals(req.session.auth._id)
        .where('isPublic')
        .equals(false)
        .where('state')
        .equals('new')
        .populate({
            path: 'cathegories',
            select: 'name _id',
        })
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .populate({
            path: 'docs',

        })
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
                return res.send({ status: null, errors: err });
            }

            return res.send(results);
        });
};
exports.mySubmit = function (req, res) {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    return Project.find({})
        .where('voter')
        .equals(req.session.auth._id)
        .where('isPublic')
        .equals(false)
        .where('state')
        .in(['toBeValidate','refused'])
        .populate('cathegories')
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .populate({
            path: 'docs',

        })
        .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
                return res.send({ status: null, errors: err });
            }

            return res.send(results);
        });
};
exports.findById = function (req, res) {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    const { id } = req.params;
    Project
        .findById(id)
        .where('voter').equals(req.session.auth._id)
        .populate({
            path: 'cathegorie',
            select: 'name _id',
        })
        .populate({
            path: 'image',
            select: 'src name _id',
        })
        .populate({
            path: 'voter',
            select: 'name short_description description _id url email',
            populate: { path: 'image' },
        })
        .lean(true)
        .exec((err, result) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get user 200ok');
            if (result) {
                return res.send(result);
            }
            res.send([]);
        });
};
exports.add = function (req, res) {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: { auth: 'AuhtError' } });
    }
    let errors = {};
    if (!req.body.short_description) {
        errors.short_description = 'required';
    }
    if (!req.body.name) {
        errors.name = 'required';
    }
    if (!req.body.cathegories || req.body.cathegories.length === 0) {
        errors.cathegories = 'required';
    }
    if (errors.name || errors.short_description || errors.cathegories) {
        return res.send({ status: false, errors });
    }
    const cathegories = [];
    for (const c of req.body.cathegories) {
        cathegories.push(new mongoose.Types.ObjectId(c));
    }
    
    const date = new Date();
    return Project.create({
        url: `${removeSpace(req.body.name) + mintoken.generate().substr(0, 100)}pt`,
        name: req.body.name,
        cathegories,
        short_description: req.body.short_description,
        description: req.body.description || '',
        description: req.body.description_html || '',
        time_create: date,
        time_update: date,
        voter: mongoose.Types.ObjectId(req.session.auth._id),
        image: new mongoose.Types.ObjectId(),
    }, (err, result1) => {
        if (err) {
            console.log('localhost:3000->db error 503');
            return res.send({ status: null, errors: err });
        }


        return res.send({ status: true, project: result1 });
    });
};
exports.update = function (req, res) {
    const { id } = req.params;
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV !== 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: 'AuhtError' });
    }
    const errors = {};
    if (!req.body.short_description) {
        errors.name = 'required';
    }
    if (!req.body.short_description) {
        errors.short_description = 'required';
    }
    if (errors.name || errors.short_description) {
        return res.send({ status: false, errors });
    }
    return Project.findOne({ _id: id }).populate('image').populate('voter').exec((err, result) => {
        if (err) {
            console.log('localhost:3000->db error 504');
        }
        let isAdmin = false;
        console.log('localhost:3000->get user 200ok');
        if (`${ result.voter._id}` != req.session.auth._id) {
            if (req.session.auth.type == 'VOTER' || !result.isPublic ) {
                return res.send({ status: false, errors: { permission: 'Deniet' } });
            }
            if (result.state == 'end' ) {
                return res.send({ status: false, errors: { permission: 'Deniet' } });
            }
            //send notif
            isAdmin = true;
        }
        const project = {};
        if (req.body.name) {
            project.name = req.body.name;
        }
        if (req.body.description) {
            project.description = req.body.description;
        }
        if (req.body.description_html) {
            project.description_html = req.body.description_html;
        }
        if (req.body.short_description) {
            project.short_description = req.body.short_description;
        }
        if (req.body.cathegories) {
            project.cathegories = req.body.cathegories;
        }
        project.time_update = new Date();
        return result.updateOne(project, (err) => {
            if (err) {
                return res.send({ status: false, errors: err });
            }
            if(result.isPublic){
                let date = new Date();
                const notif = {
                        time_create: date,
                        time_update: date,
                        url: result.url,
                        read: false,
                        type: 'update',
                        project: result._id,
                        target: result.voter,
                    };
                let mail = mailTemplate.getTemplate('activity');
                mail.subject = res.__('project_update.subject',result.name);
                
                mail.html = mail.html
                    .replace('<%the%>', res.__('the'))
                    .replace('<%and%>', res.__('and'))
                    .replace('<%on%>', res.__('on'))
                    .replace('<%follow%>', res.__('follow'))
                    .replace('<%home%>', res.__('home'))
                .replace('<%title%>', res.__('project_update.title', result.short_description))
                            .replace('<%url%>', `${process.env.BASE_URL}project/${result.url}`)
                    .replace('<%description%>', res.__('project_update.i_update', result.description))
                sendMailOrNotification(mail, notif, { followers: true, ignore: [req.session.auth._id] }, {
                    names: ['project'],
                    data: {
                        project,
                    },
                });
                Event.create({
                    type: 'project',
                    time_create: date,
                    link: project.url,
                    time_update: date,
                    language: req.getLocale(),
                    tags: 'project,project_update',
                    title: res.__('project_update.i_t_update', result.name),
                    description: res.__('project_update.n_description',result.short_description, result.description),
                    document: result.image._id,
                }).then((event)=>{
                    let t= event;
                    t.document = result.image;
                    io.emit('newEvent', t)       
                })
                
                io.emit('synproject', req.session.id)
            }else{
                
                gIo.of('/voter/'+result.voter._id).emit('synproject')
            }
            return res.send({ status: true });
        });
    });
};
exports.delete = function (req, res) {
    const { id } = req.params;
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: null, erros: { permission: 'AuhtError' } });
    }
    return Project.findOne({ _id: id }).exec((err, result) => {
        if (err) {
            console.log('localhost:3000->db error 504');
            return res.send({ status: null, erros: err });
        }
        console.log('localhost:3000->get user 200ok');
        if (result) {
            if (result.voter != req.session.auth._id && !result.isPublic) {
                return res.send({ status: false, errors: { permission: 'Deniet' } });
            }

            if (result.isPublic && req.session.auth.type === 'VOTER') {
                return res.send({ status: false, errors: { permission: 'Deniet' } });
            }
            return result.remove((err) => {
                if (err) {
                    console.log('localhost:3000->db error 504');
                    return res.send({ status: null, erros: err });
                }
                return res.send({ status: true });
            });
        }
        return res.send({ status: false });
    });
};
