const mongoose = require("mongoose");

const Help = mongoose.model("Help");
const { get } = require('./socketmanage');
const io = get();
exports.update = async function(req, res){
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthError" });
    }
    if (req.session.auth.type === "VOTER") {
        return res.send({ status: false, errors: "permission" });
    }
    try{
        await  Help.updateMany({}, req.body);
        io.of('/voter/' + req.session.auth._id).emit('help', req.body);
        res.send({ status: true });
    }catch(e){
        res.send({ status: false, errors: e });
    }
}

exports.get = async function(req, res){
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthError" });
    }
    res.send({ status: true, help: await Help.findOne({})}) ;
}

