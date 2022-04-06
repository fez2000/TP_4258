<template>
  <div class="wrapper">
    <div class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="md-layout">
          <div
            class="md-layout-item md-size-33 md-small-size-66 md-xsmall-size-100 md-medium-size-40 mx-auto"
          >
            <login-card header-color="green">
              <h4 slot="title" class="card-title">{{$t("login.title")}}</h4>
              <md-button
                slot="buttons"
                @click="fd_signup()"
                class="md-just-icon md-simple md-white"
                :disabled="submiting"
              >
                <i class="fab fa-facebook-square"></i>
              </md-button>
              <md-button
                slot="buttons"
                href="javascript:void(0)"
                class="md-just-icon md-simple md-white"
                :disabled="submiting"
                @click="linkedin()"
              >
                <i class="fab fa-linkedin"></i>
              </md-button>
              <md-button
                :disabled="submiting"
                @click="google()"
                slot="buttons"
                href="javascript:void(0)"
                class="md-just-icon md-simple md-white"
              >
                <i class="fab fa-google"></i>
              </md-button>
              <p slot="description" class="description">{{$t("login.description")}}</p>
              <md-field :class="nameClass" :md-counter="false" class="md-form-group" slot="inputs">
                <md-icon>face</md-icon>
                <label>{{$t("login.user")}}</label>
                <md-input v-model="name" type="text" :maxlength="name_max_length"></md-input>
                <span v-if="name_errors&&name" class="md-suffix">
                  <md-icon>error</md-icon>
                </span>
              </md-field>

              <md-field
                :class="passwordClass"
                :md-counter="false"
                class="md-form-group"
                slot="inputs"
              >
                <md-icon>lock_outline</md-icon>
                <label>{{$t("login.password")}}</label>
                <md-input
                  v-model="password"
                  autocomplete="on"
                  :maxlength="password_max_length"
                  type="password"
                ></md-input>
                <span class="md-error">{{password_errors}}</span>
              </md-field>
              <router-link
                slot="inputs"
                class="recup"
                to="/resetpassword"
              >{{$t("login.resetpassword")}}</router-link>
              <md-button
                slot="footer"
                @click="login()"
                v-bind:disabled=" submiting   || !name || !password"
                class="md-simple md-success md-lg"
              >{{$t("login.button")}}</md-button>
            </login-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LoginCard } from "@/components";
import * as Cookies from "js-cookie";
import i18n from "@/plugins/i18n";

