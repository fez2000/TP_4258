<template>
  <div id="material-kit">
    <div :class="{ 'nav-open': NavbarStore.showNavbar }">
      <router-view name="header" />
      <div>
        <v-fade-transition name="fade" mode="out-in">
          <router-view class="view"></router-view>
        </v-fade-transition>
      </div>
      <router-view name="footer" />
      <check-cookies></check-cookies>

      <paiement :project="paiementAnalitic" :dialog="startPaiement"></paiement>
      <v-snackbar left bottom v-model="snackbar">
        {{(!text)?'please check your internet connection':text}}
        <v-btn color="primary" text dark @click="snackbar = false;text = ''">Close</v-btn>
      </v-snackbar>
      <v-dialog scrollable v-model="pdf" fullscreen>
        <pdf-card  :custum="true" @close="pdf = false" :src="previewPdf.src"></pdf-card>
      </v-dialog>
      
      <v-dialog dark v-model="dialog" fullscreen :hide-overlay="true">
        <v-card>
          <v-toolbar dark :elevation="0">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{img.name}}</v-toolbar-title>
            <div class="flex-grow-1"></div>
            <v-toolbar-items>
              <v-btn dark icon>
                <v-icon>mdi-share</v-icon>
                <md-tooltip md-direction="bottom">Share</md-tooltip>
              </v-btn>
              <v-btn dark icon>
                <v-icon>mdi-download</v-icon>
                <md-tooltip md-direction="bottom">Download this image</md-tooltip>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-img v-if="img.src" :src="'/api/img/'+img.src" :all="img.name"></v-img>
        </v-card>
      </v-dialog>
      
    </div>
    <viewer @inited="inited" class="viewer" ref="viewer" :images="imgs">
      <img v-for="im in imgs" :src="im.src" :alt="im.alt" :key="im.src" />
    </viewer>
    <v-snackbar left bottom color="success" v-model="installBar">
      vous pouvez installer cette web-application
      <v-btn text @click="install">Install</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import CheckCookies from "@/layout/CheckCookies.vue";
