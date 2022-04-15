/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable func-names */
const mongoose = require('mongoose');

const axios = require('axios');


const Doc = mongoose.model('Doc');
const Event = mongoose.model('Event');
const Voter = mongoose.model('Voter');
const Notification = mongoose.model('Notification');
const SocialLink = mongoose.model('SocialLink');
const tokenGenerator = require('uuid-token-generator');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const token = new tokenGenerator(512);
const mintoken = new tokenGenerator(128);
const fs = require('fs');
const path = require('path');
const i18n = require('i18n');
const { downloadImage } = require('../util/image');

const { mailApi } = require('../util/mail');
const mailTemplate = require('../util/mailTemplateManager');
const { removeSpace, timeToString } = require('../util/fonctions');
const { userImg } = require('../config/defaultImg');
const { get, getDynamic } = require('./socketmanage');
const SOCIALS = require('../config/socials');

const io = get();
const dynamicNsp = getDynamic();
const { sendMailOrNotification } = require('../util/notifOrEmail');


exports.linkedin_lg = (req, res) => {
    if (!req.body.code){
        console.log('pas de code');
        return res.send(
            { 
                status: false, 
                errors: { code: 'required' }, 
            }      
        );
    }
    const data = `?grant_type=authorization_code&code=${req.body.code}&redirect_uri=${process.env.BASE_URL}api/auth/linkedin&client_id=77xuqu4grt8i7r&client_secret=${process.env.LINKEDIN_CLIENT_SECRETE}`;
    
    
    axios.post('https://www.linkedin.com/oauth/v2/accessToken' + data,'',{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then((rep) => {
        
        res.send({ status: true, data: rep.data });
    }).catch((err) => {
        
        res.send({ status: false, errors: err });
    });
};
exports.adminGetAll = function(req, res){
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, message: 'AuhtError' });
    }
    if (req.session.auth.type != 'SUPERUSER') return res.send({ status: false, errors: 'Permission' });
    Voter.find({})
        
        
        .populate('image')
        .populate('socials')
        .select('name url type roleLevel email image bio short_bio')
        // .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            return res.send(results);
        });
}
exports.updateType = async function(req, res){
     if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, message: 'AuhtError' });
    }
    if (req.session.auth.type != 'SUPERUSER') return res.send({ status: false, errors: 'Permission' });
    try{
        let ok = await Voter.updateOne({_id: req.params.id}, { type: req.body.role, roleLevel: 2})
        res.send({ status: true })
    }catch(err){
        res.send({ status: false, errors: err });
    }
        
}
exports.adminDelete = async function(req, res){
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, message: 'AuhtError' });
    }
    if (req.session.auth.type != 'SUPERUSER') return res.send({ status: false, errors: 'Permission' });
    Voter.deleteOne({ _id: req.params.id }, (err) => {
        if (!err) {
            
            return res.send({ status: true });
        }
        console.log('localhost:3000->db error 504');
        return res.send({ status: null, message: err });
    });
}
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return userid;
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
  }
