<template>
  <div class="wrapper">
    <parallax class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="md-layout">
          <div class="md-layout-item md-size-50 md-small-size-70 md-xsmall-size-100">
            <h1 class="title">{{ $t("landing_lg.h_title") }}</h1>
            <h4>{{ $t("landing_lg.h_description") }}</h4>
            <br />
            <md-button
              href="https://youtu.be/SEAOZuZ-KFw"
              class="md-success md-lg"
              target="_blank"
            >
              <i class="fas fa-play"></i>
              {{$t("landing_lg.h_button")}}
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
              <h2 class="title text-center">{{$t('navbar.projet')}}</h2>
              <h5 class="text-center">{{$t("landing_lg.j_question")}}</h5>
              <p class="description" style="text-align:justify">{{$t("landing_lg.j_reason1")}}</p>
              <p class="description" style="text-align:justify">
                {{$t("landing_lg.j_reason2_1")}}
                <strong>{{$t("landing_lg.j_reason2_2")}}</strong>
                {{$t("landing_lg.j_reason2_3")}}
                <strong>{{$t("landing_lg.j_reason2_4")}}</strong>
              </p>
              <p class="description" style="text-align:justify">{{$t("landing_lg.j_reason3")}}</p>
            </div>
          </div>
          <div class="features text-center">
            <div class="md-layout">
              <div class="md-layout-item md-medium-size-33 md-small-size-100">
                <div class="info">
                  <div class="icon icon-info">
                    <md-icon>flash_on</md-icon>
                  </div>
                  <h4 class="info-title" v-t="'landing_lg.t_electricity'"></h4>
                  <p>
                    {{$t("landing_lg.d_electricity1")}}
                    <br />
                    {{$t("landing_lg.d_electricity2")}}
                  </p>
                </div>
              </div>
              <div class="md-layout-item md-medium-size-33 md-small-size-100">
                <div class="info">
                  <div class="icon icon-success">
                    <md-icon>nature</md-icon>
                  </div>
                  <h4 class="info-title" v-t="'landing_lg.t_agriculture'"></h4>
                  <p>
                    {{$t("landing_lg.d_agriculture1")}}
                    <br />
                    {{$t("landing_lg.d_agriculture2")}}
                  </p>
                </div>
              </div>
              <div class="md-layout-item md-medium-size-33 md-small-size-100">
                <div class="info">
                  <div class="icon icon-danger">
                    <md-icon>home_work</md-icon>
                  </div>
                  <h4 class="info-title">Education</h4>
                  <p>Construction et rehabilitation des infrastructures scolaires( ecoles, universites).</p>
                </div>
              </div>
              <div class="md-layout-item md-medium-size-33 md-small-size-100">
                <div class="info">
                  <div class="icon icon-info">
                    <md-icon>airline_seat_flat</md-icon>
                  </div>
                  <h4 class="info-title">Santé</h4>
                  <p>Construction et rehabilitation des centres de sante de reference.</p>
                </div>
              </div>
              <div class="md-layout-item md-medium-size-33 md-small-size-100">
                <div class="info">
                  <div class="icon icon-danger">
                    <md-icon>map</md-icon>
                  </div>
                  <h4 class="info-title">Infrastructure routière</h4>
                  <p>
                    Construction et rehabilitation des routes dans les zones enclavees.
                    <br />Construction des infrastructures aeoronautiques.
                  </p>
                </div>
              </div>
              <div class="md-layout-item md-medium-size-33 md-small-size-100">
                <div class="info">
                  <div class="icon icon-info">
                    <md-icon>emoji_symbols</md-icon>
                  </div>
                  <h4 class="info-title">Media</h4>
                  <p>Conception et construction d'une chaine de télévision.</p>
                </div>
              </div>
              <div class="md-layout-item md-medium-size-33 md-small-size-100">
                <div class="info">
                  <div class="icon icon-info">
                    <md-icon>deck</md-icon>
                  </div>
                  <h4 class="info-title">Hygiène et salubrité</h4>
                  <p>
                    Construction des douches publiques à gerer par les handicapes.
                    <br />Offrande de 2 poubelles par famille avec pour objectif la transformation des dechets ménagers
                  </p>
                </div>
              </div>
              <div class="md-layout-item md-medium-size-33 md-small-size-100">
                <div class="info">
                  <div class="icon icon-success">
                    <md-icon>public</md-icon>
                  </div>
                  <h4 class="info-title">Gospel</h4>
                  <p>
                    les caravanes mobile d'évangelisation.
                    <br />Construction d'un autel de priere par région.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="section text-center">
        <div class="container">
          <h2 class="title">Notre équipe</h2>
          <div class="team">
            <div class="md-layout">
              <div class="md-layout-item md-medium-size-33 md-small-size-100">
                <div class="team-player">
                  <md-card class="md-card-plain">
                    <div class="md-layout-item md-size-50 mx-auto">
                      <img
                        :src="teamImg1"
                        alt="Thumbnail Image"
                        class="img-raised rounded-circle img-fluid"
                      />
                    </div>
                    <h4 class="card-title">
                      Amour Travail et Developement
                      <br />
                      <small class="card-description text-muted">Association</small>
                    </h4>

                    <md-card-content>
                      <p class="card-description">
                        <!--Description-->
                      </p>
                    </md-card-content>

                    <md-card-actions class="text-center">
                      <!--<md-button
                        href="javascript:void(0)"
                        class="md-just-icon md-simple"
                      >
                        <i class="fab fa-twitter"></i>
                      </md-button>
                      <md-button
                        href="javascript:void(0)"
                        class="md-just-icon md-simple"
                      >
                        <i class="fab fa-instagram"></i>
                      </md-button>
                      <md-button
                        href="javascript:void(0)"
                        class="md-just-icon md-simple"
                      >
                        <i class="fab fa-facebook-square"></i>
                      </md-button>-->
                    </md-card-actions>
                  </md-card>
                </div>
              </div>
              <!--<div class="md-layout-item md-medium-size-33 md-small-size-100">
                <div class="team-player">
                  <md-card class="md-card-plain">
                    <div class="md-layout-item md-size-50 mx-auto">
                      <img
                        :src="teamImg2"
                        alt="Thumbnail Image"
                        class="img-raised rounded-circle img-fluid"
                      />
                    </div>
                    <h4 class="card-title">
                      Carla Hortensia
                      <br />
                      <small class="card-description text-muted"
                        >Designer</small
                      >
                    </h4>

                    <md-card-content>
                      <p class="card-description">
                        You can write here details about one of your team
                        members. You can give more details about what they do.
                        Feel free to add some <a href="#">links</a> for people
                        to be able to follow them outside the site.
                      </p>
                    </md-card-content>

                    <md-card-actions class="text-center">
                      <md-button
                        href="javascript:void(0)"
                        class="md-just-icon md-simple"
                      >
                        <i class="fab fa-twitter"></i>
                      </md-button>
                      <md-button
                        href="javascript:void(0)"
                        class="md-just-icon md-simple"
                      >
                        <i class="fab fa-linkedin"></i>
                      </md-button>
                    </md-card-actions>
                  </md-card>
                </div>
              </div>-->
              <!--<div class="md-layout-item md-medium-size-33 md-small-size-100">
                <div class="team-player">
                  <md-card class="md-card-plain">
                    <div class="md-layout-item md-size-50 mx-auto">
                      <img
                        :src="teamImg3"
                        alt="Thumbnail Image"
                        class="img-raised rounded-circle img-fluid"
                      />
                    </div>
                    <h4 class="card-title">
                      Kendall Jenner
                      <br />
                      <small class="card-description text-muted">Model</small>
                    </h4>

                    <md-card-content>
                      <p class="card-description">
                        You can write here details about one of your team
                        members. You can give more details about what they do.
                        Feel free to add some <a href="#">links</a> for people
                        to be able to follow them outside the site.
                      </p>
                    </md-card-content>

                    <md-card-actions class="text-center">
                      <md-button
                        href="javascript:void(0)"
                        class="md-just-icon md-simple"
                      >
                        <i class="fab fa-twitter"></i>
                      </md-button>
                      <md-button
                        href="javascript:void(0)"
                        class="md-just-icon md-simple"
                      >
                        <i class="fab fa-instagram"></i>
                      </md-button>
                      <md-button
                        href="javascript:void(0)"
                        class="md-just-icon md-simple"
                      >
                        <i class="fab fa-facebook-square"></i>
                      </md-button>
                    </md-card-actions>
                  </md-card>
                </div>
              </div>-->
            </div>
          </div>
        </div>
      </div>
      <div class="section section-contacts">
        <div class="container">
          <div class="md-layout">
            <div class="md-layout-item md-size-66 md-xsmall-size-100 mx-auto">
              <h2 class="text-center title">Travaille avec nous</h2>
              <h4 class="text-center description">{{$t("landing_lg.f_contact")}}</h4>
              <form class="contact-form">
                <div class="md-layout">
                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label>{{ $t("landing_lg.f_name") }}</label>
                      <md-input v-model="name" type="text"></md-input>
                    </md-field>
                  </div>
                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label>{{ $t("landing_lg.f_email") }}</label>
                      <md-input v-model="email" type="email"></md-input>
                    </md-field>
                  </div>
                </div>
                <md-field maxlength="5">
                  <label>Suject</label>
                  <md-input v-model="subject"></md-input>
                </md-field>
                <md-field maxlength="5">
                  <label>{{ $t("landing_lg.f_message") }}</label>
                  <md-textarea v-model="message"></md-textarea>
                </md-field>
                <div class="md-layout">
                  <div class="md-layout-item md-size-33 mx-auto text-center">
                    <md-button
                      :disabled=" !message || !subject || !email || submiting"
                      @click="submit()"
                      class="md-success"
                    >{{ (submiting)? 'envoie...' : $t("landing_lg.f_button") }}</md-button>
                  </div>
                </div>
              </form>
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
      default: require("../assets/img/bg1.jpeg").default
    },
    teamImg1: {
      type: String,
      default: require("../assets/img/Jk_logo.png").default
    },
    teamImg2: {
      type: String,
      default: require("../assets/img/faces/christian.jpg").default
    },
    teamImg3: {
      type: String,
      default: require("../assets/img/faces/kendall.jpg").default
    }
  },
  data() {
    return {
      name: null,
      email: null,
      message: null,
      subject: null,
      submiting: false
    };
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    }
  },
  methods: {
    clean() {
      this.message = "";
      this.subject = "";
    },
    submit() {
      this.submiting = true;
      this.$axios
        .post(
          "/api/admin/canal",
          {
            name: this.name,
            email: this.email,
            message: this.message,
            subject: this.subject
          },
          {
            headers: {
              "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
            }
          }
        )
        .then(({ data }) => {
          this.submiting = false;
          if (data.status) {
            this.clean();
            this.$root.$emit("snackbar", {
              display: true,
              text: "you message was send with success"
            });
          } else {
            this.$root.$emit("snackbar", {
              display: true,
              text: "Send message faillure please Try again later"
            });
          }
        })
        .catch(() => {
          this.submiting = false;
          this.$root.$emit("snackbar", { display: true });
        });
    }
  },
  head: {
    title: {
      inner: i18n.tc("landing_lg.title"),
      separator: " | ",
      complement: process.env.APP_NAME
    },
    meta: [
      {
        name: "google-signin-client_id",
        content:
          "447943189088-u3tai7quivionscm6oe1ddggiu4m2bl6.apps.googleusercontent.com"
      },
      { id: "meta_description", name: "description", content: i18n.tc("landing_lg.h_description") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@KofficielJ" },
      {
        id: "twitter_title",
        name: "twitter:title",
        content: `${i18n.tc("landing_lg.title")} | ${process.env.APP_NAME}`
      },
      {
        id: "twitter_description",
        name: "twitter:description",
        content: i18n.tc("landing_lg.h_description")
      },
      { id: "twitter_image", name: "twitter:image", content: "/assets/img/apple-icon.png" },
      
      {
        id: "og_title",
        property: "og:title",
        content: `${i18n.tc("landing_lg.title")} | ${process.env.APP_NAME}`
      },
      
      { id:"og_url", property: "og:url", content: `${process.env.BASE_URL || ""}home/` },
      {
        id: "og_description",
        property: "og:description",
        content: i18n.tc("landing_lg.h_description")
      },
      { id: "og_image", property: "og:image", content: "/assets/img/apple-icon.png" },
      
      { name: "author", content: `${process.env.AUTOR},${process.env.AUTOR2}` }
    ],
    link: [
      {
        rel: "canonical",
        href: `${process.env.BASE_URL || ""}home/`,
        id: "canonical"
      },
      {
        rel: "author",
        href: `${process.env.AUTORREF},${process.env.AUTORREF2}`
      }
    ]
  }
};
</script>

<style lang="scss" scoped>
.md-card-actions.text-center {
  display: flex;
  justify-content: center !important;
}
.contact-form {
  margin-top: 30px;
}

.md-has-textarea + .md-layout {
  margin-top: 15px;
}
</style>