export default {
  created() {
    // var profile = googleUser.getBasicProfile();
  },
  mounted() {
    this.$Cookies.set("login", false);
  },
  beforeRouteEnter(to, from, next) {
    if (Cookies.get("login") == "true") {
      return next("/dashboard");
    }
    next();
  },
  head: {
    title: {
      inner: i18n.tc("login.head_title"),
      separator: ` ${i18n.tc("profilPublic.on")} `,
      complement: process.env.APP_NAME
    },
    meta: [
      {
        name: "google-signin-client_id",
        content:
          "447943189088-u3tai7quivionscm6oe1ddggiu4m2bl6.apps.googleusercontent.com"
      },
      { name: "google-signin-scope", content: "profile email" },
      {
        name: "description",
        content: `${i18n.tc("login.head_title")} ${i18n.tc(
          "profilPublic.on"
        )} ${process.env.APP_NAME}`
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@KofficielJ" },
      {
        name: "twitter:title",
        content: `${i18n.tc("login.head_title")} ${i18n.tc(
          "profilPublic.on"
        )} ${process.env.APP_NAME}`
      },
      {
        name: "twitter:description",
        content: `${i18n.tc("login.head_title")} ${i18n.tc(
          "profilPublic.on"
        )} ${process.env.APP_NAME}`
      },
      { name: "twitter:image", content: "/assets/img/apple-icon.png" },
      { property: "fb:app_id", content: "123456789" },
      {
        property: "og:title",
        content: `${i18n.tc("login.head_title")} ${i18n.tc(
          "profilPublic.on"
        )} ${process.env.APP_NAME}`
      },
      { property: "og:site_name", content: `${process.env.APP_NAME}` },
      { property: "og:url", content: `${process.env.BASE_URL || ""}login/` },
      { property: "og:description", content: "login in jesusKing" },
      { property: "og:image", content: "/assets/img/apple-icon.png" },
      { property: "og:image:type", content: "image/png" },
      { name: "author", content: `${process.env.AUTOR},${process.env.AUTOR2}` }
    ],
    link: [
      {
        rel: "canonical",
        href: `${process.env.BASE_URL || ""}login/`,
        id: "canonical"
      },
      {
        rel: "author",
        href: `${process.env.AUTORREF},${process.env.AUTORREF2}`
      }
    ],
    script: []
  },
  components: {
    LoginCard
  },
  bodyClass: "login-page",
  data() {
    return {
      name: "",
      emails_tester: {},
      email: "",
      password: "",
      name_errors: "",
      password_errors: "",
      child: "",
      submiting: false,
      name_max_length: 200,
      password_max_length: process.env.PASSWORD_MAX_LENGTH || 15,
      BASE_URL: process.env.BASE_URL,
      token: ""
    };
  },
  props: {
    header: {
      type: String,
      default: require("../assets/img/Photo_by_Medsile_via_Iwaria.jpeg")
    }
  },
  methods: {
    linkedin() {
      if (this.child) {
        this.child.close();
        this.child = null;
      }
        
        window.addEventListener("message", this.waitChildMessage.bind(this));
      this.child = window.open(
        `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77xuqu4grt8i7r&redirect_uri=${encodeURI(
          location.origin + "/api/auth/linkedin"
        )}&state=fooobar&scope=r_liteprofile%20r_emailaddress%20w_member_social`,
        "popUpWindow",
        `height=${screen.height < 600 ? 305 : screen.height * 0.6}px,width=${
          screen.width < 600 ? 250 : screen.width * 0.5
        }px,left=${
          screen.width < 600 && screen.width > 250
            ? (screen.width - 250) / 2
            : (screen.width - screen.width * 0.5) / 2
        },top=${
          screen.height < 600 && screen.height > 305
            ? (screen.height - 305) / 2
            : (screen.height - screen.height * 0.6) / 2
        },resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=no`
      );
        
    },
    waitChildClose() {
      this.submiting = false;
    },
    waitChildMessage(rep) {
      if (rep.origin  == location.origin) {
        this.child.close();
        this.child = "";
        if (!rep.data.status) {
          return;
        }
        
        this.submiting = true;
        this.token = rep.data.data.access_token;
        this.$axios
          .post(
            "/api/voter/login/linkedin",
            {
              access_token: this.token
            },
            {
              headers: {
                "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
              }
            }
          )
          .then(rep => {
            this.submiting = false;
            if (rep.data.status) {
              this.$Cookies.set(rep.data.voter.email, rep.data.voter);
              this.$Cookies.set("login", true);
              this.$Cookies.set("voter", rep.data.voter.email);
              secureSocket = false;
              let b = new URL(location.href);

              if (history.length && b.searchParams.get("redirect") == "true") {
                history.go(-1);
              } else {
                this.$router.push("/dashboard");
              }
            }
          })
          .catch(err => {
            this.submiting = false;
            this.$root.$emit("snackbar", {
              display: true
            });
          });

        window.removeEventListener("message", this.waitChildMessage);
      }
    },
    fd_signup() {
      if (this.child) {
        this.child.close();
        this.child = null;
      }
      this.submiting = true;
      try {
        FB.login(
          response => {
            if (response.status === "connected") {
              this.$axios
                .post("/api/voter/login/fb", response.authResponse, {
                  headers: {
                    "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
                  }
                })
                .then(rep => {
                  this.submiting = false;
                  if (rep.data.status) {
                    this.$Cookies.set(rep.data.voter.email, rep.data.voter);
                    this.$Cookies.set("login", true);
                    this.$Cookies.set("voter", rep.data.voter.email);
                    this.$i18n.locale = rep.data.voter.language;
                    secureSocket = false;
                    let b = new URL(location.href);

                    if (
                      history.length &&
                      b.searchParams.get("redirect") == "true"
                    ) {
                      history.go(-1);
                    } else {
                      this.$router.push("/dashboard");
                    }
                  }
                })
                .catch(err => {
                  this.submiting = false;
                  this.$root.$emit("snackbar", {
                    display: true
                  });
                });
            } else {
              // The person is not logged into your webpage or we are unable to tell.
              this.submiting = false;
              this.$root.$emit("snackbar", {
                display: true,
                text: i18n.tc('signup.a_login')
              });
            }
          },
          { scope: "public_profile,email,user_link,user_photos" }
        );
      } catch (err) {
        console.log(err);
        this.submiting = false;
        this.$root.$emit("snackbar", { display: true,text: i18n.tc('signup.r_page') });
      }
    },
    google() {
      if (this.child) {
        this.child.close();
        this.child = null;
      }
      this.submiting = true;

      try {
        auth2
          .signIn()
          .then(data => {
            if (data)
              this.$axios
                .post("/api/voter/login/google", data, {
                  headers: {
                    "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
                  }
                })
                .then(rep => {
                  this.submiting = false;
                  if (rep.data.status) {
                    this.$Cookies.set(rep.data.voter.email, rep.data.voter);
                    this.$Cookies.set("login", true);
                    this.$Cookies.set("voter", rep.data.voter.email);
                    this.$i18n.locale = rep.data.voter.language;
                    secureSocket = null;
                    this.$router.push("/dashboard");
                  }else{
                    this.$root.$emit('snackbar',{
                      display: true,
                      text: 'Am error occure on ours server please try agains with an orther method'
                    })
                  }
                  
                })
                .catch(err => {
                  this.submiting = false;
                  this.$root.$emit("snackbar", {
                    display: true
                  });
                });
          })
          .catch(err => {
            this.submiting = false;
            this.$root.$emit("snackbar", {
              display: true
            });
          });
      } catch (e) {
        this.$root.$emit("snackbar", {
          display: true,
          text: i18n.tc('singup.r_page')
        });
        this.submiting = false;
        return;
      }
    },
    login() {
      if (this.child) {
        this.child.close();
        this.child = null;
      }
      this.submiting = true;
      let valide = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        this.name
      );
      let data = { password: this.password };
      if (valide) {
        data["email"] = this.name;
      } else {
        data["name"] = this.name;
      }
      this.$axios
        .post("/api/login", data, {
          headers: {
            "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
          }
        })
        .then(rep => {
          this.submiting = false;
          if (rep.data.status) {
            this.$Cookies.set("login", true);
            this.$Cookies.set("voter", rep.data.voter.email);
            this.$Cookies.set(rep.data.voter.email, rep.data.voter);
            this.$i18n.locale = rep.data.voter.language;
            secureSocket = false;
            let b = new URL(location.href);
            if (history.length && b.searchParams.get("redirect") == "true") {
              history.go(-1);
            } else {
              this.$router.push("/dashboard");
            }
          } else {
            if (rep.data.status == null) {
              if (rep.data.errors == "EMAILNOTVERIFY") {
                this.$Cookies.set("voter", rep.data.email);
                this.$router.push("/verifyemail");
                return;
              }
            }
            this.name_errors = true;
            this.password_errors = i18n.tc('login.i_incorrect');
          }
        })
        .catch(() => {
          this.submiting = false;
          this.$root.$emit("snackbar", {
            display: true
          });
        });
    }
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    },
    nameClass() {
      return {
        "md-error": this.name_errors && this.name,
        "md-valid": !this.name_errors && this.name,
        "md-invalid": this.name_errors && this.name
      };
    },
    passwordClass() {
      return {
        "md-error": this.password_errors && this.password,
        "md-valid": !this.password_errors && this.password,
        "md-invalid": this.password_errors && this.password
      };
    }
  },
  beforeDestroy() {
    if (this.child) {
      this.child.close();
      window.removeEventListener("message", this.waitChildMessage);
    }
  }
};
</script>


<style lang="css">
.md-field {
  margin-top: 30px !important;
}

.recup {
  display: block;
  text-align: right;
  position: relative;
  top: 13px;
}
</style>