exports.findAll = function (req, res) {
    let states = ['public'];
    if (req.session.auth) {
        states = ['public', 'private'];
    }
    Voter.find({})
        .where('isVerify', true)
        .where('type').in(['ADMIN','VOTER'])
        .where('state').in(states)
        .populate('image')
        .populate('socials')
        .select('name url  image bio short_bio')
        // .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            return res.send(results);
        });
};
exports.findAllStart = (req, res) => {
    let states = ['public'];
    if (req.session.auth) {
        states = ['public', 'private'];
    }
    Voter.find({})
        .where('isVerify', true)
        .where('state').in(states)
        .populate('image')
        .populate('socials')
        .select('name  url bio bio_html short_bio')
        // .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            if (!results) {
                res.send({ status: true, voters: [], continue: false });
            }
            req.session.currentVoter = 0;
            if (results.length > 15) {
                req.session.currentVoter = 15;
                return res.send({ status: true, voters: results.slice(0, 15), continue: true });
            }
            return res.send({ status: true, voters: results, continue: false });
        });
    
};
exports.findAllNext = (req, res) => {
    let states = ['public'];
    if (req.session.auth) {
        states = ['public', 'private'];
    }
    Voter.find({})
        .where('isVerify', true)
        .where('state').in(states)
        .populate('image')
        .populate('socials')
        .select('name url bio bio_html short_bio')
        // .lean(true)
        .exec((err, results) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            if (!results) {
                res.send({ status: true, voters: [], continue: false });
            }
            if (results.length >= req.session.currentVoter) {
                if (results.length < (req.session.currentVoter + 15)) {
                    res.send({ status: true, voters: results.slice(req.session.currentVoter, results.length), continue: false });
                    return req.session.currentVoter = results.length;
                }
                res.send({ status: true, voters: results.slice(req.session.currentVoter, req.session.currentVoter + 15), continue: true });
                return req.session.currentVoter = req.session.currentVoter + 15;
            }
            return res.send({ status: false, errors: 'message limit excced' });
        });
    
};
exports.findById = function (req, res) {
    const { id } = req.params;
    let states = ['public'];
    if (req.session.auth) {
        states = ['public', 'private'];
    }
    Voter.findOne({ _id: id })
        .where('isVerify', true)
        .where('state').in(states)
        .populate({
            path: 'image',
            select: 'name src _id',
        })
        .populate({
            path: 'socials',
        })
        .select('name email url roleLevel short_bio bio bio_html')
        // .lean(true)
        .exec((err, result) => {
            if (err) {
                console.log('localhost:3000->db error 504');
            }
            console.log('localhost:3000->get users 200ok');
            if (result) return res.send(result);
            res.send({});
        });
};
exports.add = function (req, res) {
    const errors = {};
    if (!req.body.name) {
        errors.name = 'required';
    } else if (req.body.name.length < process.env.NAME_MIN_LENGTH) {
        errors.name = 'short';
    }
    if (!req.body.email) {
        errors.email = 'required';
    } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)) {
        errors.email = 'invalid';
    }
    if (!req.body.password) {
        errors.password = 'required';
    } else if (req.body.password.length < process.env.PASSWORD_MIN_LENGTH) {
        errors.password = 'short';
    }
    if (errors.email || errors.name || errors.password) return res.send({ status: false, errors });

    return Voter.findOne({ email: req.body.email }, (err, results) => {
        if (err) {
            console.log('localhost:3000->db error 503');
            return res.send({ status: null, errors: err });
        }
        if (results && results.isVerify) {
            console.log('localhost:3000->add user fallure account is taked');
            return res.send({ status: false, message: 'CompteTaked' });
        }
        SocialLink.create(SOCIALS).then((docsS) => {
            const socials = [];
            for (const link of docsS) {
                socials.push(link._id);
            }
            const date = new Date();
            const tokenExpire = date;
            const usertoken = token.generate();
            tokenExpire.setHours(date.getHours() + 2);
            if (results) {
                Voter.updateOne({ _id: results._id }, {
                    socials,
                    url: removeSpace(req.body.name) + mintoken.generate(),
                    name: req.body.name,
                    email: req.body.email,
                    code: mintoken.generate(),
                    password: req.body.password,
                    time_create: date,
                    time_update: date,
                    token: usertoken,
                    token_validity: tokenExpire,
                    image: new mongoose.Types.ObjectId(),
                    language: req.getLocale(),
                }, (err1, result1) => {
                    if (err1) {
                        console.log('localhost:3000->db error 503');
                        return res.send({ status: null, errors: err1 });
                    }
                    fs.mkdirSync(path.join(__dirname, '../images', `${result1._id}`));
                    const pt = `${result1._id}/${removeSpace(result1.name) + timeToString(date)}.${userImg.type}`;
                    fs.copyFileSync(path.join(__dirname, '../images', `${userImg.name}.${userImg.type}`), path.join(__dirname, '../images', pt));
                    Doc.create({
                        time_create: date,
                        time_update: date,
                        name: req.body.name,
                        src: pt,
                        state: 'public',
                        type: userImg.type,
                        voter: result1._id,
                        cathegorie: 'image',
                    }, (err2, good2) => {
                        if (good2) {
                            Voter.updateOne({ _id: result1._id }, { image: good2._id }, (err, ok) => {
                                if (err) console.log(err);
                            });
                        }
                    });
                    const mail = mailTemplate.getTemplate('verificationEmail');
                    mail.subject = res.__('verificationEmail.subject', process.env.APP_NAME);
                    mail.html = mail.html
                        .replace('<%title%>', res.__('verificationEmail.title', req.body.name))
                        .replace(
                            '<%description%>',
                            res.__('verificationEmail.description', req.body.name)
                        )
                        .replace('<%follow%>', res.__('follow'))
                        .replace('<%and%>', res.__('and'))
                        .replace('<%the%>', res.__('the'))
                        .replace('<%on%>', res.__('on'))
                        .replace('<%home%>', res.__('home'))
                        .replace('<%reason%>', res.__('verificationEmail.reason'))
                        .replace('<%btn%>', res.__('verificationEmail.btn'))
                        .replace(
                            '<%link%>',
                            `${process.env.BASE_URL}api/voter/tokenverify/${result1._id}/${usertoken}/`
                        );
                    mailApi(req.body.email, mail).catch(console.error());

                    return res.send({
                        status: true,
                        voter: {
                            _id: result1._id,
                            name: result1.name,
                            email: result1.email,
                            isVerify: result1.isVerify,
                        },
                    });
                    // send email verify token
                });
                return;
            }
            Voter.create({
                socials,
                url: removeSpace(req.body.name) + mintoken.generate(),
                name: req.body.name,
                email: req.body.email,
                code: mintoken.generate(),
                password: req.body.password,
                time_create: date,
                time_update: date,
                token: usertoken,
                token_validity: tokenExpire,
                image: new mongoose.Types.ObjectId(),
                language: req.getLocale(),
            }, (err1, result1) => {
                if (err1) {
                    console.log('localhost:3000->db error 503');
                    return res.send({ status: null, errors: err1 });
                }
                fs.mkdirSync(path.join(__dirname, '../images', `${result1._id}`));
                const pt = `${result1._id}/${removeSpace(result1.name) + timeToString(date)}.${userImg.type}`;
                fs.copyFileSync(path.join(__dirname, '../images', `${userImg.name}.${userImg.type}`), path.join(__dirname, '../images', pt));
                Doc.create({
                    time_create: date,
                    time_update: date,
                    name: req.body.name,
                    src: pt,
                    state: 'public',
                    type: userImg.type,
                    voter: result1._id,
                    cathegorie: 'image',
                }, (err2, good2) => {
                    if (good2) {
                        Voter.updateOne({ _id: result1._id }, { image: good2._id }, (err, ok) => {
                            if (err)console.log(err);
                        });
                    }
                });
                const mail = mailTemplate.getTemplate('verificationEmail');
                mail.subject = res.__('verificationEmail.subject', process.env.APP_NAME);
                mail.html = mail.html
                    .replace('<%title%>', res.__('verificationEmail.title', req.body.name))
                    .replace(
                        '<%description%>',
                        res.__('verificationEmail.description', req.body.name)
                    )
                    .replace('<%follow%>', res.__('follow'))
                    .replace('<%and%>', res.__('and'))
                    .replace('<%the%>', res.__('the'))
                    .replace('<%on%>', res.__('on'))
                    .replace('<%home%>', res.__('home'))
                    .replace('<%reason%>', res.__('verificationEmail.reason'))
                    .replace('<%btn%>', res.__('verificationEmail.btn'))
                    .replace(
                        '<%link%>',
                        `${process.env.BASE_URL}api/voter/tokenverify/${result1._id}/${usertoken}/`
                    );
                mailApi(req.body.email, mail).catch(console.error());

                return res.send({
                    status: true,
                    voter: {
                        _id: result1._id,
                        name: result1.name,
                        email: result1.email,
                        isVerify: result1.isVerify,
                    },
                });
            // send email verify token
            });
        }).catch((rerr) => {
            res.send({ status: false });
        });
    });
};
exports.toggleState = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, message: 'AuhtError' });
    }
    Doc.updateOne({ _id: req.session.auth.image._id }, { state: req.body.state });
    Voter.updateOne({ _id: req.session.auth._id }, { state: req.body.state }, (err, ok) => {
        if (err) {
            console.log('localhost:3000->db error 504');
            return res.send({ status: null, errors: err });
        }
        req.session.auth.state = req.body.state;
        return res.send({ status: true, state: req.body.state });
    });
};
exports.toggleMailNotificationPermission = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, message: 'AuhtError' });
    }
    Voter.updateOne({ _id: req.session.auth._id }, { mailNotificationPermission: req.body.mailNotificationPermission }, (err, ok) => {
        if (err) {
            console.log('localhost:3000->db error 504');
            return res.send({ status: null, errors: err });
        }
        req.session.auth.mailNotificationPermission = req.body.mailNotificationPermission;
        return res.send({ status: true, mailNotificationPermission: req.body.mailNotificationPermission });
    });
};
exports.updatePassword = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, message: 'AuhtError' });
    }
    if (!req.body.password || req.body.password.length < process.env.PASSWORD_MIN_LENGTH) {
        return res.send({ status: false, errors: 'PASSWORDTOOSHORT' });
    }
    Voter.findOne({ _id: req.session.auth._id, password: req.body.oldPassword }).exec((err, voter) => {
        if (err) {
            console.log('localhost:3000->db error 504');
            return res.send({ status: null, errors: err });
        }
        if (!voter) {
            return res.send({ status: false, errrors: 'didn\'t match' });
        }
        voter.password = req.body.password;
        voter.code = mintoken.generate();
        
        io.of('/voter/' + voter._id).emit('securityLogout', { ignore: req.session });
        voter.save().then((ok) => {
            res.send({ status: true });
        }).catch(err2 => res.send({ status: null, errors: err2 }));
    });
};
exports.update = function (req, res) {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, message: 'AuhtError' });
    }

    
        return Voter.update({ _id: req.session.auth._id }, {
            name: req.body.name,
            
            time_update: new Date(),
            short_bio: req.body.short_bio,
            bio: req.body.bio,
            bio_html: req.body.bio_html,
            location: req.body.location,

        }).exec((err, result) => {
            if (err) {
                console.log('localhost:3000->db error 504');
                return res.send({ status: null, errors: err });
            }
            req.session.auth.short_bio = req.body.short_bio,
            req.session.auth.bio = req.body.bio,
            req.session.auth.name = req.body.name,
            req.session.auth.location = req.body.location;
            
            console.log('localhost:3000->user update 200ok');
            return res.send({ status: true, voter: req.session.auth });
        });
    
    
};
exports.delete = function (req, res) {
    if (typeof (req.session.auth) === 'undefined') {
        return res.send({ status: null, message: 'AuhtError' });
    }
    Voter.deleteOne({ _id: req.session.auth._id }, (err) => {
        if (!err) {
            req.session.auth = undefined;
            return res.send({ status: true });
        }
        console.log('localhost:3000->db error 504');
        return res.send({ status: null, message: err });
    });
};
exports.verify = function (req, res) {
    const { id } = req.params;
    const usertoken = req.params.token;
    Voter.findOne({ _id: id }).populate('image').populate('socials').exec((err, result) => {
        if (err) {
            res.cookie('errors', res.__('verify.error'));
            res.cookie('status', 'false');
            return res.redirect('/emailverificationstatus');
        }
        if (!result) {
            res.cookie('errors', res.__('verify.u_notfound'));
            res.cookie('status', 'false');
            return res.redirect('/emailverificationstatus');
        }
        res.cookie('voter', result.email);
        if (result.isVerify) {
            res.cookie('errors', res.__('verify.verifed'));
            res.cookie('status', 'false');

            return res.redirect('/emailverificationstatus');
        }
        if (usertoken !== result.token) {
            res.cookie('errors', res.__('verify.t_d_match'));
            res.cookie('status', 'false');
            return res.redirect('/emailverificationstatus');
        }
        const b = new Date();
        if (b > result.token_validity) {
            res.cookie('errors', res.__('verify.t_v_expired'));
            res.cookie('status', 'false');
            return res.redirect('/emailverificationstatus');
        }
        Voter.update({ _id: id }, { time_update: new Date(), isVerify: true }, (err, result2) => {
            if (err) {
                console.log('localhost:3000->db error 504');
                res.cookie('errors', JSON.stringify(err));
                res.cookie('status', 'false');
                return res.redirect('/emailverificationstatus');
            }
            // sokect message because account status changed
            const date = new Date();
            Voter.countDocuments({ }, (err, count) => {
                Event.create({
                    type: 'voter',
                    time_create: date,
                    link: result.url,
                    time_update: date,
                    title: res.__('welcome.title', result.name),
                    description: res.__('welcome.description', count),
                    document: result.image._id,
                })
                    .then((data) => {
                        dynamicNsp.emit('newEvent', {
                            type: 'voter',
                            time_create: date,
                            link: result.url,
                            time_update: date,
                            title: res.__('welcome.title', result.name),
                            description: res.__('welcome.description', count),
                            document: result.image,
                        });

                        const notif = {
                            time_create: date,
                            time_update: date,
                            url: result.url,
                            read: false,
                            voter: result._id,
                        };
                        Notification
                            .create({
                                time_create: date,
                                time_update: date,
                                url: result.url,
                                read: false,
                                type: 'welcomeMessage',
                                voter: result._id,
                                target: result._id,
                            });
                        let mail = mailTemplate.getTemplate('newUserMessage');
                        mail.subject = req.__('newUserMessage.subject', process.env.APP_NAME);
                        mail.html = mail.html
                            .replace(
                                '<%title%>',
                                req.__('welcome.title', result.name)
                            )
                            .replace(
                                '<%description%>',
                                req.__('welcome.description', count)
                            )
                            .replace(
                                '<%profil%>',
                                `${process.env.BASE_URL}in/${result.url}`
                            )
                            .replace(
                                '<%url%>',
                                `${process.env.BASE_URL}in/${result.url}`
                        )
                            .replace('<%the%>', res.__('the'))
                            .replace('<%follow%>', res.__('follow'))
                            .replace('<%and%>', res.__('and'))
                            .replace('<%on%>', res.__('on'))
                            .replace('<%home%>', res.__('home'))
                            .replace(
                                '<%image%>',
                                `${process.env.BASE_URL}api/img/${result.image.src}`
                            );
                        sendMailOrNotification(mail, notif, { single: false, ignore: [result._id] }, {
                            names: ['voter'],
                            data: {
                                voter: {
                                    image: result.image,
                                    _id: result._id,
                                    url: result.url,
                                    name: result.name,
                                },
                            },
                        });
                        mail = mailTemplate.getTemplate('welcomeToNewUser');
                        mail.subject = res.__('welcomeToNewUser.subject', result.name, process.env.APP_NAME);
                        mail.html = mail.html.replace('<%title%>', res.__('welcomeToNewUser.title', process.env.APP_NAME, result.name))
                            .replace('<%the%>', req.__('the'))
                            .replace('<%follow%>', req.__('follow'))
                            .replace('<%and%>', req.__('and'))
                            .replace('<%on%>', req.__('on'))
                            .replace('<%home%>', req.__('home'))
                            .replace('<%description%>', res.__('welcomeToNewUser.description', result.name));
                        mailApi(result.email, mail).catch(console.error());
                    }).catch(console.error);
            });

            res.cookie('status', 'true');
            res.redirect('/emailverificationstatus');
        });
    });
};
exports.numMembers = (req, res) => {
    Voter.countDocuments({ isVerify: true }, (err, count) => {
        if (err) return res.send({ status: false });
        res.send({ status: true, nb: count });
    });
};
exports.retryverify = function (req, res) {
    Voter.findOne({ email: req.body.email }, (err, result) => {
        if (err) {
            return res.send({ status: null, message: res.__('retryverify.error') });
        }
        if (!result) {
            return res.send({ status: false, message: res.__('retryverify.u_notfound') });
        }
        if (result.isVerify) {
            return res.send({ status: false, message: res.__('retryverify.a_verifed') });
        }

        if ((new Date() - result.token_validity) > (1000 * 3600 * 2)) {
            const mail = mailTemplate.getTemplate('verificationEmail');
            mail.subject = res.__('verificationEmail.subject',process.env.APP_NAME);
            mail.html = mail.html
                .replace('<%description%>', res.__('verificationEmail.description', result.name))
                .replace('<%title%>', res.__('verificationEmail.title', result.name))
                .replace('<%reason%>', res.__('verificationEmail.reason'))
                .replace('<%btn%>', res.__('verificationEmail.btn'))
                .replace('<%follow%>', req.__('follow'))
                .replace('<%and%>', req.__('and'))
                .replace('<%the%>', req.__('the'))
                .replace('<%on%>', req.__('on'))
                .replace('<%home%>', req.__('home'))
                .replace('<%link%>', `${process.env.BASE_URL}api/voter/tokenverify/${result._id}/${result.token}`);
            return mailApi(result.email, mail).then(() => {
                res.send({ status: true });
            }).catch((err) => {
                console.log(err);
                res.send({ status: false, message: err });
            });
        }
        const tokenExpire = new Date();
        tokenExpire.setHours(tokenExpire.getHours() + 2);
        const usertoken = token.generate();
        Voter.update({ _id: result._id }, { time_update: new Date(), token: usertoken, token_validity: tokenExpire }, (err, result2) => {
            if (err) {
                console.log('localhost:3000->db error 504');
                return res.send({ status: null, message: err });
            }
            const mail = mailTemplate.getTemplate('verificationEmail');
            mail.subject = res.__('verificationEmail.subject', process.env.APP_NAME);
            mail.html = mail.html
                .replace('<%description%>', res.__('verificationEmail.description', result.name))
                .replace('<%title%>', res.__('verificationEmail.title', result.name))
                .replace('<%reason%>', res.__('verificationEmail.reason'))
                .replace('<%btn%>', res.__('verificationEmail.btn'))
                .replace('<%follow%>', res.__('follow'))
                .replace('<%and%>', res.__('and'))
                .replace('<%the%>', req.__('the'))
                .replace('<%on%>', res.__('on'))
                .replace('<%home%>', res.__('home'))
                .replace('<%link%>', `${process.env.BASE_URL}api/voter/tokenverify/${result._id}/${usertoken}/`);

            mailApi(req.body.email, mail).then(( infos) => {
                if (infos.rejected.length != 0) {
                    console.log(infos);
                    return res.send({ status: null, errors: infos });
                }
                res.send({ status: true });
            });
        });
    });
};
exports.synData = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, message: 'AuhtError' });
    }
    Voter.findOne({ _id: req.session.auth._id }).populate({
        path: 'image',
        select: 'type name src _id',
    }).populate('socials').exec((err, result) => {
        if (err) {
            return res.send({ status: false, errors: err });
        }
        req.session.auth = {
            _id: result._id,
            name: result.name,
            email: result.email,
            isVerify: result.isVerify,
            state: result.state,
            type: result.type,
            url: result.url,
            roleLevel: result.roleLevel,
            time_create: result.time_create,
            time_update: result.time_update,
            image: result.image,
            code: result.code,
            mailNotificationPermission: result.mailNotificationPermission,
            short_bio: result.short_bio,
            bio: result.bio,
            bio_html: result.bio_html,
            socials: result.socials,
            location: result.location,
            language: result.language,
        };
        return res.send({ status: true, voter: req.session.auth });
    });
};
exports.login = function (req, res) {
    if (req.body.name) {
        return Voter.findOne({ name: req.body.name, password: req.body.password }).populate({
            path: 'image',
            select: 'type name src _id',
        }).populate('socials').exec((err, result) => {
            if (err) {
                console.log('localhost:3000->db error 504');
                return res.send({ status: null, errors: err });
            }
            if (result) {
                if (result.isVerify) {
                    req.session.auth = {
                        _id: result._id,
                        name: result.name,
                        email: result.email,
                        isVerify: result.isVerify,
                        state: result.state,
                        type: result.type,
                        url: result.url,
                        roleLevel: result.roleLevel,
                        time_create: result.time_create,
                        time_update: result.time_update,
                        image: result.image,
                        code: result.code,
                        mailNotificationPermission: result.mailNotificationPermission,
                        short_bio: result.short_bio,
                        bio: result.bio,
                        bio_html: result.bio_html,
                        socials: result.socials,
                        location: result.location,
                        language: result.language,
                    };
                    i18n.setLocale([req, res.locals], result.language);
                    console.log('localhost:3000->user login 200ok');

                    return res.send({
                        status: true,
                        voter: req.session.auth,
                    });
                }
                return res.send({
                    status: null,
                    errors: 'EMAILNOTVERIFY',
                    email: result.email,
                });
            }
            console.log('localhost:3000->authentification fallure');
            return res.send({ status: false, errors: 'AuthError' });
        });
    }
    if (req.body.email) {
        Voter.findOne({ email: req.body.email, password: req.body.password }).populate({
            path: 'image',
            select: 'name src _id',
        }).populate('socials').exec((err, result) => {
            if (err) {
                console.log('localhost:3000->db error 504');
                return res.send({ status: null, errors: err });
            }
            if (result) {
                if (result.isVerify) {
                    req.session.auth = {
                        _id: result._id,
                        name: result.name,
                        email: result.email,
                        isVerify: result.isVerify,
                        state: result.state,
                        type: result.type,
                        url: result.url,
                        roleLevel: result.roleLevel,
                        time_create: result.time_create,
                        time_update: result.time_update,
                        image: result.image,
                        code: result.code,
                        mailNotificationPermission: result.mailNotificationPermission,
                        short_bio: result.short_bio,
                        bio: result.bio,
                        bio_html: result.bio_html,
                        socials: result.socials,
                        location: result.location,
                        language: result.language,
                    };
                    i18n.setLocale([req, res.locals], result.language);
                    console.log('localhost:3000->user login 200ok');

                    return res.send({
                        status: true,
                        voter: req.session.auth,
                    });
                }
                return res.send({
                    status: null,
                    errors: 'EMAILNOTVERIFY',
                    email: result.email,
                });
            }
            console.log('localhost:3000->authentification fallure');
            return res.send({ status: false, errors: 'AuthError' });
        });
    }
};

