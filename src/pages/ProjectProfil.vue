<template>
  <div class="wrapper">
    <parallax
      class="section page-header header-filter"
      :style="headerStyle"
    ></parallax>
    <div class="main main-raised">
      <div  class="section profile-content">
        <div v-if="profil" class="container">
          <div class="md-layout">
            <div class="md-layout-item md-size-50 mx-auto">
              <div class="profile">
                <div class="avatar">
                  <img
                   style="min-height: 150px; min-width: 150px"
                    :src="'/api/img/'+profil.image.src"
                    :alt="profil.name"

                    class="img-raised rounded-circle img-fluid"
                  />
                </div>
                <div class="name">
                  <h3 class="title">{{profil.name}}</h3>
                  <h6>{{profil.short_description}}</h6>
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
                          <span v-if="link.id == 'Website'">site web</span>
                      </md-button>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="description text-center">
            <div v-html="profil.description"></div>
          </div>

        </div>
        <div v-else class="container">
          <div class="md-layout" v-if="errors == 'NotFound'">
            <md-empty-state
            md-icon="find_replace"
            md-label="Profil Not Found"
            :md-description="`this url(${page}) didn't match any profil.`">
              <md-button href='/' class="md-primary md-raised">Home</md-button>
            </md-empty-state>
          </div>
          <div class="md-layout" v-if="errors == 'PrivateProfil'">
            <md-empty-state
            md-icon="lock"
            md-label="PrivateProfil"
            :md-description="`You may connected to see this profil.`">
              <router-link to="/login">
                <md-button  class="md-primary md-raised">login</md-button>
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
import axios from 'axios';
export default {
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
        { name: "description", content: this.description },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:creator", content: "@JK" },
        { name: "twitter:title",  content: `${this.title} | ${this.APP_NAME}`  },
        { name: "twitter:description",  content: this.description },
        { name: "twitter:image", content: "/assets/img/apple-icon.png" },
        { property: 'og:title', content: `${this.title} | ${this.APP_NAME}` },
        { property: "og:site_name", content: `${this.APP_NAME}` },
        { property: "og:url", content: location.pathname },
        { property: "og:description", content: this.description },
        { property: "og:image", content: "/assets/img/apple-icon.png" },
        { property: "og:image:type", content: "image/png" },

      ]
    },
    link: function(){
      return [
            { rel: 'canonical', href: `${location.host+location.pathname}`, id: 'canonical' },
            { rel: 'author', href: `${this.AUTORREF},${this.AUTORREF2}` },
        ];
    },
    script: function(){
      return [
        { t: 'application/ld+json', i: JSON.stringify(this.shema) }
      ]
    }
  },
  components: {
    Tabs
  },
  bodyClass: "profile-page",
    beforeRouteEnter (to, from, next) {
      axios.get('/api/project/testurl/'+to.params.url)
      .then(({data})=>{
          if(data.status){
              next(vm => vm.setData(data.project));
          }else{
              next(vm => vm.setError(data.errors))
          }
      })
      .catch(()=>next(to))


    }
  ,
    beforeRouteUpdate (to, from, next) {
    this.profil = null;
    this.errors = null;
        this.$axios.then(({data})=>{
          if(data.status){
              this.setData(data.project);
          }else{
              this.setError(data.errors);
          }
          next();
      })
      .catch(()=>next(to))
    },
    data(){
        return {
            profil: null,
            errors: null,
            APP_NAME: process.env.APP_NAME,
            BASE_URL: process.env.BASE_URL,
            AUTORREF2: process.env.AUTORREF2,
            AUTORREF: process.env.AUTORREF,
        }
    },
    methods: {
        setData(data){
            this.profil = data;

        },
        setError(errors){
            this.errors = errors;
        }
    },
    props: {
    header: {
      type: String,
      default: require("../assets/img/Photo_by_NGPhotos_via_Iwaria.jpeg").default
    },

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

      return (this.profil)?this.profil.name:(this.errors == 'NotFound')?'Profil Not found':'you may be connected to see this profil';
    },
    description(){
      return (this.profil)?'join ' + this.profil.name + ' on ' + this.APP_NAME + ' more we are may we...':(this.errors == 'NotFound')?'Profil Not found, join another user of ' + this.APP_NAME+' to make better wolrd':'you may be connected to see this profil, let join us'
    },
    shema(){
      if(!this.profil)return {};
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
        "image": this.BASE_URL+'api/img/'+ this.profil.image.src,
        //"jobTitle": "Professor",
        "name": this.profil.name,
        "url": location.href
      }
    }
  },
  watch: {
    profil(){

      this.$emit('updateHead')
    }
  }
}
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
