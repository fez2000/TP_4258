<template>
  <div class="wrapper">
    <parallax class="section page-header header-filter" :style="headerStyle"></parallax>
    <div class="main main-raised">
      <div class="section profile-content">
        <div v-if="profil" class="container">
          <div class="md-layout">
            <div class="md-layout-item md-size-50 mx-auto">
              <div class="profile">
                <div class="avatar">
                  <img
                    :src="'/api/img/'+(profil.image != null)?profil.image.src:''"
                    :alt="profil.name"
                    class="img-raised rounded-circle img-fluid"
                  />
                </div>
                <div class="name">
                  <h3 class="title">{{profil.name}}</h3>
                  <h6>{{profil.short_bio}}</h6>
                  <template v-for="link of profil.socials">
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
                </div>
              </div>
            </div>
          </div>
          <div class="description text-center">
            <p>{{profil.bio}}</p>
          </div>
        </div>
        <div v-else class="container">
          <div class="md-layout" v-if="errors == 'NotFound'">
            <md-empty-state
              md-icon="find_replace"
              :md-label="$t('profilPublic.notFound')"
              :md-description="$('profil.n_match',page)"
            >
              <md-button href="/" class="md-primary md-raised">Home</md-button>
            </md-empty-state>
          </div>
          <div class="md-layout" v-if="errors == 'PrivateProfil'">
            <md-empty-state
              md-icon="lock"
              md-label="PrivateProfil"
              :md-description="`You may connected to see this profil.`"
            >
              <router-link to="/login">
                <md-button class="md-primary md-raised" v-t.preserve="'login.button'"></md-button>
              </router-link>
            </md-empty-state>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tabs } from "../components";
import axios from "axios";

export default {
  head: {
    title: function() {
      return {
        inner: this.title,
        separator: " | ",
        complement: this.APP_NAME
      };
    },
    meta: function() {
      return [
        { name: "description", content: this.description },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:creator", content: "@KofficielJ" },
        { name: "twitter:title", content: `${this.title} | ${this.APP_NAME}` },
        { name: "twitter:description", content: this.description },
        { name: "twitter:image", content: "/assets/img/apple-icon.png" },
        { property: "og:title", content: `${this.title} | ${this.APP_NAME}` },
        { property: "og:site_name", content: `${this.APP_NAME}` },
        { property: "og:url", content: location.pathname },
        { property: "og:description", content: this.description },
        { property: "og:image", content: "/assets/img/apple-icon.png" },
        { property: "og:image:type", content: "image/png" }
      ];
    },
    link: function() {
      return [
        {
          rel: "canonical",
          href: `${location.host + location.pathname}`,
          id: "canonical"
        },
        { rel: "author", href: `${this.AUTORREF},${this.AUTORREF2}` }
      ];
    },
    script: function() {
      return [{ t: "application/ld+json", i: JSON.stringify(this.shema) }];
    }
  },
  components: {
    Tabs
  },
  bodyClass: "profile-page",
  beforeRouteEnter(to, from, next) {
    axios
      .get("/api/voter/testurl/" + to.params.url)
      .then(({ data }) => {
        if (data.status) {
          axios.get("/api/debut").then(rep => {
            if (rep.data.status) {
              if (rep.data.voter.url == to.params.url) {
                next("/me");
              } else {
                next(vm => vm.setData(data.voter));
              }
            } else {
              next(vm => vm.setData(data.voter));
            }
          });
        } else {
          next(vm => vm.setError(data.errors));
        }
      })
      .catch(() => next("/networkerror"));
  },
  beforeRouteUpdate(to, from, next) {
    this.profil = null;
    this.errors = null;
    this.$axios
      .get("/api/voter/testurl/" + to.params.url)
      .then(({ data }) => {
        if (data.status) {
          axios.get("/api/debut").then(rep => {
            if (rep.data.status) {
              if (rep.data.voter.url == to.params.url) {
                next("/me");
              } else {
                this.setData(data.voter);
                next();
              }
            } else {
              this.setData(data.voter);
              next();
            }
          });
        } else {
          this.setError(data.errors);
          next();
        }
      })
      .catch(() => next("/networkerror"));
  },
  data() {
    return {
      profil: null,
      errors: null,
      APP_NAME: process.env.APP_NAME,
      BASE_URL: process.env.BASE_URL,
      AUTORREF2: process.env.AUTORREF2,
      AUTORREF: process.env.AUTORREF
    };
  },
  props: {
    header: {
      type: String,
      default: require("../assets/img/city-profile.jpg").default
    }
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    },
    page() {
      return location.pathname;
    },
    title() {
      return this.profil
        ? this.profil.name
        : this.errors == "NotFound"
        ? "Profil Not found"
        : "you may be connected to see this profil";
    },
    description() {
      return this.profil
        ? "join " +
            this.profil.name +
            " on " +
            this.APP_NAME +
            " more we are may we..."
        : this.errors == "NotFound"
        ? "Profil Not found, join another user of " +
          this.APP_NAME +
          " to make better wolrd"
        : "you may be connected to see this profil, let join us";
    },
    shema() {
      if (!this.profil) return {};
      if(this.profil.image == null ){
        this.profil.image = {};
      }
      return {
        "@context": "http://schema.org",
        "@type": "Person",
        /*"address": {
          "@type": "PostalAddress",
          "addressLocality": "Seattle",
          "addressRegion": "WA",
          "postalCode": "98052",
          "streetAddress": "20341 Whitworth Institute 405 N. Whitworth"
        },*/
        //"colleague": [
        //"http://www.xyz.edu/students/alicejones.html",
        //"http://www.xyz.edu/students/bobsmith.html"
        //],
        //"email": "mailto:jane-doe@xyz.edu",
        image: location.origin + "/api/img/" + this.profil.image.src,
        //"jobTitle": "Professor",
        name: this.profil.name,
        url: location.href
      };
    }
  },
  watch: {
    profil() {
      this.$emit("updateHead");
    }
  },
  methods: {
    setData(data) {
      this.profil = data;
    },
    setError(errors) {
      this.errors = errors;
    }
  }
};
</script>

<style lang="scss" scoped>
.section {
  padding: 0;
}

.profile-tabs ::v-deep {
  .md-card-tabs .md-list {
    justify-content: center;
  }

  [class*="tab-pane-"] {
    margin-top: 3.213rem;
    padding-bottom: 50px;

    img {
      margin-bottom: 2.142rem;
    }
  }
}
</style>