exports.logout = function (req, res) {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.send({ status: null, errors: err });
            }
            console.log('localhost:3000->user logout');
            return res.send({ status: true });
        });
    } catch (err) {
        req.session.auth = null;
        return res.send({ status: true });
    }
};

exports.googleLogin = (req, res) => {
    let tk = (req.body.Zi)?req.body.Zi.id_token:(req.body.wc)?  req.body.wc.id_token: '';
    verify(tk).then((doc) => {
        if (doc) {
            const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${tk}`;
            axios.get(url).then((rep) => {

                if (!rep.data.email_verified) return res.send({ status: false });
                if (rep.data.email) {
                    Voter.findOne({ email: rep.data.email }).populate({
                        path: 'image',
                        select: 'type name src _id',
                    }).populate('socials').exec((err, voter) => {
                        if (err) {
                            return res.send({ status: null, errors: err });
                        }
                        if (voter) {
                            req.session.auth = {
                                _id: voter._id,
                                name: voter.name,
                                email: voter.email,
                                isVerify: voter.isVerify,
                                state: voter.state,
                                type: voter.type,
                                url: voter.url,
                                roleLevel: voter.roleLevel,
                                time_create: voter.time_create,
                                time_update: voter.time_update,
                                image: voter.image,
                                code: voter.code,
                                mailNotificationPermission: voter.mailNotificationPermission,
                                short_bio: voter.short_bio,
                                bio: voter.bio,
                                bio_html: voter.bio_html,
                                socials: voter.socials,
                                location: voter.location,
                                language: voter.language,
                            };
                            i18n.setLocale([req, res.locals], voter.language);
                            return res.send({ status: true, voter: req.session.auth });
                        }
                        
                        let s = SOCIALS;
                        
                        SocialLink.create(s).then((docsS) => {
                            router.afterEach((to, from) => {
                                
                            }); socials = [];
                            for (const link of docsS) {
                                socials.push(link._id);
                            }
        
                            const date = new Date();
                            Voter.create({
                                    url: removeSpace(rep.data.name) + mintoken.generate(),
                                    name: rep.data.name,
                                    email: rep.data.email,
                                    password: '',
                                    time_create: date,
                                    time_update: date,
                                    isVerify: true,
                                    code: mintoken.generate(),
                                    image: new mongoose.Types.ObjectId(),
                                    socials,
                                    language: req.getLocale(),
                                }).then((rep2) => {
                                    req.session.auth = {
                                        _id: rep2._id,
                                        name: rep2.name,
                                        email: rep2.email,
                                        isVerify: rep2.isVerify,
                                        state: rep2.state,
                                        type: rep2.type,
                                        url: rep2.url,
                                        roleLevel: rep2.roleLevel,
                                        time_create: rep2.time_create,
                                        time_update: rep2.time_update,
                                        code: rep2.code,
                                        mailNotificationPermission: rep2.mailNotificationPermission,
                                        short_bio: rep2.short_bio,
                                        bio: rep2.bio,
                                        socials: s,
                                        location: rep2.location,
                                        language: rep2.language
                                    };
                                    fs.mkdirSync(path.join(__dirname, '../images', `${rep2._id}`));
                                    fs.mkdirSync(path.join(__dirname, '../uploads', `${rep2._id}`));
                                    const pt = `${rep2._id}/${removeSpace(rep2.name) + timeToString(date)}.${userImg.type}`;

                                    fs.copyFileSync(path.join(__dirname, '../images', `${userImg.name}.${userImg.type}`), path.join(__dirname, '../images', pt));
                                    if (rep.data.picture) downloadImage(rep.data.picture,path.join(__dirname,'../images',pt));
                                    Doc.create({
                                        time_create: date,
                                        time_update: date,
                                        name: rep2.name,
                                        src: pt,
                                        state: 'public',
                                        type: userImg.type,
                                        voter: rep2._id,
                                        cathegorie: 'image',
                                    }).then((good2) => {
                                        Voter.updateOne({ _id: rep2._id }, { image: good2._id }, (err, ok) => {
                                            if (err)console.log('image', err);
                                        });
                                        Voter.countDocuments({ isVerify: true }, (err3, count) => {
                                            Event.create({
                                                type: 'voter',
                                                time_create: date,
                                                time_update: date,
                                                link: rep2.url,
                                                tags: 'new_user',
                                                title: res.__('welcome.title', rep2.name),
                                                description: res.__('welcome.description', count),
                                                document: good2._id,
                                            }).then((event) => {
                                                console.log(event);
                                            }).catch((err) => {
                                                console.log(err);
                                            });
        
                                            dynamicNsp.emit('newEvent', {
                                                type: 'voter',
                                                time_create: date,
                                                link: rep2.url,
                                                time_update: date,
                                                title: res.__('welcome.title', rep2.name),
                                                description: res.__('welcome.description', count),
                                                document: good2,
                                            });
                                            const notif = {
                                                time_create: date,
                                                time_update: date,
                                                url: rep2.url,
                                                read: false,
                                                type: 'welcomeMessage',
                                                voter: rep2._id,
                                            };
                                            Notification
                                                .create({
                                                    time_create: date,
                                                    time_update: date,
                                                    url: rep2.url,
                                                    read: false,
                                                    voter: rep2._id,
                                                    target: rep2._id,
                                                }).then(() => {});
                                            let mail = mailTemplate.getTemplate('newUserMessage');
                                            mail.subject = res.__('newUserMessage.subject', process.env.APP_NAME)
                                            mail.html = mail.html
                                                .replace('<%btn%>', res.__('newUserMessage.btn'))
                                                .replace('<%title%>', res.__('welcome.title', rep2.name))
                                                .replace('<%description%>', res.__('welcome.description', count))
                                                .replace('<%profil%>', `${process.env.BASE_URL}in/${rep2.url}`)
                                                .replace('<%url%>', `${process.env.BASE_URL}in/${rep2.url}`)
                                                .replace('<%follow%>', res.__('follow'))
                                                .replace('<%and%>', res.__('and'))
                                                .replace('<%on%>', res.__('on'))
                                                .replace('<%the%>', res.__('the'))
                                                .replace('<%home%>', req.__('home'))
                                                .replace('<%image%>', `${process.env.BASE_URL}api/img/${good2.src}`);
                                            sendMailOrNotification(mail, notif, { single: false, ignore: [rep2._id] },
                                                {
                                                    names: ['voter'],
                                                    data: {
                                                        voter: {
                                                            image: {
                                                                src: pt,
                                                                type: userImg.type,
                                                            },
                                                            name: rep.data.name,
                                                            _id: rep2._id,
                                                            url: rep2.url,
                                                        },
                                                    },
                                                });
                                            mail = mailTemplate.getTemplate('welcomeToNewUser');
                                            mail.subject = res.__('welcomeToNewUser.subject', rep.data.name, process.env.APP_NAME);
                                            mail.html = mail.html
                                                .replace('<%title%>', res.__('welcomeToNewUser.title', process.env.APP_NAME, rep.data.name))
    
                                                .replace('<%follow%>', req.__('follow'))
                                                .replace('<%and%>', req.__('and'))
                                                .replace('<%on%>', req.__('on'))
                                                .replace('<%home%>', req.__('home'))
                                                .replace('<%the%>', res.__('the'))
                                                .replace('<%description%>', res.__('welcomeToNewUser.description', rep.data.name));
                                            mailApi(rep2.email, mail).catch(console.error);
                                            req.session.auth.image = {
                                                name: rep.data.name,
                                                src: pt,
                                                type: userImg.type,
                                            };
                                            
                                           setTimeout(() => {res.send({ status: true, voter: req.session.auth });},150);  
                                        });
                                    });
                                   
                                    
                                }).catch((err) => {
                                    
                                    res.send({ status: false, errors: err });
                            });
                        }).catch((rerr) => {
                            res.send({ status: false });
                        });
                    });
                } else {
                    res.send({ status: false });
                }
                
            }).catch((err) => {
                res.send({ status: false , errors: err });
                console.log(err);
            });
        }
    }).catch((err) => {
        res.send({ status: false , errors: err, message: 'veri', body: req.body });
        
    });
};
exports.linkedinLogin = function(req, res) {
axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',{
    headers: {
        'Authorization': `Bearer ${req.body.access_token}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }  
}).then((rep1) => {

    if (!rep1.data.elements || !rep1.data.elements[0] || !rep1.data.elements[0]['handle~'].emailAddress) {
        return res.send({ status: false });
    }
  
    const email = rep1.data.elements[0]['handle~'].emailAddress;
    axios.get('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',{
        headers: {
            'Authorization': `Bearer ${req.body.access_token}`,
            'cache-control': 'no-cache',
            'X-Restli-Protocol-Version': '2.0.0'
        }  
    }).then((rep) => {
        
        const name = rep.data.firstName.localized[`${rep.data.firstName.preferredLocale.language}_${rep.data.firstName.preferredLocale.country}`] + rep.data.lastName.localized[`${rep.data.lastName.preferredLocale.language}_${rep.data.lastName.preferredLocale.country}`];
        let imgUrl = '';
        for (const image of rep.data.profilePicture['displayImage~'].elements){
            if (image.data['com.linkedin.digitalmedia.mediaartifact.StillImage'].storageSize.width == 800){
                imgUrl = image.identifiers[0].identifier;
            }
        }

        if (!imgUrl){
            try {
                imgUrl = rep.data.profilePicture['displayImage~'].elements[0].identifiers[0].identifier;
            } catch(e){

            }
        }
        if (email) {
            Voter.findOne({ email }).populate({
                path: 'image',
                select: 'type name src _id',
            }).populate('socials').exec((err, voter) => {
                if (err) {
                    res.send({ status: null, errors: err });
                }
                if (voter) {
                    req.session.auth = {
                        _id: voter._id,
                        name: voter.name,
                        email: voter.email,
                        isVerify: voter.isVerify,
                        state: voter.state,
                        type: voter.type,
                        url: voter.url,
                        roleLevel: voter.roleLevel,
                        time_create: voter.time_create,
                        time_update: voter.time_update,
                        image: voter.image,
                        code: voter.code,
                        mailNotificationPermission: voter.mailNotificationPermission,
                        short_bio: voter.short_bio,
                        bio: voter.bio,
                        bio_html: voter.bio_html,
                        socials: voter.socials,
                        location: voter.location,
                        language: voter.language,
                    };
                    i18n.setLocale([req, res.locals], voter.language);
                    return res.send({ status: true, voter: req.session.auth });
                }
                
                const s = SOCIALS;
                
                SocialLink.create(s).then((docsS) => {
                    const socials = [];
                    for (const link of docsS) {
                        socials.push(link._id);
                    }

                    const date = new Date();
                    Voter.create({
                            url: removeSpace(name) + mintoken.generate(),
                            name,
                            email,
                            password: '',
                            time_create: date,
                            time_update: date,
                            isVerify: true,
                            code: mintoken.generate(),
                            image: new mongoose.Types.ObjectId(),
                            socials,
                            language: req.getLocale(),
                        }).then((rep2) => {
                            req.session.auth = {
                                _id: rep2._id,
                                name: rep2.name,
                                email: rep2.email,
                                isVerify: rep2.isVerify,
                                state: rep2.state,
                                type: rep2.type,
                                url: rep2.url,
                                roleLevel: rep2.roleLevel,
                                time_create: rep2.time_create,
                                time_update: rep2.time_update,
                                code: rep2.code,
                                mailNotificationPermission: rep2.mailNotificationPermission,
                                short_bio: rep2.short_bio,
                                bio: rep2.bio,
                                socials: s,
                                location: rep2.location,
                                language: rep2.language
                            };
                            fs.mkdirSync(path.join(__dirname, '../images', `${rep2._id}`));
                            fs.mkdirSync(path.join(__dirname, '../uploads', `${rep2._id}`));                            
                            const pt = `${rep2._id}/${removeSpace(rep2.name) + timeToString(date)}.${userImg.type}`;

                            fs.copyFileSync(path.join(__dirname, '../images', `${userImg.name}.${userImg.type}`), path.join(__dirname, '../images', pt));
                            if (imgUrl) downloadImage(imgUrl,path.join(__dirname,'../images',pt));
                            Doc.create({
                                time_create: date,
                                time_update: date,
                                name: rep2.name,
                                src: pt,
                                state: 'public',
                                type: userImg.type,
                                voter: rep2._id,
                                cathegorie: 'image',
                            }).then((good2) => {
                                Voter.updateOne({ _id: rep2._id }, { image: good2._id }, (err, ok) => {
                                    if (err)console.log('image', err);
                                });
                                Voter.countDocuments({ isVerify: true }, (err3, count) => {
                                    Event.create({
                                        type: 'voter',
                                        time_create: date,
                                        time_update: date,
                                        link: rep2.url,
                                        tags: 'new_user',
                                        title: message.welcome.title.replace('<%userName%>', rep2.name),
                                        description: message.welcome.description.replace('<%numMembers%>', count),
                                        document: good2._id,
                                    }).then((event) => {
                                        console.log(event);
                                    }).catch((err) => {
                                        console.log(err);
                                    });

                                    dynamicNsp.emit('newEvent', {
                                        type: 'voter',
                                        time_create: date,
                                        link: rep2.url,
                                        time_update: date,
                                        title: res.__('welcome.title', rep2.name),
                                        description: res.__('welcome.description', count),
                                        document: good2,
                                    });
                                    const notif = {
                                        time_create: date,
                                        time_update: date,
                                        url: rep2.url,
                                        read: false,
                                        type: 'welcomeMessage',
                                        voter: rep2._id,
                                    };
                                    Notification
                                        .create({
                                            time_create: date,
                                            time_update: date,
                                            url: rep2.url,
                                            read: false,
                                            voter: rep2._id,
                                            target: rep2._id,
                                        }).then(() => {});
                                    let mail = mailTemplate.getTemplate('newUserMessage');
                                    mail.subject = res.__('newUserMessage.subject', process.env.APP_NAME)
                                    mail.html = mail.html
                                        .replace('<%on%>', res.__('on'))
                                        .replace('<%the%>', res.__('the'))
                                        .replace('<%and%>', res.__('and'))
                                        .replace('<%follow%>', res.__('follow'))
                                        .replace('<%home%>', res.__('home'))
                                        .replace('<%title%>', res.__('welcome.title', rep2.name))
                                        .replace('<%description%>', res.__('welcome.description', count))
                                        .replace('<%btn%>', res.__('newUserMessage.btn'))
                                        .replace('<%profil%>', `${process.env.BASE_URL}in/${rep2.url}`)
                                        .replace('<%url%>', `${process.env.BASE_URL}in/${rep2.url}`)
                                        .replace('<%image%>', `${process.env.BASE_URL}api/img/${good2.src}`);
                                    sendMailOrNotification(mail, notif, { single: false, ignore: [rep2._id] },
                                        {
                                            names: ['voter'],
                                            data: {
                                                voter: {
                                                    image: {
                                                        src: pt,
                                                        type: userImg.type,
                                                    },
                                                    name: rep.data.name,
                                                    _id: rep2._id,
                                                    url: rep2.url,
                                                },
                                            },
                                        });
                                    mail = mailTemplate.getTemplate('welcomeToNewUser');
                                    mail.subject = res.__('welcomeToNewUser.subject', rep.data.name, process.env.APP_NAME)
                                    mail.html = mail.html
                                        .replace('<%the%>', res.__('the'))
                                        .replace('<%and%>', res.__('and'))
                                        .replace('<%on%>', res.__('on'))
                                        .replace('<%follow%>', res.__('follow'))
                                        .replace('<%home%>', res.__('home'))
                                        .replace('<%title%>', res.__('welcomeToNewUser.title', process.env.APP_NAME, rep.data.name))
                                        .replace('<%description%>', res.__('welcomeToNewUser.description', process.env.APP_NAME, rep.data.name));
                                    mailApi(rep2.email, mail).catch(console.error);
                                    req.session.auth.image = {
                                        name: rep.data.name,
                                        src: pt,
                                        type: userImg.type,
                                    };
                                    
                                   setTimeout(() => {res.send({ status: true, voter: req.session.auth });},150);  
                                });
                            });
                           
                            
                        }).catch((err) => {
                            
                            res.send({ status: false, errors: err });
                    });
                }).catch((rerr) => {
                    console.log(rerr)
                    res.send({ status: false, errors: rerr });
                });
            });
        } else {
            console.log('\'pas d\'email')
            res.send({ status: false });
        }
        
    }).catch((err) => {
        console.log(err)
        res.send({ status: false, errors: err });
     });  
}).catch((err) => {
    console.log(err)
   res.send({ status: false, errors: err });
});
};
exports.fbLogin = function (req, res) {
    const url = `https://graph.facebook.com/v4.0/me?access_token=${req.body.accessToken}&fields=id%2Clink%2Cname%2Cemail&method=get&pretty=0&sdk=joey&suppress_http_code=1`;
    axios.get(url).then((rep) => {
        if (rep.data.email) {
            Voter.findOne({ email: rep.data.email }).populate({
                path: 'image',
                select: 'type name src _id',
            }).populate('socials').exec((err, voter) => {
                if (err) {
                    res.send({ status: null, errors: err });
                }
                if (voter) {
                    req.session.auth = {
                        _id: voter._id,
                        name: voter.name,
                        email: voter.email,
                        isVerify: voter.isVerify,
                        state: voter.state,
                        type: voter.type,
                        url: voter.url,
                        roleLevel: voter.roleLevel,
                        time_create: voter.time_create,
                        time_update: voter.time_update,
                        image: voter.image,
                        code: voter.code,
                        mailNotificationPermission: voter.mailNotificationPermission,
                        short_bio: voter.short_bio,
                        bio: voter.bio,
                        bio_html: voter.bio_html,
                        socials: voter.socials,
                        location: voter.location,
                        language: voter.language
                    };
                    i18n.setLocale([req, res.locals], voter.language); 
                    return res.send({ status: true, voter: req.session.auth });
                }
                
                let s = SOCIALS;
                s.shift();
                s.push({
                    id: 'Facebook',
                    value: rep.data.link,
                });
                SocialLink.create(s).then((docsS) => {
                    const socials = [];
                    for (const link of docsS) {
                        socials.push(link._id);
                    }

                    const date = new Date();
                    Voter.create({
                            url: removeSpace(rep.data.name) + mintoken.generate(),
                            name: rep.data.name,
                            email: rep.data.email,
                            password: '',
                            time_create: date,
                            time_update: date,
                            isVerify: true,
                            code: mintoken.generate(),
                            image: new mongoose.Types.ObjectId(),
                            language: req.getLocale(),
                            socials,
                        }).then((rep2) => {
                            req.session.auth = {
                                _id: rep2._id,
                                name: rep2.name,
                                email: rep2.email,
                                isVerify: rep2.isVerify,
                                state: rep2.state,
                                type: rep2.type,
                                url: rep2.url,
                                roleLevel: rep2.roleLevel,
                                time_create: rep2.time_create,
                                time_update: rep2.time_update,
                                code: rep2.code,
                                mailNotificationPermission: rep2.mailNotificationPermission,
                                short_bio: rep2.short_bio,
                                bio: rep2.bio,
                                socials: s,
                                location: rep2.location,
                                language: rep2.language
                            };
                            fs.mkdirSync(path.join(__dirname, '../images', `${rep2._id}`));
                            fs.mkdirSync(path.join(__dirname, '../uploads', `${rep2._id}`));
                            fs.mkdirSync(
                                path.join(
                                    __dirname,
                                    "../uploads",
                                    `${ad._id}`
                                )
                            );
                            const pt = `${rep2._id}/${removeSpace(rep2.name) + timeToString(date)}.${userImg.type}`;
                            fs.copyFileSync(path.join(__dirname, '../images', `${userImg.name}.${userImg.type}`), path.join(__dirname, '../images', pt));
                            const imgUrl =`https://graph.facebook.com/v4.0/${req.body.userID}/picture?access_token=${req.body.accessToken}&method=get&pretty=0&sdk=joey&suppress_http_code=1`
                            downloadImage(imgUrl,path.join(__dirname,'../images',pt));
                           
                            Doc.create({
                                time_create: date,
                                time_update: date,
                                name: rep2.name,
                                src: pt,
                                state: 'public',
                                type: userImg.type,
                                voter: rep2._id,
                                cathegorie: 'image',
                            }).then((good2) => {
                                Voter.updateOne({ _id: rep2._id }, { image: good2._id }, (err, ok) => {
                                    if (err)console.log('image', err);
                                });
                                Voter.countDocuments( { isVerify: true }, (err3, count) => {
                                    Event.create({
                                        type: 'voter',
                                        time_create: date,
                                        time_update: date,
                                        link: rep2.url,
                                        tags: 'new_user',
                                        title: res.__('welcome.title', rep2.name),
                                        description: res.__('welcome.description', count),
                                        document: good2._id,
                                        language: rep2.language
                                    }).then((event) => {
                                        console.log(event);
                                    }).catch((err) => {
                                        console.log(err);
                                    });

                                    dynamicNsp.emit('newEvent', {
                                        type: 'voter',
                                        time_create: date,
                                        link: rep2.url,
                                        time_update: date,
                                        title: res.__('welcome.title', rep2.name),
                                        description: res.__('welcome.description', count),
                                        document: good2,
                                    });
                                    const notif = {
                                        time_create: date,
                                        time_update: date,
                                        url: rep2.url,
                                        read: false,
                                        type: 'welcomeMessage',
                                        voter: rep2._id,
                                    };
                                    Notification
                                        .create({
                                            time_create: date,
                                            time_update: date,
                                            url: rep2.url,
                                            read: false,
                                            voter: rep2._id,
                                            target: rep2._id,
                                        }).then(() => {});
                                    let mail = mailTemplate.getTemplate('newUserMessage');
                                    mail.subject = res.__('newUserMessage.subject', process.env.APP_NAME);
                                    mail.html = mail.html
                                        .replace('<%btn%>', res.__('newUserMessage.btn'))
                                        .replace('<%the%>', res.__('the'))
                                        .replace('<%follow%>', res.__('follow'))
                                        .replace('<%on%>', res.__('on'))
                                        .replace('<%and%>', res.__('and'))
                                        .replace('<%title%>', res.__('welcome.title', rep2.name))
                                        .replace('<%description%>', res.__('welcome.description', count))
                                        .replace('<%profil%>', `${process.env.BASE_URL}in/${rep2.url}`)
                                        .replace('<%url%>', `${process.env.BASE_URL}in/${rep2.url}`)
                                        .replace('<%image%>', `${process.env.BASE_URL}api/img/${good2.src}`);
                                    sendMailOrNotification(mail, notif, { single: false, ignore: [rep2._id] },
                                        {
                                            names: ['voter'],
                                            data: {
                                                voter: {
                                                    image: {
                                                        src: pt,
                                                        type: userImg.type,
                                                    },
                                                    name: rep.data.name,
                                                    _id: rep2._id,
                                                    url: rep2.url,
                                                },
                                            },
                                        });
                                    mail = mailTemplate.getTemplate('welcomeToNewUser');
                                    mail.subject = res.__('welcomeToNewUser.subject', rep.data.name, process.env.APP_NAME)
                                    mail.html = mail.html.replace('<%title%>', res.__('welcomeToNewUser.title', process.env.APP_NAME, rep2.name))
                                        .replace('<%the%>', res.__('the'))
                                        .replace('<%follow%>', res.__('follow'))
                                        .replace('<%on%>', res.__('on'))
                                        .replace('<%and%>', res.__('and'))
                                        .replace('<%home%>', res.__('home'))
                                        .replace('<%description%>', res.__('welcomeToNewUser.description', process.env.APP_NAME, rep2.name));
                                    mailApi(rep2.email, mail).catch(console.error);
                                    req.session.auth.image = {
                                        name: rep.data.name,
                                        src: pt,
                                        type: userImg.type,
                                    };
                                    setTimeout(() => {res.send({ status: true, voter: req.session.auth });},150); 
                                });
                            });
                            
                            
                        }).catch((err) => {
                            
                            res.send({ status: false, errors: err });
                    });
                }).catch((rerr) => {
                    res.send({ status: false });
                });
            });
        } else {
            res.send({ status: false });
        }
    }).catch((err) => {
        console.error(err);
        res.send({ status: false });
    });
};

