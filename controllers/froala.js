var FroalaEditor = require("../util/lib/froalaEditor/froalaEditor");
const uploads = "../uploads/";
const fs = require("fs");
const path = require("path");
var gm = require("gm").subClass({ imageMagick: true });
const TokenGenerator = require("uuid-token-generator");
const token = new TokenGenerator(128);
let root = path.join(
    __dirname,
    uploads
);
if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
}
module.exports.upload_image = function(req, res) {
    if (
        typeof req.session.auth === "undefined" &&
        process.env.NODE_ENV != "test"
    ) {
        console.log("localhost:3000->auhtentification fallure");
        return res.send({ status: null, message: "AuhtError" });
    }
    console.log(req.body);
    const options = {
        validation: function(filePath, mimetype, callback) {
            fs.stat(filePath, function(err, stat) {
                if (err) {
                    return callback(err);
                }

                if (stat.size > 10 * 1024 * 1024) {
                    // > 10M
                    return callback(null, false);
                }

                return callback(null, true);
            });
        }
    };
    FroalaEditor.Image.upload(
        req,
        `${uploads}/${req.session.auth._id}/`,
        options,
        function(err, data) {
            if (err) {
                var filesDir = path.join(
                    __dirname,
                    `${uploads}/${req.session.auth._id}/`
                );
                if (!fs.existsSync(filesDir)) {
                    fs.mkdirSync(filesDir);
                }
                return res.send(JSON.stringify(err));
            }
            data.link = data.link.replace(uploads, process.env.BASE_URL);
            res.send(data);
        }
    );
};

module.exports.upload_video = function(req, res) {
    if (
        typeof req.session.auth === "undefined" &&
        process.env.NODE_ENV != "test"
    ) {
        console.log("localhost:3000->auhtentification fallure");
        return res.send({ status: null, message: "AuhtError" });
    }
    const options = {
        validation: function(filePath, mimetype, callback) {
            fs.stat(filePath, function(err, stat) {
                if (err) {
                    return callback(err);
                }

                if (stat.size > 10 * 1024 * 1024) {
                    // > 10M
                    return callback(null, false);
                }

                return callback(null, true);
            });
        }
    };
    FroalaEditor.Video.upload(
        req,
        `${uploads}/${req.session.auth._id}/`,
        options,
        function(err, data) {
            if (err) {
                var filesDir = path.join(
                    __dirname,
                    `${uploads}/${req.session.auth._id}/`
                );
                if (!fs.existsSync(filesDir)) {
                    fs.mkdirSync(filesDir);
                }
                return res.send(JSON.stringify(err));
            }
            data.link = data.link.replace(uploads, process.env.BASE_URL);
            res.send(data);
        }
    );
};

module.exports.upload_image_resize = function(req, res) {
    if (
        typeof req.session.auth === "undefined" &&
        process.env.NODE_ENV != "test"
    ) {
        console.log("localhost:3000->auhtentification fallure");
        return res.send({ status: null, message: "AuhtError" });
    }
    var options = {
        resize: [300, 300],
        validation: function(filePath, mimetype, callback) {
            fs.stat(filePath, function(err, stat) {
                if (err) {
                    return callback(err);
                }

                if (stat.size > 10 * 1024 * 1024) {
                    // > 10M
                    return callback(null, false);
                }

                return callback(null, true);
            });
        }
    };
    FroalaEditor.Image.upload(req, uploads, options, function(err, data) {
        if (err) {
            var filesDir = path.join(
                __dirname,
                `${uploads}/${req.session.auth._id}/`
            );
            if (!fs.existsSync(filesDir)) {
                fs.mkdirSync(filesDir);
            }
            return res.send(JSON.stringify(err));
        }
        data.link = data.link.replace(uploads, process.env.BASE_URL);
        res.send(data);
    });
};

module.exports.upload_image_validation = function(req, res) {
    if (
        typeof req.session.auth === "undefined" &&
        process.env.NODE_ENV != "test"
    ) {
        console.log("localhost:3000->auhtentification fallure");
        return res.send({ status: null, message: "AuhtError" });
    }
    var options = {
        fieldname: "myImage",
        validation: function(filePath, mimetype, callback) {
            gm(filePath).size(function(err, value) {
                if (err) {
                    return callback(err);
                }

                if (!value) {
                    return callback("Error occurred.");
                }

                if (value.width != value.height) {
                    return callback(null, false);
                }
                return callback(null, true);
            });
        }
    };

    FroalaEditor.Image.upload(req, uploads, options, function(err, data) {
        if (err) {
            return res.send(JSON.stringify(err));
        }
        data.link = data.link.replace(uploads, process.env.BASE_URL);
        res.send(data);
    });
};

