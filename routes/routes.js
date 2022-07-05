/* eslint-disable linebreak-style */
const multer = require("multer");
const email = require("../controllers/email");
const voter = require("../controllers/voter");
const project = require("../controllers/project");
const doc = require("../controllers/doc");
const event = require("../controllers/event");
const cathegorie = require("../controllers/cathegorie");
const like = require("../controllers/like");
const notification = require("../controllers/notification");
const poll = require("../controllers/poll");
const paiement = require("../controllers/paiement");
//const ssr = require("../controllers/ssr");
const push = require("../controllers/push");
const froala = require("../controllers/froala");
const eventpost = require("../controllers/eventpost");
const info = require('../controllers/info');
const help = require('../controllers/help');

const upload = multer();
module.exports = app => {

    app.post("/api/flroala/upload_image", froala.upload_image);

    app.post("/api/flroala/upload_video", froala.upload_video);

    app.post("/api/flroala/upload_image_resize", froala.upload_image_resize);

    app.post(
        "/api/flroala/upload_image_validation",
        froala.upload_image_validation
    );

    app.post("/api/flroala/upload_file", froala.upload_file);

    app.post(
        "/api/flroala/upload_file_validation",
        froala.upload_file_validation
    );
     
    
    app.post("/api/info", info.update);
    app.get("/api/info", info.get);

    app.post("/api/help", help.update);
    app.get("/api/help", help.get);
    app.post("/api/flroala/delete_image", froala.delete_image);
    app.post("/api/flroala/delete_video", froala.delete_video);

    app.post("/api/flroala/delete_file", froala.delete_file);

    app.get("/api/flroala/load_images", froala.load_images);

    // eslint-disable-next-line global-require
    app.get("/api/notification/start", notification.findAllStart);
    app.post("/api/notification/startAtDate", notification.findAllStartAtDate);
    app.get("/api/notification/startAt/:id", notification.findAllStartAt);
    app.get("/api/notification/next", notification.findAllNext);
    app.get("/api/notification/:id", notification.findById);
    app.get("/api/notification", notification.findAllUnread);

    app.post("/api/like/add", like.add);
    app.post("/api/like/remove", like.remove);
    app.get("/api/like/:id", like.get);
    app.get("/api/cathegorie", cathegorie.findAll);
    app.post("/api/cathegorie", cathegorie.add);
    app.post("/api/testmail", email.check);
    app.post("/api/testaccount", email.findAccount);

    app.post(
        "/api/voter/togglemailnotificationpermission",
        voter.toggleMailNotificationPermission
    );
    app.get("/api/admin/alluser",voter.adminGetAll);
    app.delete("/api/admin/userdelete/:id",voter.adminDelete);
    app.post("/api/admin/usertypeupdate/:id", voter.updateType);
    app.post("/api/voter/togglestate", voter.toggleState);
    app.post("/api/voter/updatesociallink", voter.updateSocialLink);
    app.post("/api/admin/canal", voter.sendMessageToAdmin);
    app.post("/api/admin/reply", voter.sendMessageToAny);
    app.post("/api/admin/replyToOne", voter.sendMessageToOne);
    app.get("/api/voter/sync", voter.synData);
    app.get("/api/voter", voter.findAll);
    app.get("/api/voter/findallstart", voter.findAllStart);
    app.get("/api/voter/findallnext", voter.findAllNext);
    app.post("/api/voter/changepassword", voter.updatePassword);
    app.get("/api/img/:id/:name", doc.getDocByVoterId);
    app.get("/api/doc/getall", doc.getAll);
    app.get("/api/doc/:id/:name", doc.getDocByVoterId);
    app.delete("/api/doc/:id", doc.delete);
    app.post("/api/doc/rename", doc.rename);
    app.put("/api/doc", upload.single("document"), doc.update);
    app.post("/api/doc", upload.single("document"), doc.add);
    app.get("/api/voter/nb", voter.numMembers);
    app.get("/api/event", event.findAll);
    app.get("/api/event/startAt", event.findAllStartAt);
    app.get("/api/event/start", event.findAllStart);
    app.post("/api/event/next", event.findAllNext);
    app.delete("/api/event/:id", event.deleteEvent);
    app.put("/api/event", event.updateEvent);
    app.get("/api/event/:id", event.findById);
    app.post("/api/event/add", event.postEvent);
    app.get("/api/voter/:id", voter.findById);
    app.post("/api/voter/login/google", voter.googleLogin);
    app.get("/api/voter/testurl/:url", voter.testurl);
    app.get("/api/voter/tokenverify/:id/:token", voter.verify);
    app.get("/api/voter/resetpasswordlink/:id/:token", voter.resetPasswordLink);
    app.post("/api/voter/resetpasswordinit", voter.resetPasswordInit);
    app.post("/api/voter/resetpasswordcode", voter.resetPasswordCode);
    app.post("/api/voter/retryverify", voter.retryverify);
    app.post("/api/voter/resetpassword", voter.resetpasswordend);
    app.post("/api/voter", voter.add);
    app.post("/api/voter/login/fb", voter.fbLogin);
    app.post("/api/voter/login/linkedin", voter.linkedinLogin);
    app.post("/api/auth/linkedin", voter.linkedin_lg);
    app.put("/api/voter", voter.update);
    app.delete("/api/voter", voter.delete);
    app.post("/api/login", voter.login);
    app.get("/api/logout", voter.logout);
    app.get("/api/debut", (req, res) => {
        if (typeof req.session.auth === "undefined") {
            res.send({
                status: false
            });
        } else {
            res.send({
                status: true,
                voter: req.session.auth
            });
        }
    });

    app.get("/api/pushNotification/vapidPublicKey", push.getVapidKey);
    app.post("/api/pushNotification/register", push.register);
    app.post("/api/pushNotification/send", push.send);
    // project api
    app.get("/api/project", project.findAll);
    app.get("/api/project/my/nb", project.numMyProject);
    app.get("/api/project/nb", project.numProject);
    app.get("/api/project/filter/:state/nb", project.numProjectBySate);
    app.get("/api/project/findallnext", project.findAllNext);
    app.get("/api/project/findallstart", project.findAllStart);

    app.get("/api/eventpost", eventpost.findAll);
    app.get("/api/eventpost/startAt", eventpost.findAllStartAt);
    app.get("/api/eventpost/start", eventpost.findAllStart);
    app.post("/api/eventpost/next", eventpost.findAllNext);
    app.delete("/api/eventpost/:id", eventpost.deleteEventPost);
    app.put("/api/eventpost", eventpost.updateEventPost);
    app.get("/api/eventpost/:id", eventpost.findById);
    app.post("/api/eventpost/add", eventpost.postEventPost);

    app.get(
        "/api/project/filter/:state/findallstart",
        project.findAllStartByState
    );
    app.get(
        "/api/project/filter/:state/findallstart",
        project.findAllStartByState
    );
    app.get("/api/project/accept/:id", project.accept);
    app.get("/api/project/decline/:id", project.decline);
    app.get("/api/project/submit/my", project.mySubmit);
    app.get("/api/project/submit/:id", project.submitProject);
    app.get("/api/project/tocheckstart", project.getProjectTocheckStart);
    app.get("/api/project/tochecknext", project.getProjectTocheckNext);
    app.get("/api/project/pendingstart", project.getProjectPendingStart);
    app.get("/api/project/pendingnext", project.getProjectPendingNext);
    app.get("/api/project/waitselection", project.waitSelection);

    app.post("/api/project/doc/:id", project.addDoc);
    app.delete("/api/project/doc/:id/:docId", project.removeDoc);
    app.get("/api/project/my", project.my);
    app.get("/api/project/:id", project.findById);
    app.post("/api/project", project.add);
    app.put("/api/project/:id", project.update);
    app.delete("/api/project/:id", project.delete);
    app.get("/api/project/testurl/:url", project.testurl);
    app.get("/api/project/:projectId/:docId", project.changeImg);

    app.post("/api/poll", poll.add);
    app.get("/api/poll", poll.getPollByAny);
    app.get("/api/poll/manage", poll.getPoll);
    app.get("/api/poll/nb", poll.nb);
    app.delete("/api/poll/:id", poll.delete);
    app.delete("/api/poll/option/:id/:option", poll.deleteOption);
    app.put("/api/poll", poll.put);
    app.get("/api/poll/close/:id", poll.close);
    app.post("/api/poll/addoptions", poll.addOption);
    app.post("/api/paiement/paymooney", paiement.paymooney);
    app.get("/api/paiement/:status", paiement.status);
    app.post("/api/create-paypal-transaction", paiement.payer);
};