exports.testurl = (req, res) => {
    Voter.findOne({ url: req.params.url }).populate('image').populate('socials').select('name  short_bio bio state url roleLevel').exec((err, voter) => {
        if (err) {
            return res.send({ status: false, err });
        }
        if (voter) {
            if (voter.state == 'public') {
                return res.send({ status: true, voter });
            }
            if (typeof (req.session.auth) !== 'undefined') {
                return res.send({ status: true, voter });
            }
            return res.send({ status: false, errors: 'PrivateProfil' });
        }
        return res.send({ status: false, errors: 'NotFound' });
    });
};
exports.resetPasswordInit = (req, res) => {
    const tokenExpire = new Date();
    tokenExpire.setHours(tokenExpire.getHours() + 2);
    const usertoken = token.generate();
    Voter.findOne({ email: req.body.email }, (err1, result1) => {
        if (err1) {
            return res.send({ status: false, errors: err1 });
        }
        if (result1) {
            return Voter.updateOne({ _id: result1._id }, { time_update: new Date(), token: usertoken, token_validity: tokenExpire }, (err, result) => {
                if (err) {
                    return res.send({ status: false, errors: err });
                }


                let mail = {};
                if (req.body.method === 'code') {
                    mail = mailTemplate.getTemplate('resetPasswordByCode');
                    mail.subject = res.__('resetPasswordByCode.subject', process.env.APP_NAME);
                    mail.html = mail.html
                        .replace('<%the%>', res.__('the'))
                        .replace('<%follow%>', res.__('follow'))
                        .replace('<%home%>', res.__('home'))
                        .replace('<%on%>', res.__('on'))
                        .replace('<%and%>', res.__('and'))
                        .replace('<%title%>', res.__('resetPasswordByCode.title'))
                        .replace('<%description%>', res.__('resetPasswordByCode.description'))
                        .replace('<%code%>', usertoken.substr(10, 5));
                } else {
                    mail = mailTemplate.getTemplate('resetPasswordByLink');
                    mail.subject = res.__('resetPasswordByLink.subject', process.env.APP_NAME);
                    mail.html = mail.html
                        .replace('<%title%>', res.__('resetPasswordByLink.title'))
                        .replace('<%btn%>', res.__('resetPasswordByLink.btn'))
                        .replace('<%description%>', res.__('resetPasswordByLink.description'))
                        .replace('<%the%>', res.__('the'))
                        .replace('<%follow%>', res.__('follow'))
                        .replace('<%on%>', res.__('on'))
                        .replace('<%and%>', res.__('and'))
                        .replace('<%home%>', res.__('home'))
                        .replace('<%link%>', `${process.env.BASE_URL}api/voter/resetpasswordlink/${result1._id}/${usertoken}/`);
                }

                mailApi(req.body.email, mail).then((infos) => {
                    if (infos.rejected.length != 0) {
                        console.log(infos);
                        return res.send({ status: null, errors: err });
                    }
                    console.log(infos.envelope);
                    res.send({ status: true });
                });
            });
        }
        return res.send({ status: false, errors: 'NotFound' });
    });
};