import { checkDevice, getVoterData, saveVoterData } from "./fonctions";
import * as init from "@/assets/js/installSDK";
var scrollPos = 0;
export default {
  created() {
    if (
      !(
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
      )
    ) {
      window.addEventListener(
        "beforeinstallprompt",
        this.checkInstallable.bind(this)
      );
    }

    this.isMobile = checkDevice();
    this.$root.$on("notifPermission", data => (this.notifPermission = data));
    if (secureSocket) {
      secureSocket.on("notification", data => {
        this.notificationPoster(data);
      });
      secureSocket.on("updateProfil", this.updateProfil);
    }
    setTimeout(() => {
      this.init();
    }, 1000);

    this.$root.$on("login", data => {
      if (data) {
        secureSocket.on("notification", data => {
          this.notificationPoster(data);
        });
        secureSocket.on("updateProfil", this.updateProfil);
      }
    });

    window.addEventListener("resize", e => {
      this.isMobile = checkDevice();
    });
    scrollPos = window.pageYOffset;

    this.$root.$on("snackbar", data => {
      this.snackbar = data.display;
      this.text = data.text;
    });
    this.$root.$on("pdf", pdf => {
      this.previewPdf.src = pdf.src;
      this.pdf = true;
      window.addEventListener("keyup", this.waitkeyUp);
    });
    this.waitPaiement();
    this.$root.$on("previewImage", data => {
      this.imgs = data.imgs;
      this.show(data.index);
    });
    this.$root.$on("neterror", data => {
      if (window.navigator.onLine) {
        //anothe gestion
      } else {
        if (data.callback) {
          this.pile.push({
            callback: data.callback,
            data: data.data,
            id: data.id
          });
        }
      }
    });
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer;
    },
    checkInstallable(e) {
      deferredPrompt = e;
      
      if (this.$Cookies.get("cookiesEnable") && !this.$Cookies.get("first")) {
        this.$Cookies.set("first", "true");
              
        setTimeout(() => {
          this.installBar = true;
        }, 1000);
      }
    },
    install() {
      this.installBar = false;
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === "accepted") {
          window.addEventListener("appinstalled", evt => {
            this.$root.$emit("snackbar", {
              display: true,
              text: "Installation reussie"
            });
          });
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        
      });
      this.installBar = false;
    },
    show(index = null) {
      if (index) {
        this.$viewer.index = index;
      }
      this.$viewer.show();
    },
    updateProfil() {
      this.$axios.get("/api/voter/sync").then(({ data }) => {
        if (!data.status) return;
        let voter = {};
        if (this.$Cookies.get(data.voter.email)) {
          voter = JSON.parse(this.$Cookies.get(data.voter.email));
        }
        for (let i in data.voter) {
          voter[i] = data.voter[i];
        }

        this.$Cookies.set(data.voter.email, JSON.stringify(voter));
        this.$root.$emit("updateProfil");
      });
    },
    updateBackGroundSize(unit) {
      if (this.overlayBackGroundSize + unit <= 0)
        this.overlayBackGroundSize = 1;
      else this.overlayBackGroundSize += unit;
    },
    MouseWheelHandler(e) {
      // cross-browser wheel delta
      var e = window.event || e; // old IE support
      var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));

      this.updateBackGroundSize(delta > 0 ? RANGE : delta < 0 ? -RANGE : 0);
      return false;
    },
    closeOverlay() {
      window.removeEventListener("keyup", this.waitkeyUp);
      this.previewImage.src = "";
      this.overlay = false;
      this.load = false;
    },
    waitScroll(e) {},

    waitkeyUp(e) {
      var isEscape = false;
      if ("key" in e) {
        isEscape = e.key === "Escape" || e.key === "Esc";
      } else {
        isEscape = e.keyCode === 27;
      }
      if (isEscape) {
        this.overlay = false;
        this.pdf = false;
      }
      window.removeEventListener("keyup", this.waitkeyUp);
    },
    executeAll() {
      while (this.pile.length !== 0) {
        let fonction = this.pile.shift();
        if (fonction.data) {
          fonction.callback(data);
        } else {
          fonction.callback();
        }
      }
    },
    share(data) {
      if (navigator.share) {
        navigator
          .share({
            title: data.title || "",
            text: data.text || "",
            url: data.url
          })
          .then(() => {
            this.text = "Successful share";
            this.snackbar = true;
          })
          .catch(error => {
            this.text = "Error sharing";
            this.snackbar = true;
          });
      }
    },
    init() {
      if (!this.test())
        if (this.notification.permission !== "granted") {
          this.notification.requestPermission(status => {
            this.notifPermission = status == "granted";
            saveVoterData("notif", this.notifPermission);
            if (this.notifPermission) {
              this.wait_blur();
            } else {
            }
          });
        } else {
          this.wait_blur();
        }
    },
    wait_blur() {
      window.onfocus = () => {
        this.focus = true;
      };
      window.onblur = () => {
        this.focus = false;
      };
    },
    test() {
      return "undefined" === typeof this.notification;
    },
    notificationPoster(data) {
      if (document["hidden"] || !this.focus) {
        if (!this.displayNotification(data)) {
          //Notification was shown
          this.sound.play().catch(() => {});
        }
      }
    },
    waitPaiement() {
      this.$root.$on("startPaiement", data => {
        this.startPaiement = !this.startPaiement;
        this.paiementAnalitic = data;
      });
    },
    displayNotification(notif) {
      if (!this.test())
        if (
          this.notification.permission === "granted" &&
          this.notifPermission
        ) {
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
              option["icon"] = this.BASE + "api/img/" + notif.voter.image.src;
              option["image"] = this.BASE + "api/img/" + notif.voter.image.src;
              option["title"] = notif.voter.name;
              if (this.voter._id == notif.voter._id) {
                option["body"] = " Welcome in ours comunity";
                option["data"]["url"] = "/dashboard/me";
              } else {
                option["data"]["url"] = "/dashboard/in/" + notif.voter.url;
                if (notif.type == "welcomeMessage") {
                  option["body"] = notif.voter.name + " join comunity";
                } else {
                  if (notif.type == "profilPictureChange") {
                    option["body"] =
                      notif.voter.name + " update him profil picture";
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

            option["data"]["url"] = "/dashboard/voter/me/" + notif.voter.url;
          } else {
            if (notif.project && !notif.like) {
              option["data"]["_id"] = notif.project._id;
              option["body"] = notif.project.short_description;
              if (notif.type == "submit") {
                option["title"] = "Check this Project: " + notif.project.name;
              } else {
                if (notif.type == "new") {
                  option["title"] = "New Project: " + notif.project.name;
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
                ? "/api/img/" + notif.project.image.src
                : "/assets/img/default_project_img.jpg";

              option["data"]["url"] = "/dashboard/project/" + notif.project.url;
            } else {
              if (notif.event && !notif.like) {
                option["data"]["_id"] = notif.event._id;
                option["body"] = notif.event.description;
                option["title"] = notif.event.title;

                option["action"] = [
                  {
                    action: "like",
                    title: "Like",
                    icon: this.BASE + "assets/img/like.png"
                  },
                  { action: "link", title: "Comments" }
                ];
                if (notif.event.document.cathegorie == "image") {
                  option["icon"] =
                    this.BASE + "api/img/" + notif.event.document.src;
                } else {
                  if (
                    notif.event.document.cathegorie == "voix" ||
                    notif.event.document.cathegorie == "audio"
                  ) {
                    option["icon"] = this.BASE + "assets/img/audio.png";
                  } else {
                    if (notif.event.document.cathegorie == "video") {
                      option["icon"] = this.BASE + "assets/img/video.png";
                    } else {
                      if (notif.event.document.cathegorie == "link") {
                        option["icon"] = "/assets/img/link.png";
                      }
                    }
                  }
                }

                option["data"]["url"] = "/dashboard/" + notif.event._id;
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

          return true;
        }
      return false;
    },
    charger() {
      this.updateBackGroundSize(-1);
      this.updateBackGroundSize(1);
      setTimeout(() => {
        this.load = true;
      }, 200);
    }
  },

  data() {
    return {
      
      installBar: false,
      shareApi: navigator.share,
      snackbar: false,
      RANGE: process.env.IMAGE_PREVIEW_RESIZE_RANGE || 4,
      text: "",
      pile: [],
      dialog: false,
      imgs: [],
      img: {
        name: "fdf",
        src: ""
      },
      startPaiement: false,
      paiementAnalitic: null,
      BASE: process.env.BASE_URL,
      isMobile: true,
      previewImage: {},
      overlay: false,
      overlayBackGroundSize: 100,
      focus: true,
      key: 0,
      load: false,
      previewPdf: {},
      pdf: false,
      notification:
        window["Notification"] ||
        window["mozNotification"] ||
        window["webkitNotification"],
      sound: new Audio("assets/audio/mp3/definite.mp3"),
      notifPermission:
        getVoterData("notif") !== "" ? getVoterData("notif") : true
    };
  },
  components: {
    CheckCookies
  },
  computed: {
    backAjuste() {
      return {
        "background-image": `url('${this.previewImage.src}')`,
        "background-size": `${this.overlayBackGroundSize}%`
      };
    }
  },
  mounted() {},
  head: {
    meta: [
      { name: "application-name", content: `${process.env.APP_NAME}` },
      { name: "apple-mobile-web-app-title", content: `${process.env.APP_NAME}` }
    ],
    script: [
      {
        t: "application/ld+json",
        i: JSON.stringify(require("../config/shema.json"))
      },
      { type: "text/javascript", src: "/assets/js/installSDK.js", body: false }
    ],
    style: [
      { type: "text/css", i: require("./assets/css/emojionearea.min.css") }
    ]
  }
};
</script>
<style >
.viewer {
  display: none;
}
body {
  padding: unset !important;
}
img.emojione {
  height: 20px !important;
}
.md-overlay {
  z-index: 1031 !important;
}
.md-dialog {
  z-index: 1032 !important;
}
</style>