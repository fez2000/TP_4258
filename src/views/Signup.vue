<template>
  <div class="wrapper">
    <div class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="md-layout">
          <div
            class="md-layout-item md-size-33 md-small-size-66 md-xsmall-size-100 md-medium-size-40 mx-auto"
          >
            <login-card header-color="green">
              <h4 slot="title" class="card-title">{{$t("signup.title")}}</h4>
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
                slot="buttons"
                href="javascript:void(0)"
                @click="google()"
                :disabled="submiting"
                class="md-just-icon md-simple md-white"
              >
                <i class="fab fa-google"></i>
              </md-button>
              <p slot="description" class="description">{{$t("signup.description")}}</p>
              <md-field :class="nameClass" :md-counter="false" class="md-form-group" slot="inputs">
                <md-icon>face</md-icon>
                <label>{{$t("signup.first_name")}}</label>
                <md-input
                  v-model="name"
                  type="text"
                  :maxlength="name_max_length"
                  :minlength="name_min_length"
                ></md-input>
                <span v-if="!name_errors&&name" class="md-suffix">
                  <md-icon>check</md-icon>
                </span>
                <span v-if="name_errors&&name" class="md-suffix">
                  <md-icon>error</md-icon>
                </span>
                <span class="md-error">{{name_errors}}</span>
                <span
                  v-if="!name_errors || !name"
                  class="md-helper-text"
                >{{$t("signup.m_length")}} {{name_min_length}}</span>
              </md-field>
              <md-field :class="emailClass" class="md-form-group" slot="inputs">
                <md-icon>email</md-icon>
                <label>{{$t("signup.email")}}</label>
                <md-input v-model="email" autocomplete="on" type="email"></md-input>
                <span v-if="email_ok&&!email_test" class="md-suffix">
                  <md-icon>check</md-icon>
                </span>
                <span
                  v-if="(!email_ok&&email&&!email_test)||(email_errors&&!email_test&&email)"
                  class="md-suffix"
                >
                  <md-icon>error</md-icon>
                </span>
                <span v-if="email_test" class="md-suffix">
                  <md-progress-spinner :md-diameter="20" :md-stroke="4" md-mode="indeterminate"></md-progress-spinner>
                </span>
                <span class="md-error">{{$t("signup.i_email")}} {{email_errors_msg}}</span>
              </md-field>
              <md-field
                :class="passwordClass"
                :md-counter="false"
                :md-toggle-password="false"
                class="md-form-group"
                slot="inputs"
              >
                <md-icon>lock_outline</md-icon>
                <label>{{$t("signup.password")}}</label>
                <md-input
                  v-model="password"
                  autocomplete="off"
                  :maxlength="password_max_length"
                  type="password"
                  :minlength="password_min_length"
                ></md-input>
                <span v-if="!password_errors && password " class="md-suffix">
                  <md-icon>check</md-icon>
                </span>
                <span v-if="password_errors&&password" class="md-suffix">
                  <md-icon>error</md-icon>
                </span>
                <span class="md-error">{{$t("signup.invalid_password")}}</span>
                <span
                  v-if="password_errors && !password"
                  class="md-helper-text"
                >{{$t("signup.m_length")}} {{password_min_length}}</span>
              </md-field>
              <md-checkbox slot="inputs" v-model="acceptTerms">
                {{$t("signup.rule")}},
                <router-link to="/terms/comunity">{{$t("signup.terms")}}</router-link>
                {{$t("signup.ruleAnd")}}
                <router-link to="/terms/privacypolicy">{{$t("signup.datapolicy")}}</router-link>
                {{$t("signup.ruleEnd")}}
              </md-checkbox>
              <md-button
                slot="footer"
                @click="register()"
                v-bind:disabled=" !acceptTerms || submiting || !email_ok || password.length < password_min_length || name.length < name_min_length || !email || !name || !password"
                class="md-simple md-success md-lg"
              >{{$t("signup.button")}}</md-button>
            </login-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LoginCard } from "../components";
