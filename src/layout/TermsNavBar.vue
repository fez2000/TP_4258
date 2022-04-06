<template>
    <md-toolbar class="md-dense md-transparent" md-elevation="0">
            <h3 v-if="!$vuetify.breakpoint.xs" class="md-title" style="flex: 1">
            <router-link to="/">
                <v-tooltip bottom>
                <template>
                  <v-img
                    src="logo"
                    aspect-ratio="1"
                    class="grey lighten-2"
                    max-width="50"
                    max-height="50"
                  ></v-img>
                </template>
                  <span>{{appName}} {{$t("termsNavBar.terms")}}</span>
                </v-tooltip>
            </router-link>
            </h3>
            <router-link class="ml-1" to="/home"> <md-icon>home</md-icon></router-link>|
            <router-link class="ml-1" to="/terms/cookies">{{$t("termsNavBar.cookies")}}</router-link>|
            <router-link class="ml-1" to="/terms/comunity">{{$t("termsNavBar.community")}}</router-link>|
            <router-link class="ml-1" to="/terms/privacypolicy">{{$t("termsNavBar.privacy")}}</router-link>
    </md-toolbar>
</template>

<script>
export default {
    data() {
        return {
            appName: process.env.APP_NAME,
            logo: require("../assets/img/Jk_logo.png")
        };
    }
}
</script>

<style scoped>
    .ml-1{
        margin-left: 5px;
    }
    .md-theme-default a:not(.md-button) {
        color: #171617;
    }
</style>


