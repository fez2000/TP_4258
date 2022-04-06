<template>
  <md-list
    class="nav-mobile-menu nav-mobile-section-start"
    v-if="navMobileSectionStart "
  >
    <md-list-item

              >
                <router-link to="/home">
                  <i class="material-icons">home</i>
                  <p>{{$t("navbar.about")}}</p>
                </router-link>
              </md-list-item>
  </md-list>
</template>

<script>
export default {
  name: "mobile-menu",
  props: {
    navMobileSectionStart: {
      type: Boolean,
      default: false
    }
  }
};
</script>
