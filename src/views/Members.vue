<template>
  <div class="wrapper">
    <parallax class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="md-layout">
          <div class="md-layout-item md-size-50 md-small-size-70 md-xsmall-size-100">
            <h1 class="title">
              <span v-text="nb"></span>
              {{$t('members.title')}}
            </h1>
            <h4>{{$t('members.header')}}</h4>
            <br />
            <md-button @click="$router.push('/signup')" class="md-success md-lg" target="_blank">
              <i
                style="font-size: 2.1rem!important;right: 10px;position: relative;"
                class="mdi v-icon notranslate mdi-account-network"
              ></i>
              {{$t("members.button")}}
            </md-button>
          </div>
        </div>
      </div>
    </parallax>
    <div class="main main-raised">
      <div class="section">
        <div class="container">
          <div class="md-layout">
            <div class="md-layout-item md-size-66 md-xsmall-size-100 mx-auto">
              <h2 class="title text-center">{{$t("members.philo")}}</h2>
              <h5 class="text-center">{{$t("members.why")}}</h5>
              <p class="description" style="text-align:justify">{{$t("members.description0")}}</p>
              <p class="description" style="text-align:justify">
                {{$t("members.description1")}}
                <strong>{{$t("members.slogan")}}</strong>
              </p>
              <p class="description" style="text-align:justify">{{$t("members.description2")}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="section text-center">
        <div class="container">
          <h2 class="title">{{$t("members.ourMembers")}}</h2>
          <div class="team">
            <div class="md-layout">
              <div
                v-for="voter of voters"
                :key="voter._id"
                class="md-layout-item md-medium-size-33 md-small-size-100"
              >
                <div class="team-player">
                  <md-card class="md-card-plain">
                    <div class="md-layout-item md-size-50 mx-auto">
                      <router-link :to="'/in/'+voter.url">
                        <img
                          v-if="voter.image"
                          :src="'/api/img/'+voter.image.src"
                          :alt="voter.image.src"
                          class="img-raised rounded-circle img-fluid"
                        />
                      </router-link>
                    </div>
                    <h4 class="card-title">
                      <router-link :to="'/in/'+voter.url">{{voter.name}}</router-link>

                      <br />
                      <small class="card-description text-muted">{{voter.short_bio}}</small>
                    </h4>

                    <md-card-content>
                      <p
                        class="card-description"
                      >{{ (voter.bio)?(voter.bio.length > 200)?voter.bio.substr(0,150)+'...':voter.bio:''}}</p>
                    </md-card-content>

                    <md-card-actions
                      v-if="voter.socials.length > 0"
                      style="justify-content: center;"
                      class="text-center"
                    >
                      <template v-for="link of voter.socials">
                        <md-button
                          v-if="link.value"
                          :key="link._id"
                          :href="link.value"
                          target="_blank"
                          class="md-just-icon md-simple"
                        >
                          <i v-if="link.id == 'Twitter'" class="fab fa-twitter"></i>
                          <i v-if="link.id == 'Linkedin'" class="fab fa-linkedin"></i>
                          <i v-if="link.id == 'Facebook'" class="fab fa-facebook-square"></i>
                          <span v-if="link.id == 'Website'" v-t.preserve="'profil.w_site'"></span>
                        </md-button>
                      </template>
                    </md-card-actions>
                  </md-card>
                </div>
              </div>
              <div class="md-layout">
                <div class="md-layout-item md-size-33 mx-auto text-center">
                  <md-button v-if="continuer" @click="getvoternext()" class="md-success">Plus</md-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import i18n from "@/plugins/i18n";
export default {
  bodyClass: "landing-page",
  props: {
    header: {
      type: String,
      default: require("../assets/img/bg1.jpeg")
    },
    teamImg1: {
      type: String,
      default: require("../assets/img/Jk_logo.png")
    }
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    }
  },
  head: {
    title: {
      inner: i18n.tc("members.h_title"),
      separator: " | ",
      complement: process.env.APP_NAME
    },
    meta: [
      {
        name: "google-signin-client_id",
        content:
          "447943189088-u3tai7quivionscm6oe1ddggiu4m2bl6.apps.googleusercontent.com"
      },
      { id: "meta_description", name: "description", content: i18n.tc("members.description2") },

      {
        id: "twitter_title",
        name: "twitter:title",
        content: `${i18n.tc("members.h_title")} | ${process.env.APP_NAME}`
      },
      { id: "twitter_description",
        name: "twitter:description", content: i18n.tc("members.description2") },

      {
        id: "og_title",
        property: "og:title",
        content: `${i18n.tc("members.h_title")} | ${process.env.APP_NAME}`
      },

      { id: "og_url", property: "og:url", content: `${process.env.BASE_URL || ""}members/` },
      { id: "og_description", property: "og:description", content: i18n.tc("members.description2") },

    ],
    link: [
      {
        rel: "canonical",
        href: `${process.env.BASE_URL || ""}members/`,
        id: "canonical"
      },
      {
        rel: "author",
        href: `${process.env.AUTORREF},${process.env.AUTORREF2}`
      }
    ]
  },
  data() {
    return {
      nb: 0,
      voters: [],
      continuer: false
    };
  },
  created() {
    this.fetchNb();
    this.getvoterstart();
  },
  methods: {
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
    getvoterstart() {
      this.$axios
        .get("/api/voter/findallstart")
        .then(({ data }) => {
          if (data.status) {
            this.voters = data.voters;
            this.continuer = data.continue;
          }
        })
        .catch(() => {
          this.$root.$emit("neterror", {
            err: err,
            callback: this.getvoterstart
          });
        });
    },
    getvoternext() {
      this.$axios
        .get("/api/voter/findallnext")
        .then(({ data }) => {
          if (data.status) {
            this.voters.push(data.voters);
            this.continuer = data.continue;
          }
        })
        .catch(() => {
          this.$root.$emit("neterror", {
            err: err,
            callback: this.getvoterstart
          });
        });
    }
  }
};
</script>

<style>
</style>
