/* eslint-disable no-restricted-syntax */
const { getList, getDynamic, get } = require("../controllers/socketmanage");
const { mailApi } = require("./mail");

const ioDynamic = getDynamic();
const mongoose = require("mongoose");

const io = get();
const Voter = mongoose.model("Voter");
const Notification = mongoose.model("Notification");
const Like = mongoose.model("Like");

function displayNotification(notif, voter) {
    let option = {};
    option["dir"] = "auto";
    option["data"] = {};

    option["data"]["primaryKey"] = this.key++;

    option["badge"] = "assets/img/png/homescreen-96.png";
    option["date"] = notif.time_create;
    option["icon"] = "assets/img/png/homescreen-96.png";
    if (notif.voter && !notif.like) {
        option["data"]["_id"] = notif.voter._id;
        try {
            option[
                "icon"
            ] = `${process.env.BASE_URL}api/img/${notif.voter.image.src}`;
            option[
                "image"
            ] = `${process.env.BASE_URL}api/img/${notif.voter.image.src}`;
            option["title"] = notif.voter.name;
            if (voter._id == notif.voter._id) {
                option["body"] = " Welcome in ours comunity";
                option["data"]["url"] = "/dashboard/me";
            } else {
                option["data"]["url"] = `/dashboard/in/${notif.voter.url}`;
                if (notif.type == "welcomeMessage") {
                    option["body"] = `${notif.voter.name} join comunity`;
                } else {
                    if (notif.type == "profilPictureChange") {
                        option[
                            "body"
                        ] = `${notif.voter.name} update him profil picture`;
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
        option["action"] = [
            { action: "like", title: "Like", icon: "/assets/img/like.png" },
            { action: "link", title: "Profil" }
        ];

        option["data"]["url"] = `/dashboard/voter/me/${notif.voter.url}`;
    } else {
        if (notif.project && !notif.like) {
            option["data"]["_id"] = notif.project._id;
            option["body"] = notif.project.short_description;
            if (notif.type == "submit") {
                option["title"] = `Check this Project: ${notif.project.name}`;
            } else {
                if (notif.type == "new") {
                    option["title"] = `New Project: ${notif.project.name}`;
                } else {
                    if (notif.type == "decline") {
                        option["title"] = "Project refused by admin ";
                    } else {
                        if (notif.type == "accepted") {
                            option["title"] = "Project accepted by admin ";
                        } else {
                            if (notif.type == "update") {
                                option["title"] = "Project has been update ";
                            }
                        }
                    }
                }
            }
            option["action"] = [
                { action: "like", title: "Like", icon: "/assets/img/like.png" },
                { action: "link", title: "See" }
            ];

            option["icon"] = notif.project.image
                ? `/api/img/${notif.project.image.src}`
                : "/assets/img/default_project_img.jpg";

            option["data"]["url"] = `/dashboard/project/${notif.project.url}`;
        } else {
            if (notif.event && !notif.like) {
                option["data"]["_id"] = notif.event._id;
                option["body"] = notif.event.description;
                option["title"] = notif.event.title;

                option["action"] = [
                    {
                        action: "like",
                        title: "Like",
                        icon: `${process.env.BASE_URL}assets/img/like.png`
                    },
                    { action: "link", title: "Comments" }
                ];
                if (notif.event.document.cathegorie == "image") {
                    option[
                        "icon"
                    ] = `${process.env.BASE_URL}api/img/${notif.event.document.src}`;
                } else {
                    if (
                        notif.event.document.cathegorie == "voix" ||
                        notif.event.document.cathegorie == "audio"
                    ) {
                        option[
                            "icon"
                        ] = `${process.env.BASE_URL}assets/img/audio.png`;
                    } else {
                        if (notif.event.document.cathegorie == "video") {
                            option[
                                "icon"
                            ] = `${process.env.BASE_URL}assets/img/video.png`;
                        } else {
                            if (notif.event.document.cathegorie == "link") {
                                option["icon"] = "/assets/img/link.png";
                            }
                        }
                    }
                }

                option["data"]["url"] = `/dashboard/${notif.event._id}`;
            } else {
                if (notif.message) {
                }
            }
        }
    }

    var noty = new this.notification(option["title"], option);
    noty.onclick = event => {
        event.target.close();
        event.preventDefault(); // empêche le navigateur de donner le focus à l'onglet relatif à la notification
        window.focus();
        if (event.target.action == "link") {
            this.$router.push(event.target.data["url"]);
        } else {
            secureSocket.emit("likeThis", {
                target_id: event.target.data._id,
                type: event.target.data.type
            });
        }
    };
    noty.onerror = function() {
        //console.log('notification.Error');
    };
    noty.onshow = () => {
        if (this.isMobile) {
            navigator.vibrate([100, 50, 100]);
        }
        this.sound.play().catch(() => {});
    };
    noty.onclose = function() {};
}

exports.sendMailOrNotification = (mail, notif, to, extra = null) => {
    if (to.single) {
        const userList = getList();
        Notification.create(notif).then(() => {});
        if (userList[to._id]) {
            if (userList[to._id].sessionCount > 0) {
                return io.of(`/voter/${to._id}`).emit("notification", notif);
            }
        }
        return mailApi(to.email, mail)
            .then(re => {})
            .catch(err => {
                console.log(err);
            });
    }
    if (to.followers) {
        Like.findOne({ target_id: to.ignore })
            .populate("voters")
            .exec((err, likes) => {
                if (err) {
                    return console.log(err);
                }
                if (!likes) return;
                const userList = getList();
                for (const i of likes.voters) {
                    let next = false;
                    if (to.ignore) {
                        for (const not of to.ignore) {
                            if (not == `${i._id}`) next = true;
                        }
                    }
                    if (next) continue;
                    notif.target = i._id;
                    if (userList[i._id]) {
                        if (userList[i._id].sessionCount > 0) {
                            Notification.create(notif).then(not => {
                                if (extra) {
                                    let j = 0;

                                    while (j < extra.names.length) {
                                        notif[extra.names[j]] =
                                            extra.data[extra.names[j]];

                                        console.log(
                                            extra.names[j],
                                            extra.data[extra.names[j]]
                                        );
                                        j++;
                                    }
                                }
                                console.log(notif, extra);
                                io.of(`/voter/${i._id}`).emit(
                                    "notification",
                                    notif
                                );
                            });

                            continue;
                        }
                    }
                    Notification.create(notif).then(() => {});
                    if (!i.mailNotificationPermission) continue;
                    mailApi(i.email, mail)
                        .then(re => {})
                        .catch(err => {
                            console.log(err);
                        });
                }
            });
    } else {
        Voter.find({ isVerify: true })
            .populate("image")
            .exec((err, user) => {
                if (err) {
                    return console.log(err);
                }
                const userList = getList();

                for (const i of user) {
                    let next = false;
                    if (to.ignore) {
                        for (const not of to.ignore) {
                            if (not == `${i._id}`) next = true;
                        }
                    }
                    if (next) continue;
                    notif.target = i._id;
                    if (userList[i._id]) {
                        if (userList[i._id].sessionCount > 0) {
                            Notification.create(notif).then(not => {
                                if (extra) {
                                    let j = 0;

                                    while (j < extra.names.length) {
                                        notif[extra.names[j]] =
                                            extra.data[extra.names[j]];

                                        console.log(
                                            extra.names[j],
                                            extra.data[extra.names[j]]
                                        );
                                        j++;
                                    }
                                }

                                io.of(`/voter/${i._id}`).emit(
                                    "notification",
                                    notif
                                );
                            });

                            continue;
                        }
                    }
                    Notification.create(notif).then(() => {});
                    if (!i.mailNotificationPermission) continue;
                    mailApi(i.email, mail)
                        .then(re => {})
                        .catch(err => {
                            console.log(err);
                        });
                }
            });
    }
};
