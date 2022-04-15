<template>
  <div class="wrapper">
    <parallax
      class="section page-header header-filter"
      :style="headerStyle"
    ></parallax>
    <div class="main main-raised">
      <div  class="section profile-content">
        <div v-if="me" class="container">
          <div class="md-layout">
            <div class="md-layout-item md-size-50 mx-auto">
              <div class="profile">
                <div class="avatar">
                  <img
                    :src="'/api/img/'+me.image.src"
                    :alt="me.name"

                    class="img-raised rounded-circle img-fluid"
                  />
                </div>
                <div class="name">
                  <h3 class="title">{{me.name}}</h3>
                  <h6>{{me.short_bio}}</h6>
                  <template v-for="link of me.socials">
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
                          <span v-if="link.id == 'Website'">site web</span>
                      </md-button>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="description text-center">
            <p>{{me.bio}}</p>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import i18n from '@/plugins/i18n';
import { Tabs } from "../components";

export default {
  components: {
    Tabs
  },
  bodyClass: "profile-page",
  data() {
    return {
      me: null,
      errors: null,
      APP_NAME: process.env.APP_NAME,
      BASE_URL: process.env.BASE_URL
    };
  },
    beforeRouteEnter (to, from, next) {


    axios.get('/api/debut').then( rep  =>{
        if(rep.data.status){
            next(vm => vm.setData(rep.data.voter));

        }else{
            next('/login');
        }
    }).catch(()=>next('/networkerror'))



    }
  ,
  beforeRouteUpdate (to, from, next) {
    this.me = null;
    this.errors = null;

    axios.get('/api/debut').then( rep  =>{
        if(rep.data.status){
            this.setData(rep.data.voter);
        }else{

            next('/login');
        }
    }).catch(()=>next('/networkerror'))




  },
  props: {
    header: {
      type: String,
      default: require("../assets/img/Photo_by_sandraidossou_via_Iwaria.jpeg")
    },

  },
  head: {
    title: function(){
      return {
        inner: this.title ,
        separator: ' | ',
        complement: this.APP_NAME
      }
    },
    meta: function(){
      return [
        { id: "meta_description", name: "description", content: this.description },

        { id: "twitter_title", name: "twitter:title",  content: `${this.title} | ${this.APP_NAME}`  },
        { id: "twitter_description", name: "twitter:description",  content: this.description },
  
        { id: "og_title", property: 'og:title', content: `${this.title} | ${this.APP_NAME}` },
  
        { id: "og_url", property: "og:url", content: location.pathname },
        { id: "og_description", property: "og:description", content: this.description },
  

      ]
    },
    link: [
        { rel: 'canonical', href: `${process.env.BASE_URL||''}me/`, id: 'canonical' },
        { rel: 'author', href: `${process.env.AUTORREF},${process.env.AUTORREF2}` },
    ],
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    },
    page(){
        return location.pathname
    },
    title(){

      return (this.me)?this.me.name:(this.errors == 'NotFound')?i18n.tc("profilPublic.notFound"):i18n.tc("profilPublic.connectedProfil");
    },
    description(){
      return (this.me)?i18n.tc("profilPublic.join")+' '+ this.me.name +' '+i18n.tc("profilPublic.on")+' '+ this.APP_NAME +' '+i18n.tc("profilPublic.moreWeAre"):(this.errors == 'NotFound')?i18n.tc("profilPublic.joinUser")+' '+ this.APP_NAME+' '+i18n.tc("profilPublic.betterWorld"):i18n.tc("profilPublic.connectedProfil")
    }
  },
  watch: {
    me(){

      this.$emit('updateHead')
    }
  },
  methods: {
    setData(data){
      this.me = data;

    },
    setError(errors){
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
