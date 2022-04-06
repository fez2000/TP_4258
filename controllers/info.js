const mongoose = require("mongoose");

const Info = mongoose.model("Info");
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
        await  Info.updateMany({}, req.body);
        res.send({ status: true });
        io.of('/voter/' + req.session.auth._id).emit('info', req.body);
    }catch(e){
        res.send({ status: false, errors: e });
    }
}

exports.get = async function(req, res){
    if (typeof req.session.auth === "undefined") {
        return res.send({ status: false, errors: "AuthError" });
    }
    res.send({ status: true, info: await Info.findOne({})}) ;
}

