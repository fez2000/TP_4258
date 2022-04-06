<template>
  <md-toolbar
    id="toolbar"
    md-elevation="0"
    class="md-transparent md-absolute"
    :class="extraNavClasses"
    :color-on-scroll="colorOnScroll"
  >
    <div class="md-toolbar-row md-collapse-lateral">
      <div class="md-toolbar-section-start">
        <v-img :src="logo" aspect-ratio="1" class="grey lighten-2" max-width="50" max-height="50"></v-img>
        <v-tooltip bottom>
          <template></template>
          <span>{{appName}}</span>
        </v-tooltip>
        <!--<h3 class="md-title">{{appName}}</h3>-->
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: toggledClass }"
          @click="toggleNavbarMobile()"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <div class="md-collapse-wrapper">
            <md-list>
              <md-list-item>
                <router-link to="/home">
                  <i class="material-icons">home</i>
                  <p>{{$t("navbar.about")}}</p>
                </router-link>
              </md-list-item>

              <md-list-item v-if="login" class="md-white">
                <router-link to="/dashboard">
                  <i class="material-icons">apps</i>
                  <p v-t.preserve="'navbar.dashboard'"></p>
                </router-link>
              </md-list-item>
              <md-list-item v-if="login" class="md-white">
                <router-link to="/members">
                  <i class="material-icons">group_outline</i>
                  <p v-t.preserve="'navbar.members'"></p>
                </router-link>
              </md-list-item>
              <li class="md-list-item">
                <a
                  href="javascript:void(0)"
                  class="md-list-item-router md-list-item-container md-button-clean dropdown"
                >
                  <div class="md-list-item-content">
                    <drop-down direction="down">
                      <md-button
                        slot="title"
                        class="md-button md-button-link md-white md-simple dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        <v-icon>mdi-wallet-travel</v-icon>
                        <p>{{$t("navbar.projet")}}</p>
                      </md-button>
                      <ul style="overflow: visible;" class="dropdown-menu dropdown-with-icons">
                        <li>
                          <router-link to="/projects">
                            <i class="material-icons">list_alt</i>
                            <p>{{$t("navbar.projetAll")}}</p>
                          </router-link>
                        </li>
                        <li>
                          <router-link to="/projects/finished">
                            <i class="material-icons">content_paste</i>
                            <p>{{$t("navbar.projetEnd")}}</p>
                          </router-link>
                        </li>
                        <li>
                          <router-link to="/projects/current">
                            <i class="material-icons">layers</i>
                            <p>{{$t("navbar.projetCurrent")}}</p>
                          </router-link>
                        </li>
                        <li>
                          <router-link to="/projects/future">
                            <i class="material-icons">ballot</i>
                            <p>{{$t("navbar.projetNext")}}</p>
                          </router-link>
                        </li>
                      </ul>
                    </drop-down>
                  </div>
                </a>
              </li>

              <li v-if="!login" class="md-list-item">
                <a
                  href="javascript:void(0)"
                  class="md-list-item-router md-list-item-container md-button-clean dropdown"
                >
                  <div class="md-list-item-content">
                    <drop-down direction="down">
                      <md-button
                        slot="title"
                        class="md-button md-button-link md-white md-simple dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        <v-icon>mdi-account-group-outline</v-icon>
                        <p>{{$t("navbar.community")}}</p>
                      </md-button>
                      <ul style="overflow: visible;" class="dropdown-menu dropdown-with-icons">
                        <li>
                          <router-link to="/login">
                            <i class="material-icons">fingerprint</i>
                            <p>{{$t("navbar.login")}}</p>
                          </router-link>
                        </li>
                        <li>
                          <router-link to="/signup">
                            <i class="material-icons">account_circle_outline</i>
                            <p>{{$t("navbar.signup")}}</p>
                          </router-link>
                        </li>
                        <li>
                          <router-link to="/members">
                            <v-icon>mdi-account-group-outline</v-icon>
                            <p>{{$t('navbar.members')}}</p>
                          </router-link>
                        </li>
                      </ul>
                    </drop-down>
                  </div>
                </a>
              </li>

              <md-list-item :href="twitter" target="_blank" v-if="!login">
                <i class="fab fa-twitter"></i>
                <p class="hidden-lg">Twitter</p>
                <md-tooltip
                  :md-direction="($vuetify.breakpoint.xs)?'left':'bottom'"
                >{{$t("navbar.twitter")}}</md-tooltip>
              </md-list-item>
              <md-list-item :href="linkedin" target="_blank" v-if="!login">
                <i class="fab fa-linkedin"></i>
                <p class="hidden-lg">Linkedin</p>
                <md-tooltip
                  :md-direction="($vuetify.breakpoint.xs)?'left':'bottom'"
                >{{$t('navbar.linkedin_title')}}</md-tooltip>
              </md-list-item>
              <md-list-item :href="tg" target="_blank" v-if="!login">
                <i class="fab fa-telegram"></i>
                <p class="hidden-lg">Telegram</p>
                <md-tooltip
                  :md-direction="($vuetify.breakpoint.xs)?'rigth':'bottom'"
                >{{$t('navbar.telegram')}}</md-tooltip>
              </md-list-item>
              <md-list-item href="/dashboard/notifications" v-if="login">
                <v-badge
                  :color="'primary'"
                  v-model="seeNbNotif"
                  :overlap="true"
                  class="align-self-center"
                >
                  <template v-slot:badge>
                    <span>{{notifsNb}}</span>
                  </template>
                </v-badge>
                <i class="fab fas fa-bell"></i>
                <p class="hidden-lg">{{$t('navbar.notification')}}</p>
                <md-tooltip
                  :md-direction="($vuetify.breakpoint.xs)?'left':'bottom'"
                >{{(notifsNb == 0)?$t('navbar.notification_title'):$t('navbar.notification_title2', notifsNb) }}</md-tooltip>
              </md-list-item>

              <md-list-item :href="fb" target="_blank" v-if="!login">
                <i class="fab fa-facebook-square"></i>
                <p class="hidden-lg">Facebook</p>
                <md-tooltip
                  :md-direction="($vuetify.breakpoint.xs)?'left':'bottom'"
                >{{$t("navbar.facebook")}}</md-tooltip>
              </md-list-item>
              <md-list-item :href="instagram" target="_blank" v-if="!login">
                <i class="fab fa-instagram"></i>
                <p class="hidden-lg">Instagram</p>
                <md-tooltip md-direction="bottom">{{$t("navbar.instagram")}}</md-tooltip>
              </md-list-item>
              <md-list-item v-if="login" class="md-white" href="/dashboard/forum">
                <i class="material-icons">message-text</i>
                {{$t("navbar.forum")}}
              </md-list-item>
              
              <li class="md-list-item">
                <a
                  href="javascript:void(0)"
                  class="md-list-item-router md-list-item-container md-button-clean dropdown"
                >
                  <div class="md-list-item-content">
                    <drop-down direction="down">
                      <md-button
                        slot="title"
                        class="md-button md-button-link md-white md-simple dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        <i class="fas fa-language"></i>
                        <p>{{h_lang[$i18n.locale]}}</p>
                      </md-button>
                      <ul style="overflow: visible;" class="dropdown-menu dropdown-with-icons">
                        <li
                          v-for="(lang, i) in langs"
                          :key="`Lang${i}`"
                          @click="change_lang(lang.key)"
                        >
                          <a href="javascript:void(0)">
                            <p>{{lang.text}}</p>
                          </a>
                        </li>
                      </ul>
                    </drop-down>
                  </div>
                </a>
              </li>
            </md-list>
          </div>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