module.exports.upload_file = function(req, res) {
    if (
        typeof req.session.auth === "undefined" &&
        process.env.NODE_ENV != "test"
    ) {
        console.log("localhost:3000->auhtentification fallure");
        return res.send({ status: null, message: "AuhtError" });
    }
    var options = {
        validation: null
    };

    FroalaEditor.File.upload(
        req,
        `${uploads}/${req.session.auth._id}/`,
        options,
        function(err, data) {
            if (err) {
                var filesDir = path.join(
                    __dirname,
                    `${uploads}/${req.session.auth._id}/`
                );
                if (!fs.existsSync(filesDir)) {
                    fs.mkdirSync(filesDir);
                }

                return res.status(404).end(JSON.stringify(err));
            }
            data.link = data.link.replace(uploads, process.env.BASE_URL);
            res.send(data);
        }
    );
};

module.exports.upload_file_validation = function(req, res) {
    if (
        typeof req.session.auth === "undefined" &&
        process.env.NODE_ENV != "test"
    ) {
        console.log("localhost:3000->auhtentification fallure");
        return res.send({ status: null, message: "AuhtError" });
    }
    var options = {
        fieldname: "myFile",
        validation: function(filePath, mimetype, callback) {
            fs.stat(filePath, function(err, stat) {
                if (err) {
                    return callback(err);
                }

                if (stat.size > 10 * 1024 * 1024) {
                    // > 10M
                    return callback(null, false);
                }

                return callback(null, true);
            });
        }
    };

    FroalaEditor.File.upload(
        req,
        `${uploads}/${req.session.auth._id}/`,
        options,
        function(err, data) {
            if (err) {
                return res.status(404).end(JSON.stringify(err));
            }
            data.link = data.link.replace(uploads, process.env.BASE_URL);
            res.send(data);
        }
    );
};

module.exports.delete_image = function(req, res) {
    if (
        typeof req.session.auth === "undefined" &&
        process.env.NODE_ENV != "test"
    ) {
        console.log("localhost:3000->auhtentification fallure");
        return res.send({ status: null, message: "AuhtError" });
    }
    FroalaEditor.Image.delete(
        req.body.src.replace(process.env.BASE_URL, uploads),
        function(err) {
            if (err) {
                return res.status(404).end(JSON.stringify(err));
            }
            return res.end();
        }
    );
};
module.exports.delete_video = function(req, res) {
    if (
        typeof req.session.auth === "undefined" &&
        process.env.NODE_ENV != "test"
    ) {
        console.log("localhost:3000->auhtentification fallure");
        return res.send({ status: null, message: "AuhtError" });
    }
    FroalaEditor.Video.delete(
        req.body.src.replace(process.env.BASE_URL, uploads),
        function(err) {
            if (err) {
                return res.status(404).end(JSON.stringify(err));
            }
            return res.end();
        }
    );
};

module.exports.delete_file = function(req, res) {
    FroalaEditor.File.delete(
        req.body.src.replace(process.env.BASE_URL, uploads),
        function(err) {
            if (err) {
                return res.status(404).end(JSON.stringify(err));
            }
            return res.end();
        }
    );
};

module.exports.load_images = function(req, res) {
    if (
        typeof req.session.auth === "undefined" &&
        process.env.NODE_ENV != "test"
    ) {
        console.log("localhost:3000->auhtentification fallure");
        return res.send({ status: null, message: "AuhtError" });
    }
    FroalaEditor.Image.list(`${uploads}/${req.session.auth._id}/`, function(
        err,
        data
    ) {
        if (err) {
            var filesDir = path.join(
                __dirname,
                `${uploads}/${req.session.auth._id}/`
            );
            if (!fs.existsSync(filesDir)) {
                fs.mkdirSync(filesDir);
            }
            return res.status(404).end(JSON.stringify(err));
        }
        let r = [];

        for (let img of data) {
            img.thumb = img.thumb.replace(uploads, process.env.BASE_URL);
            img.url = img.url.replace(uploads, process.env.BASE_URL);
            r.push(img);
        }
        return res.send(r);
    });
};

module.exports.get_amazon = function(req, res) {
    var configs = {
        bucket: process.env.AWS_BUCKET,
        region: process.env.AWS_REGION,
        keyStart: process.env.AWS_KEY_START,
        acl: process.env.AWS_ACL,
        accessKey: process.env.AWS_ACCESS_KEY,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY
    };

    var configsObj = FroalaEditor.S3.getHash(configs);
    res.send(configsObj);
};
