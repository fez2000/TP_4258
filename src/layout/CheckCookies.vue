<template>
  <div class="text-center">
    <md-dialog :md-active.sync="dialog" :md-click-outside-to-close="false" :md-close-on-esc="false">
      <v-card>
        <v-card-title class="headline">{{$t("check_cookie.title")}}</v-card-title>
        <v-card-text>
          {{$t("check_cookie.text")}}
          <a href="/terms/cookies" target="_blank">{{$t("check_cookie.link_text")}}</a>.
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="agree">{{$t("check_cookie.action")}}</v-btn>
        </v-card-actions>
      </v-card>
    </md-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.checkCookiesAgree();
  },
  data: () => ({
    dialog: false,
    invalidRoute: ["Terms privacy policy", "Terms comunity", "Terms cookies"]
  }),
  methods: {
    checkCookiesAgree() {
      if (!this.$Cookies.get("login") && !this.$Cookies.get("cookiesEnable")) {
        if (!this.checkRoute()) this.dialog = true;
      }
    },
    agree() {
      this.$Cookies.set("cookiesEnable", true);
      this.dialog = false;
    },
    checkRoute() {
      for (let i of this.invalidRoute) {
        if (i === this.$route.name) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>

<style>
</style>