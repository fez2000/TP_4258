const mongoose = require('mongoose');


const Cathegorie = mongoose.model('Cathegorie');

exports.findAll = (req, res) => {
    Cathegorie.find({}, (err, ok) => {
        if (err) {
            return res.send({ status: null, errors: err });
        }
        res.send({ status: true, cathegories: ok });
    });
};

exports.add = (req, res) => {
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthError" });
    }
    Cathegorie.create(req.body, (err, ok) => {
        if (err) {
            return res.send({ status: null, errors: err });
        }
        res.send({ status: true, cathegorie: ok });
    });
}