exports.resetPasswordCode = (req, res) => {
    Voter.findOne({ email: req.body.email }, (err, result) => {
        if (err) {
            return res.send({ status: null, errors: err });
        }
        if (!result) {
            return res.send({ status: false, errors: 'Voter Not Found' });
        }
        if (req.body.code === result.token.substr(10, 5)) {
            if (((new Date()) - result.token_validity) > (1000 * 3600 * 2)) {
                const tokenExpire = new Date();
                tokenExpire.setHours(tokenExpire.getHours() + 2);
                const usertoken = token.generate();
                const mail = mailTemplate.getTemplate('resetPasswordByCode');
                mail.subject = res.__('resetPasswordByCode.subject', process.env.APP_NAME);
                mail.html = mail.html
                    .replace('<%the%>', res.__('the'))
                    .replace('<%follow%>', res.__('follow'))
                    .replace('<%on%>', res.__('on'))
                    .replace('<%and%>', res.__('and'))
                    .replace('<%home%>', res.__('home'))
                    .replace('<%title%>', res.__('resetPasswordByCode.title'))
                    .replace('<%description%>', res.__('resetPasswordByCode.description'))
                    .replace('<%code%>', usertoken.substr(10, 5));
                return Voter.update({ email: req.body.email }, { time_update: new Date(), token: usertoken, token_validity: tokenExpire }, (err1) => {
                    if (err1) {
                        return res.send({ status: false, errors: err });
                    }
                    mailApi(result.email, mail).then((infos) => {
                        console.log(infos.envelope);
                        res.send({ status: false, errors: 'Code has expirated check your email to get a new code.' });
                    }).catch((err) => {
                        console.log(err);
                        res.send({ status: false, errors: 'Code has expirated check your email to get a new code.' });
                    });
                });
            }
            return res.send({ status: true, token: result.token });
        }
        return res.send({ status: false, errors: 'Invalid Code' });
    });
};
exports.resetPasswordLink = (req, res) => {
    Voter.findOne({ _id: req.params.id }, (err, result) => {
        let url = '/resetpassword?status=false';
        if (err) {
            console.log('errr');
            return res.redirect(url);
        }
        if (!result) {
            console.log('not found');
            return res.redirect(url);
        }
        if (result.token === req.params.token) {
            if (((new Date()) - result.token_validity) > (1000 * 2 * 3600)) {
                const tokenExpire = new Date();
                tokenExpire.setHours(tokenExpire.getHours() + 2);
                const usertoken = token.generate();
                const mail = mailTemplate.getTemplate('resetPasswordByLink');
                mail.subject = res.__('resetPasswordByLink.subject', process.env.APP_NAME);
                mail.html = mail.html
                    .replace('<%title%>', res.__('resetPasswordByLink.title'))
                    .replace('<%btn%>', res.__('resetPasswordByLink.btn'))
                    .replace('<%description%>', res.__('resetPasswordByLink.description'))
                    .replace('<%the%>', res.__('the'))
                    .replace('<%follow%>', res.__('follow'))
                    .replace('<%on%>', res.__('on'))
                    .replace('<%and%>', res.__('and'))
                    .replace('<%home%>', res.__('home'))
                    .replace('<%link%>', `${process.env.BASE_URL}api/voter/resetpasswordlink/${req.session.auth._id}/${usertoken}/`);
                return Voter.update({ _id: req.params.id }, { time_update: new Date(), token: usertoken, token_validity: tokenExpire }, (err1) => {
                    if (err1) {
                        return res.redirect(url);
                    }
                    mailApi(result.email, mail).then(() => {
                        res.redirect(url);
                    }).catch((err) => {
                        console.log(err);
                        res.redirect(url);
                    });
                });
            }
            url = `/resetpassword?token=${req.params.token}&status=true`;
            res.cookie('voter', result.email);
            return res.redirect(url);
        }

        return res.redirect(url);
    });
};

