<template>
  <md-empty-state
    v-if="errors"
    md-icon="find_replace"
    md-label="404 Profil not found"
    :md-description="`${page} this page does not exist or you don't have correct access rigth.`"
  >
    <md-button href="/dashboard" class="md-primary md-raised">Dashboard</md-button>
  </md-empty-state>

  <v-tabs-items class="tab-container" v-else v-model="currentItem">
    <v-tab-item class="tab" id="tab-about" value="tab-about">
      <v-row>
        <v-col
          class="col-xs-12 col-sm-12 col-md-4 col-lg-3"
          order="first"
          order-md="last"
          order-lg="last"
          order-sm="first"
          offset-xl="first"
        >
          <v-card v-if="profil" class="mt-2">
            <v-toolbar>
              <v-divider vertical></v-divider>

              <v-btn :color="(love)?'red':''" :disabled="loveSubmit" @click="loveToggle()" icon>
                <v-icon>mdi-heart</v-icon>
                <md-tooltip v-show="love" md-direction="bottom">vous aimez ce projet</md-tooltip>
                <md-tooltip v-show="!love" md-direction="bottom">aimez ce projet</md-tooltip>
              </v-btn>
              <v-divider vertical></v-divider>
              <v-btn icon>
                <v-icon>mdi-camcorder</v-icon>
                <md-tooltip md-direction="bottom">Poster une video ou un audio</md-tooltip>
              </v-btn>
              <v-divider vertical></v-divider>
              <v-btn icon>
                <v-icon>mdi-file-outline</v-icon>
                <md-tooltip md-direction="bottom">Poster un dcoument</md-tooltip>
              </v-btn>
            </v-toolbar>
          </v-card>
          <v-card class="mt-2">
            <v-card-title>cathegories</v-card-title>

            <v-card-actions v-if="profil">
              <v-chip
                v-for="cathegorie of profil.cathegories"
                :key="cathegorie._id"
                outlined
              >{{cathegorie.name}}</v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col class="col-xs-12 col-sm-12 col-md-8 col-lg-9 align-center">
          <h2 class="title">short description</h2>
          <p v-if="profil">{{profil.short_description}}</p>
          <h2 class="title">{{$t("project_overview.about")}}</h2>

          <div class="body-2" v-if="profil" v-html="profil.description"></div>
        </v-col>
      </v-row>
    </v-tab-item>
    <v-tab-item class="tab" value="tab-comments" id="tab-comments">
      <div>{{$t("project_overview.time_line")}}</div>
    </v-tab-item>
    <v-tab-item class="tab" value="tab-documents" id="tab-documents">
      <div>{{$t("project_overview.documents")}}</div>
    </v-tab-item>
  </v-tabs-items>
</template>

<script>
import axios from "axios";
import i18n from "../plugins/i18n";

export default {
  beforeRouteEnter(to, from, next) {
    axios
      .get(`/api/project/testurl/${to.params.url}`)
      .then(({ data }) => {
        if (data.status) {
          next(vm => vm.setData(data.project));
        } else {
          next(vm => vm.setError(data.errors));
        }
      })
      .catch(() => next("/networkerror"));
  },
  mounted() {
    this.loadDeactive();
    secureSocket.on("likeStatus", this.likeStatus);
    secureSocket.on("likeOf", this.likeOf);
  },
  beforeRouteUpdate(to, from, next) {
    this.profil = null;
    this.errors = null;
    this.$axios
      .get(`/api/project/testurl/${to.params.url}`)
      .then(({ data }) => {
        if (data.status) {
          this.setData(data.voter);
        } else {
          this.setError(data.errors);
        }
        next();
      })
      .catch(() => next("/networkerror"));
  },
  beforeDestroy() {
    this.$root.$emit("custumnav", { active: false });
    this.loadActive();
    secureSocket.removeListener("likeStatus", this.likeStatus);
    secureSocket.removeEventListener("likeOf", this.likeOf);
  },
  data() {
    return {
      profil: {},
      errors: null,
      currentItem: "tab-about",
      likeNb: 0,
      love: false,
      loveSubmit: false
    };
  },
  methods: {
    waitTabChange(data) {
      this.currentItem = data;
    },
    loveToggle() {
      this.loveSubmit = true;
      if (!this.love) {
        return this.$axios
          .post(
            "/api/like/add",
            {
              type: "project",
              target_id: this.profil._id
            },
            {
              headers: {
                "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
              }
            }
          )
          .then(({ data }) => {
            this.loveSubmit = false;
            if (data.status) {
              this.love = true;
              this.likeNb = data.nb;
            }
          });
      }
      this.$axios
        .post(
          "/api/like/remove",
          {
            type: "project",
            target_id: this.profil._id
          },
          {
            headers: {
              "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
            }
          }
        )
        .then(({ data }) => {
          this.loveSubmit = false;
          if (data.status) {
            this.love = false;
            this.likeNb = data.nb;
          }
        });
    },
    previewImg(e) {
      this.$root.$emit("previewImage", {imgs:[e]});
    },
    loadActive() {
      this.$root.$emit("loadStatus", { status: true });
    },
    loadDeactive() {
      this.$root.$emit("loadStatus", { status: false });
    },
    likeOf(data) {
      if (this.profil._id == data._id) {
        this.likeNb = data.nb;
      }
    },
    likeStatus(data) {
      this.love = data.status;
    },
    setData(data) {
      this.profil = data;

      let src = this.profil.image
        ? "/api/img/" + this.profil.image.src
        : "/assets/img/default_project_img.jpg";
      let name = this.profil.image ? this.profil.image.name : "default img";
      this.$root.$on("tabChange", this.waitTabChange);
      this.$root.$emit("custumnav", {
        src: src,
        name: this.profil.name,
        active: true,
        imgName: name,
        links: [
          {
            name: i18n.tc(`project_overview.about`),
            id: "#tab-about",
            icon: "mdi-information-outline"
          },
          {
            name: i18n.tc(`project_overview.time_line`),
            id: "#tab-comments",
            icon: "mdi-comment-multiple-outline"
          },
          {
            name: i18n.tc(`project_overview.documents`),
            id: "#tab-documents",
            icon: "mdi-file-multiple-outline"
          }
        ],
        options: [],
        isPublic: this.profil.isPublic
      });
    },
    setError(errors) {
      this.errors = errors;
    }
  }
};
</script>

<style scoped>
.tab-container {
  width: 100%;
  height: 100%;
  display: block;
  background: none;
}
</style>