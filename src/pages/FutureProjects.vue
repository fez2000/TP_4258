<template>
  <div class="wrapper">
    <parallax class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="md-layout">
          <div class="md-layout-item md-size-50 md-small-size-70 md-xsmall-size-100">
            <h1 class="title">
              <span v-text="nb"></span> project(s)
            </h1>
            <h4>{{$t('futurprojet.title')}}</h4>
            <br />

            <md-button @click="donate" class="md-success md-lg" target="_blank">
              <i
                style="font-size: 2.1rem!important;right: 10px;position: relative;"
                class="mdi v-icon notranslate mdi-charity"
              ></i>
              {{$t('donate.title')}}
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
              <h2 class="title text-center">{{$t('donate.objet')}}</h2>
              <h5 class="text-center">{{$t('donate.why')}}</h5>
              <p class="description" style="text-align:justify">{{$t('donate.description0')}}</p>
              <p class="description" style="text-align:justify">
                {{$t('donate.description1')}}
                <strong>{{$t('donate.slogan')}}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="section text-center">
        <div class="container">
          <h2 class="title">{{$t('donate.header')}}</h2>
          <div class="team">
            <div class="md-layout">
              <div
                v-for="project of projects"
                :key="project._id"
                class="md-layout-item md-medium-size-33 md-small-size-100"
              >
                <div class="team-player">
                  <md-card md-with-hover>
                    <router-link :to="'/project/'+project.url">
                      <v-img
                        max-width="100%"
                        height="250"
                        :src="'/api/img/'+project.image.src"
                        :alt="project.image.src"
                      ></v-img>
                    </router-link>
                    <h4 class="card-title">
                      <router-link :to="'/project/'+project.url">{{project.name}}</router-link>

                      <br />
                      <small class="card-description text-muted">{{project.short_description}}</small>
                    </h4>

                    <md-card-content>
                      <p
                        class="card-description"
                      >{{ (project.description)?(project.description.length > 200)?project.description.substr(0,150)+'...':project.description:''}}</p>
                      <p class="card-description">
                        <i>{{(project.state == 'accepted')?'En attente de selection':(project.state == 'submited')?'En cour de selection': (project.state == 'voted')?'En cour d\'implementation':'Future'}}</i>
                      </p>
                    </md-card-content>

                    <md-card-actions style="justify-content: center;" class="text-center">
                      <router-link :to="'/project/'+project.url">
                        <v-badge :color="'green'" :overlap="true" class="align-self-center">
                          <template v-slot:badge>
                            <span>{{(project.docs)?project.docs.length:''}}</span>
                          </template>
                          <v-icon>mdi-file</v-icon>
                        </v-badge>
                        <md-tooltip
                          md-direction="bottom"
                        >{{(project.docs.length > 0)? project.docs.length+' document(s)':'pas de document'}}</md-tooltip>
                      </router-link>
                      <v-badge :overlap="true" class="align-self-center">
                        <template v-slot:badge>
                          <span>3</span>
                        </template>
                        <v-btn icon>
                          <v-icon>mdi-heart</v-icon>
                          <md-tooltip md-direction="bottom">J'aime</md-tooltip>
                        </v-btn>
                      </v-badge>

                      <v-btn @click="donate2(project)" icon>
                        <v-icon>mdi-charity</v-icon>
                        <md-tooltip md-direction="bottom">Soutenir</md-tooltip>
                      </v-btn>
                      <router-link v-if="project.voter" :to="'/in/'+project.voter.url">
                        <v-btn icon></v-btn>
                        <v-avatar>
                          <img :src="'/api/img/'+project.voter.image.src" :alt="project.voter.name" />
                        </v-avatar>

                        <md-tooltip
                          md-direction="bottom"
                        >Initiateur {{project.voter.name.substr(0,50)}}</md-tooltip>
                      </router-link>
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
export default {
  bodyClass: "landing-page",
  props: {
    header: {
      type: String,
      default: require("../assets/img/bg1.jpeg")
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
      inner: "Future projects",
      separator: " | ",
      complement: process.env.APP_NAME
    },
    meta: [
      {
        name: "google-signin-client_id",
        content:
          "447943189088-u3tai7quivionscm6oe1ddggiu4m2bl6.apps.googleusercontent.com"
      },
      { name: "description", content: "pages des projects future" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@JK" },
      { name: "twitter:title", content: `members | ${process.env.APP_NAME}` },
      { name: "twitter:description", content: "pages des projects future" },
      { name: "twitter:image", content: "/assets/img/apple-icon.png" },
      { property: "fb:app_id", content: "123456789" },
      {
        property: "og:title",
        content: `Future projects | ${process.env.APP_NAME}`
      },
      { property: "og:site_name", content: `${process.env.APP_NAME}` },
      {
        property: "og:url",
        content: `${process.env.BASE_URL || ""}projects/future`
      },
      { property: "og:description", content: "description" },
      { property: "og:image", content: "/assets/img/apple-icon.png" },
      { property: "og:image:type", content: "image/png" },
      { name: "author", content: `${process.env.AUTOR},${process.env.AUTOR2}` }
    ],
    link: [
      {
        rel: "canonical",
        href: `${process.env.BASE_URL || ""}projects/future`,
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
      projects: [],
      continuer: false,
      startPaiement: false
    };
  },
  created() {
    this.fetchNb();
    this.getvoterstart();
  },
  methods: {
    donate2(p){
      this.$root.$emit("startPaiement",p);
    },
    donate() {
      this.$root.$emit("startPaiement");
    },
    fetchNb() {
      this.$axios
        .get("/api/project/filter/voted/nb")
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
        .get("/api/project/filter/voted/findallstart")
        .then(({ data }) => {
          if (data.status) {
            this.projects = data.projects;
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
        .get("/api/project/filter/voted/findallnext")
        .then(({ data }) => {
          if (data.status) {
            this.projects.push(data.projects);
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