import Cookies from "js-cookie";
import i18n from "@/plugins/i18n";
export default {
  beforeRouteEnter(to, from, next) {
    if (Cookies.get("login") == "true") {
      return next("/dashboard");
    }
    next();
  },
  head: {
    title: {
      inner: i18n.tc("signup.head_title"),
      separator: ` ${i18n.tc("profilPublic.on")} `,
      complement: process.env.APP_NAME
    },
    meta: [
      {
        id: "meta_description",
        name: "description",
        content: `${i18n.tc("signup.head_title")} ${i18n.tc(
          "profilPublic.on"
        )} ${process.env.APP_NAME}`
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@KofficielJ" },
      {
        id: "twitter_title",
        name: "twitter:title",
        content: `${i18n.tc("signup.head_title")} ${i18n.tc(
          "profilPublic.on"
        )} ${process.env.APP_NAME}`
      },
      { id: "twitter_description", name: "twitter:description", content: "Singup in jesusKing " },
      { id: "twitter_image", name: "twitter:image", content: "/assets/img/apple-icon.png" },
      
      {
        id: "og_title",
        property: "og:title",
        content: `${i18n.tc("signup.head_title")} ${i18n.tc(
          "profilPublic.on"
        )} ${process.env.APP_NAME}`
      },
      { id: "og_url", property: "og:url", content: `${process.env.BASE_URL || ""}signup/` },
      {
        id: "og_description",
        property: "og:description",
        content: `${i18n.tc("signup.head_title")} ${i18n.tc(
          "profilPublic.on"
        )} ${process.env.APP_NAME}`
      },
      
    ],
    link: [
      {
        rel: "canonical",
        href: `${process.env.BASE_URL || ""}signup/`,
        id: "canonical"
      },
      { rel: "author", href: "https://fezeueugene.web.app" }
    ],
    script: [
      //{ type: 'text/javascript', inner: , body: true},
    ]
  },
  components: {
    LoginCard
  },
  bodyClass: "login-page",
  data() {
    return {
      acceptTerms: false,
      name: "",
      emails_tester: {},
      email: "",
      password: "",
      email_test: false,
      email_ok: false,
      submiting: false,
      email_errors_msg: "",
      name_min_length: process.env.NAME_MIN_LENGTH || 3,
      password_min_length: process.env.PASSWORD_MIN_LENGTH || 3,
      name_max_length: process.env.NAME_MAX_LENGTH || 15,
      password_max_length: process.env.PASSWORD_MAX_LENGTH || 15,
      BASE_URL: process.env.BASE_URL,
      token: "",
      child: ""
    };
  },
  props: {
    header: {
      type: String,
      default: require("../assets/img/Photo_by_Tyck_via_Iwaria.jpeg").default
    }
  },
  mounted() {
    this.$Cookies.set("login", false);
  },
  methods: {
    linkedin() {
      if (this.child) this.child.close();

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
      this.child = null;
    },
    waitChildMessage(rep) {
      if (rep.origin  == location.origin) {
        if (!rep.data.status) {
          this.submiting = false;
          this.child.close();
          return (this.child = "");
        }
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
        this.child.close();
        this.child = "";
        window.removeEventListener("message", this.waitChildMessage);
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
                    secureSocket = null;
                    this.$router.push("/dashboard");
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
                    secureSocket = null;
                    this.$router.push("/dashboard");
                  }
                })
                .catch(err => {
                  this.submiting = false;
                  this.$root.$emit("snackbar", {
                    display: true
                  });
                });
            } else {
              this.submiting = false;
              this.$root.$emit("snackbar", {
                display: true,
                text: i18n.tc('signup.a_login')
              });
              // The person is not logged into your webpage or we are unable to tell.
            }
          },
          { scope: "public_profile,email,user_link" }
        );
      } catch (err) {
        this.submiting = false;
        this.$root.$emit("snackbar", {
          display: true,
          text: i18n.tc('signup.r_page')
        });
      }
    },
    email_ok_test() {
      this.email_errors_msg = "";
      if (this.emails_tester[this.email]) {
        this.email_ok = this.emails_tester[this.email].status;
        this.emails_tester[this.email] = null;
        return;
      }
      this.emails_tester[this.email] = {};
      if (!this.email_test) {
        this.email_test = true;
        this.$axios
          .post(
            "/api/testmail",
            {
              email: this.email
            },
            {
              headers: {
                "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
              }
            }
          )
          .then(rep => {
            if (this.email == rep.data.email) {
              this.emails_tester[this.email]["status"] = rep.data.status;
              this.email_test = false;
              this.email_ok = rep.data.status;
              this.email_errors_msg = i18n.tc('signup.e_taked');
            } else {
              this.email_test = false;
              this.email_ok_test();
            }
          })
          .catch(err => {
            this.email_test = false;
            this.$root.$emit("snackbar", {
              display: true
            });
          });
      }
    },
    register() {
      if (this.child) {
        this.child.close();
        this.child = null;
      }
      this.submiting = true;

      this.$axios
        .post(
          "/api/voter",
          {
            email: this.email,
            name: this.name,
            password: this.password
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
            this.$Cookies.set("login", false);
            this.$Cookies.set("voter", this.email);
            secureSocket = null;
            this.$router.push("/verifyemail");
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
    password_errors() {
      if (this.password.length < this.password_min_length) {
        return i18n.tc('signup.p_invalide') + this.password_min_length;
      }
      return "";
    },
    name_errors() {
      if (this.name.length < this.name_min_length) {
        return i18n.tc('signup.n_invalide')  + this.name_min_length;
      }
      return "";
    },
    email_errors() {
      let valide = (valide = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        this.email
      ));
      if (valide) {
        this.email_ok_test();
        return "";
      } else {
        this.email_ok = false;
        return i18n.tc('signup.i_email');
      }
    },
    nameClass() {
      return {
        "md-error": this.name_errors && this.name,
        "md-valid": !this.name_errors && this.name,
        "md-invalid": this.name_errors && this.name
      };
    },
    emailClass() {
      return {
        "md-error":
          (this.email_errors && this.email) || (!this.email_ok && this.email),
        "md-valid": this.email_ok,
        "md-invalid":
          (this.email_errors && this.email) || (!this.email_ok && this.email)
      };
    },
    passwordClass() {
      return {
        "md-error": this.password_errors && this.password,
        "md-valid": !this.password_errors && this.password,
        "md-invalid": this.password_errors && this.password
      };
    }
  }
};
</script>

<style lang="css" scoped>
.md-field {
  margin-top: 30px !important;
}

</style>