exports.resetpasswordend = (req, res) => {
    Voter.findOne({ email: req.body.email, token: req.body.token }).populate({
        path: 'image',
        select: 'type name src _id',
    }).populate('socials').exec((err, result) => {
        if (err) {
            return res.send({ status: null, errors: err });
        }
        if (!result) {
            return res.send({ status: false, errors: 'Invalid email/token combinaison.' });
        }
        Voter.updateOne({ _id: result._id }, {
            password: req.body.password, code: mintoken.generate(), isVerify: true, token: token.generate(),
        }, (err, result2) => {
            if (err) {
                return res.send({ status: false, errors: err });
            }
            req.session.auth = {
                _id: result._id,
                name: result.name,
                email: result.email,
                isVerify: true,
                state: result.state,
                type: result.type,
                url: result.url,
                roleLevel: result.roleLevel,
                time_create: result.time_create,
                time_update: result.time_update,
                image: result.image,
                code: result.code,
                mailNotificationPermission: result.mailNotificationPermission,
                short_bio: result.short_bio,
                bio: result.bio,
                bio_html: result.bio_html,
                socials: result.socials,
                location: result.location,
                language: result.language,
                };
                i18n.setLocale([req, res.locals], result.language);
            res.send({ status: true, voter: req.session.auth });
        });
    });
};