let resizeTimeout;
function resizeThrottler(actualResizeHandler) {
  // ignore resize events as long as an actualResizeHandler execution is in the queue
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(() => {
      resizeTimeout = null;
      actualResizeHandler();

      // The actualResizeHandler will execute at a rate of 15fps
    }, 66);
  }
}

import MobileMenu from "../layout/MobileMenu";
import { mode_exact } from "@/fonctions.js";
export default {
  components: {
    MobileMenu
  },
  props: {
    type: {
      type: String,
      default: "white",
      validator(value) {
        return [
          "white",
          "default",
          "primary",
          "danger",
          "success",
          "warning",
          "info"
        ].includes(value);
      }
    },
    colorOnScroll: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      langs: [
        {
          key: "fr",
          text: "Français"
        },
        {
          key: "en",
          text: "English"
        }
      ],
      h_lang: {
        fr: "Français",
        en: "English"
      },
      fb: process.env.fb,
      tg: process.env.telegram,
      instagram: process.env.instagram,
      twitter: process.env.twitter,
      linkedin: process.env.linkedin,
      notifMenu: false,
      notifsNb: 0,
      extraNavClasses: "",
      toggledClass: false,
      appName: process.env.APP_NAME,
      logo: require("../assets/img/Jk_logo.png"),
      selected: [],
      notifs: [],
      seeNbNotif: 0,
      mobileDevice: false,
      login: false,
      voter: {},
      BASE: process.env.BASE_URL
    };
  },
  computed: {},
  beforeUpdate() {},
  beforeDestroy() {
    if (secureSocket) {
      secureSocket.removeListener("connect", this.waitConnect);
      secureSocket.removeListener(
        "reconnect_attempt",
        this.waitReconnectAttempt
      );
      secureSocket.removeListener("reconnect", this.waitReconnect);

      secureSocket.removeListener("unReadNotifCount", this.countUnRead);
    }
    document.removeEventListener("scroll", this.scrollListener);
  },
  methods: {
    change_lang(code) {
      this.$i18n.locale = code;
    },
    fetchNb() {
      this.$axios
        .get("/api/voter/nb")
        .then(rep => {
          if (rep.data.status) {
            this.nb = rep.data.nb;
          }
        })
        .catch(err => {
          this.$root.$emit("snackbar", { display: true });
          this.$root.$emit("neterror", { err: err, callback: this.fetchNb });
        });
    },
    checkDevice() {
      this.mobileDevice = /iPhone|iPad|iPod|Android|Mobile/i.test(
        navigator.userAgent
      );
    },
    waitConnect() {
      secureSocket.io.opts.query = {
        Token: this.$Cookies.get("XSRF-TOKEN")
      };
    },
    waitReconnectAttempt() {
      //demander une new token
      secureSocket.io.opts.query = {
        Token: this.$Cookies.get("XSRF-TOKEN")
      };
    },
    waitReconnect(socket) {
      secureSocket.emit("getUnReadNotifCount");
    },
    seeNotif(data) {
      secureSocket.emit("getUnReadNotifCount");
    },
    mode_exact,
    setRead(id, actual) {
      if (!actual) {
        secureSocket.emit("setReadNotif", id);
      }
    },
    navigateTo(link) {
      if (location.pathname != link) {
        this.loading = true;
        this.$router.push(link);
      }
    },
    bodyClick() {
      let bodyClick = document.getElementById("bodyClick");

      if (bodyClick === null) {
        let body = document.querySelector("body");
        let elem = document.createElement("div");
        elem.setAttribute("id", "bodyClick");
        body.appendChild(elem);

        let bodyClick = document.getElementById("bodyClick");
        bodyClick.addEventListener("click", this.toggleNavbarMobile);
      } else {
        bodyClick.remove();
      }
    },
    toggleNavbarMobile() {
      this.NavbarStore.showNavbar = !this.NavbarStore.showNavbar;
      this.toggledClass = !this.toggledClass;

      this.bodyClick();
    },
    handleScroll() {
      let scrollValue =
        document.body.scrollTop || document.documentElement.scrollTop;
      let navbarColor = document.getElementById("toolbar");
      this.currentScrollValue = scrollValue;
      if (!navbarColor) {
        return window.removeEventListener("scroll", this.handleScroll);
      }
      if (this.colorOnScroll > 0 && scrollValue > this.colorOnScroll) {
        this.extraNavClasses = `md-${this.type}`;

        navbarColor.classList.remove("md-transparent");
      } else {
        if (this.extraNavClasses) {
          this.extraNavClasses = "";
          navbarColor.classList.add("md-transparent");
        }
      }
    },
    scrollListener() {
      resizeThrottler(this.handleScroll);
    },
    countUnRead(data) {
      this.notifsNb = data;
    },
    scrollToElement() {
      let element_id = document.getElementById("downloadSection");
      if (element_id) {
        element_id.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    },
    checkLogin() {
      if (this.login) {
        this.$axios
          .get("/api/debut")
          .then(({ data }) => {
            this.login = data.status;
            this.$Cookies.set("login", this.login);
          })
          .catch(err => {
            this.$root.$emit("neterror", {
              err: err,
              callback: this.checkLogin
            });
          });
      }
    }
  },
  created() {
    this.login = this.$Cookies.get("login") == "true";
    this.checkLogin();
    if (this.login && !secureSocket) {
      secureSocket = io(
        "/voter/" +
          JSON.parse(this.$Cookies.get(this.$Cookies.get("voter")))["_id"],
        {
          query: {
            Token: this.$Cookies.get("XSRF-TOKEN")
          },
          autoConnect: false
        }
      );
      secureSocket.on("connect", this.waitConnect);
      secureSocket.on("reconnect_attempt", this.waitReconnectAttempt);
      secureSocket.on("reconnect", this.waitReconnect);
    }
    if (secureSocket) {
      secureSocket.on("unReadNotifCount", this.countUnRead);

      secureSocket.open();

      secureSocket.emit("getUnReadNotifCount");

      this.voter = JSON.parse(this.$Cookies.get(this.$Cookies.get("voter")));
    }

    this.$root.$on("login", data => (this.login = data));
  },
  mounted() {
    document.addEventListener("scroll", this.scrollListener);
    window.addEventListener("resize", this.checkDevice);
    this.checkDevice();
  },
  watch: {
    notifsNb() {
      this.seeNbNotif = this.notifsNb > 0;
    }
  }
};
</script>
<style scoped>
.chose {
  cursor: pointer;
  border: none;
}
.chose option {
  border: none;
  background-color: white;
  color: grey;
}
@media (max-width: 991px) {
  .md-toolbar .md-collapse {
    display: block !important;
  }
}
</style>
