const emailExistence = require('email-existence');
const mongoose = require('mongoose');
const verifier = require('email-verify');
const axios = require('axios');

const Voter = mongoose.model('Voter');




exports.check = (req, res) => {
    const url = `https://emailverification.whoisxmlapi.com/api/v1?apiKey=at_xo3haWOOBfeCYBtZi1V2Ae2lIPwqj&emailAddress=${req.body.email}`;
    axios.get(url).then((rep) => {
        if (rep.data.formatCheck && rep.data.dnsCheck) {
            return Voter.findOne({ email: req.body.email, isVerify: true }, (err, rep2) => {
                if (err) {
                    return res.send({ status: false, email: req.body.email, errors: err });
                }
                if (rep2) {
                    return res.send({ status: false, email: req.body.email });
                }
                return res.send({ status: true, email: req.body.email });
            });
        }
        res.send({ status: false, email: req.body.email });
    }).catch(err => res.send({ status: null, email: req.body.email }));
};
exports.findAccount = (req,res) => {
    Voter.findOne({ email: req.body.email },(err,voter)=>{
        if(err){
            res.send({ status: false, errors: err, email: req.body.email });
        }
        if(voter){
            res.send({ status: true, email: req.body.email });
        }else{
            res.send({ status: false, email: req.body.email });
        }
    })
}