exports.updateSocialLink = (req, res) => {
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, message: 'AuhtError' });
    }
    let my = false;
    for (const i of req.session.auth.socials) {
        if (req.body._id == i._id) {
            my = true;
        }
    }
    if (!my) {
        return res.send({ status: false, errors: 'Permission' });
    }
    SocialLink.updateOne({ _id: req.body._id }, { value: req.body.value })
        .then((link) => {
            res.send({ status: true });
        })
        .catch((err) => {
            res.send({ status: false });
        });
};
exports.sendMessageToAdmin = (req, res) => {

    if (!req.body.email || !req.body.subject || !req.body.message ) return res.send({ status: false });
    Voter.findOne({ type: 'SUPERUSER' })
    .exec((err, admin) => {
        const mail = mailTemplate.getTemplate('anonymeMessage');
        mail.subject = req.body.subject;
        mail.html = mail.html.replace('<%title%>',  req.body.name + ' type to you')
        .replace('<%email%>', req.body.email || '')
        .replace('<%description%>', req.body.message);
        mailApi(admin.email, mail).then(() => {
            res.send({ status: true });
        }).catch((err) => {
            console.log(err);
            res.send({ status: false });
        });
    });
    
};
exports.sendMessageToOne = (req, res) => {
    if (!req.body.email || !req.body.subject || !req.body.message ) return res.send({ status: false });
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: 'AuhtError' });
    }
    
    if (req.session.auth.type != 'SUPERUSER') return res.send({ status: false, errors: 'Permission' });  
    const mail = mailTemplate.getTemplate('anonymeMessage');
    mail.subject = req.body.subject;
        mail.html = mail.html.replace('<%title%>',  process.env.APP_NAME + ' repply')
        .replace('<%email%>', req.session.auth.email )
        .replace('<%description%>', req.body.message);
    mailApi(req.body.email, mail).then(() => {
        res.send({ status: true });
    }).catch((err) => {
        console.log(err);
        res.send({ status: false });
    });

}
exports.sendMessageToAny = (req, res) => {
    
    if (!req.body.email || !req.body.subject || !req.body.message ) return res.send({ status: false });
    if (typeof (req.session.auth) === 'undefined' && process.env.NODE_ENV != 'test') {
        console.log('localhost:3000->auhtentification fallure');
        return res.send({ status: null, errors: 'AuhtError' });
    }
    
    if (req.session.auth.type != 'SUPERUSER') return res.send({ status: false, errors: 'Permission' });    
        const mail = mailTemplate.getTemplate('anonymeMessage');
        mail.subject = req.body.subject;
        mail.html = mail.html.replace('<%title%>',  process.env.APP_NAME + ' repply')
        .replace('<%email%>', req.session.auth.email )
        .replace('<%description%>', req.body.message);
        Voter.find({}).exec((err, doc)=>{
            if(err)return res.send({ status: false });
            doc.forEach((us)=>{
                if(us.type != "SUPERUSER"){
                    mailApi(us.email, mail).then(() => {
                        
                    }).catch((err) => {
                        console.log(err);
                        
                    });
                }
            })
            res.send({ status: true });
        })
        
    
    
};