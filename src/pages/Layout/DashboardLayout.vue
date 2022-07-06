<template>
   <v-app id="inspire" >
    <v-navigation-drawer
      
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp && !$vuetify.breakpoint.mobile"
      app
      :expand-on-hover="!$vuetify.breakpoint.xsOnly && !$vuetify.breakpoint.mobile"
      :permanent="!$vuetify.breakpoint.xsOnly && !$vuetify.breakpoint.mobile"

    >
      <template v-slot:prepend>
        <v-list-item :two-line="$vuetify.breakpoint.xsOnly">
          <v-list-item-avatar  @click="navigateTo('/')" >

            <img  src="/favicon.ico" alt="app ico"/>

          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{appName}}</v-list-item-title>
            <v-list-item-subtitle v-if="nb" >{{nb}} {{$t("dashboardL.membre")}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </template>


      <v-list :dark="darkTheme" flat dense>

        <template v-for="(item, key) in items" v-if="voter.roleLevel <= item.rolelevel">
          <v-list-item  :class="($route.name === item.text )?selectedColor:''" @click="navigateTo(item.link)" v-if="!item.children" :key="key+'d'">
          <v-list-item-icon>
            <v-icon :color="themeColor">{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group :key="key" v-else
            :prepend-icon="item.icon"
            value="true"
          >
            <template v-slot:activator>
              <v-list-item-title  v-text="item.text"></v-list-item-title>
            </template>

              <v-list-item :color="($route.name === item.text )?selectedColor:''"
              v-for="(child, i) in item.children"
              :key="i"
              @click="navigateTo(child.link)"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon :color="iconcolor">{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <v-list-item @click="install" v-if="!installed">
          <v-list-item-icon><v-icon>mdi-download</v-icon></v-list-item-icon>
          <v-list-item-content>
            Install the web application
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      :color="themeColor"

      dark
      :shrink-on-scroll="custumnav.active"
      :prominent="custumnav.active"
      :src="custumnav.src"
      :fade-img-on-scroll="custumnav.active"



    >
      <template v-if="custumnav.active" v-slot:extension>
        <v-tabs
          :align-with-title="!$vuetify.breakpoint.xsOnly && !$vuetify.breakpoint.mobile"
          background-color="transparent"
          :grow="$vuetify.breakpoint.xsOnly"
          v-model="currentTab"
        >
          <v-tab v-for="(link, key) in custumnav.links" :href="link.id" :key="key" ><v-icon v-if="$vuetify.breakpoint.xsOnly">{{link.icon}}</v-icon><span v-if="!$vuetify.breakpoint.xsOnly">{{link.name}}</span></v-tab>
        </v-tabs>
      </template>
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        bottom
        color="deep-purple accent-4"
      ></v-progress-linear>
      <v-app-bar-nav-icon v-if="$vuetify.breakpoint.xsOnly || $vuetify.breakpoint.mobile" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-menu
        v-model="userOnlineMenuOpen"
        :offset-y="!mobileDevice"
        :open-on-hover="!mobileDevice"
        :close-on-click="mobileDevice"
        :dark="darkTheme"
        :close-on-content-click="false"
        transition="slide-x-transition"
        >
          <template v-slot:activator="{ on }">
            <v-toolbar-title
              style="width: 300px"
              class="ml-0 pl-4"
              v-on="on"
              v-if="!custumnav.active"
            >

              <span class="hidden-xs-and-down">{{$route.name}}</span>

              <p class="white--text" v-if="nbOnline" style="font-weigth: bold;font-size: 12px;position: absolute; bottom: -15px;">{{nbOnline}} {{$t("dashboardL.onlineMenber")}}</p>
            </v-toolbar-title>
          </template>
          <v-card max-height="300">
            <v-card-title>user online</v-card-title>
            <v-list dense>
              <template v-for="user of listVotersOnline">
                <v-list-item  :key='user._id'>
                  <v-list-item-avatar>
                    <v-avatar
                    size="32px"
                    item
                    
                  >
                    <v-img
                      v-if="user.image&&user.image.src"
                      :src="'/api/img/'+user.image.src" 
                    >
                    </v-img>
                  </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{user.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{user.email}}
                    </v-list-item-subtitle>
                    
                  </v-list-item-content>
                </v-list-item>
              </template>
              
            </v-list>
          </v-card>
         </v-menu>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
        v-if="custumnav.active"
      >

        <span class="hidden-xs-and-down">{{custumnav.name}}</span>
      </v-toolbar-title>

      <v-toolbar-items></v-toolbar-items>
      <div class="flex-grow-1"></div>
       <v-btn  dark  v-if="!custumnav.active" icon >
        <v-icon>mdi-magnify</v-icon>

      </v-btn>
      <v-btn v-if="custumnav.active" icon  @click="previewImg({name:custumnav.imgName, src: custumnav.src })"> <v-icon> mdi-rounded-corner </v-icon></v-btn>
      <v-menu
        bottom
        left
        v-if="custumnav.active"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
           dark
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(option, i) in custumnav.options"
            :key="i"
          >
            <v-list-item-title>{{ option.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn v-if="!custumnav.active&&($route.name != 'Notifications')" icon>
        <v-menu
          v-model="notifMenu"
          :offset-y="!mobileDevice"
          :open-on-hover="!mobileDevice"
          :close-on-content-click="false"
          transition="slide-x-transition"


        >
          <template v-slot:activator="{ on }">

              <v-badge

                :color="'primary'"
                v-model="seeNbNotif"
                :overlap="true"
                class="align-self-center"
              >
                <template v-slot:badge>
                  <span>{{notifsNb}}</span>
                </template>
                <v-icon  v-on="on">mdi-bell</v-icon>
              </v-badge>
          </template>
          <v-card max-width="300px"
          max-height="400px" style="overflow: hidden">
            <v-app-bar :elevation="0" :dark="darkTheme" >
             <v-btn icon>
                <v-icon>mdi-bell</v-icon>
              </v-btn>
              <v-toolbar-title>{{$t('dashboardL.notification')}}</v-toolbar-title>

              <div class="flex-grow-1"></div>

              <v-avatar v-if="notifsNb != 0" size="20">
                <span >{{notifsNb}}</span>
              </v-avatar>
            </v-app-bar>
            <v-divider></v-divider>
            <v-card-text  style="overflow-x: hidden; overflow-y: scroll; max-height: 210px">
              <v-list two-line>
                <v-list-item-group
                  v-model="selected"
                  multiple
                  active-class="blue--text"
                >
                  <template v-for="(item, index) in notifs">
                    <v-list-item :key="item._id" @click="navigateTo(item.data.url); setRead(item._id, item.read)" dense>
                      <template v-slot:default="{ active, toggle }">
                        <v-list-item-avatar>
                          <v-img :src="item.icon" :alt="item.title">

                          </v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.title"></v-list-item-title>
                          <v-list-item-subtitle v-if="item.headline" class="text--primary" v-text="item.headline"></v-list-item-subtitle>
                          <v-list-item-subtitle v-text="item.body"></v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-action>
                          <v-list-item-action-text v-text="mode_exact(item.date)"></v-list-item-action-text>
                          <v-icon
                            v-if="!item.read"

                            @click.stop="setRead(item._id,item.read)"
                            title="Marquer comme lu"
                            color="blue"
                          >
                          mdi-circle-small

                          </v-icon>

                          <v-icon
                            v-else
                            color="grey lighten-1"
                            title="lu"
                          >
                            mdi-circle-small
                          </v-icon>
                        </v-list-item-action>
                      </template>
                    </v-list-item>

                    <v-divider
                      v-if="index + 1 < notifs.length"
                      :key="index"
                    ></v-divider>
                  </template>
                </v-list-item-group>
              </v-list>
            </v-card-text>
            <v-card-actions class="justify-center " >
              <v-btn :color="(notifsNb > 15)?'primary':''" @click="navigateTo('/dashboard/notifications'); notifMenu = false;" text>
                More
              </v-btn>
            </v-card-actions>
          </v-card>

        </v-menu>

      </v-btn>
      <v-btn
        icon
        large
        v-if="!custumnav.active"
      >
       <v-menu
        v-model="menu"
        :offset-y="!mobileDevice"
        :open-on-hover="!mobileDevice"
        :close-on-click="mobileDevice"
        :dark="darkTheme"
        :close-on-content-click="false"
        transition="slide-x-transition"
        >
          <template v-slot:activator="{ on }">

            <v-avatar
              size="32px"
              item
              v-on="on"
            >
              <v-img
                v-if="voter.image&&voter.image.src"
                :src="'/api/img/'+voter.image.src" :alt="voter.name"
              >
              </v-img>
            </v-avatar>
          </template>
          <v-card>
            <v-list dense>
              <v-list-item>
                <v-list-item-avatar @click="previewImg({ src:'/api/img/'+(voter.image)?voter.image.src:'', name: voter.image.name })">
                  <v-img v-if="voter.image&&voter.image.src" :src="'/api/img/'+voter.image.src" :alt="voter.image.src">
                  </v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{voter.name}}</v-list-item-title>
                  <v-list-item-subtitle>{{voter.email}}</v-list-item-subtitle>
                </v-list-item-content>

              </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list dense>
              <v-list-item @click="darkTheme = !darkTheme">
                <v-list-item-action>
                  <v-switch color="primary" v-model="darkTheme" @click="darkTheme = !darkTheme" :dark="darkTheme"></v-switch>
                </v-list-item-action>
                <v-list-item-title >{{(darkTheme)? $t("dashboardL.deactiverDarktheme"):$t("dashboardL.activerDarktheme")}}</v-list-item-title>
              </v-list-item>
              <v-list-item  @click="toggleFullScreen()"
                >
                <v-list-item-action>
                  <v-switch color="primary" v-model="isFullScreen" @click="toggleFullScreen()" :dark="darkTheme"></v-switch>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    {{$t("dashboardL.full_sceeen")}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item  @click="navigateTo(settings.link)"
                >
                  <v-list-item-action>
                    <v-icon :dark="darkTheme" :color="iconcolor">{{settings.icon}}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                    {{settings.text}}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-card-actions>
              <v-btn text @click="profil()">{{$t("dashboardL.profil")}}</v-btn>
              <div class="flex-grow-1"></div>
              <v-btn color="primary" text @click="logout()">{{$t("dashboardL.logout")}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

      </v-btn>
    </v-app-bar>
    <v-content    >
      <v-container
        class="fill-height"
        fluid
        v-scroll="onScroll"

      >


        <dashboard-content></dashboard-content>


      </v-container>
    </v-content>
    <v-fab-transition>
      <v-btn
        bottom
        color="pink"
        dark
        fab
        fixed
        right
        v-show="offsetTop>30"
        @click="goToTop()"

        v-if="$route.name == $t(`dashboardL.dashboard`)&&!custumFloatingButton"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-speed-dial
      v-model="fab"
      :top="false"
      :bottom="true"
      :right="true"
      :left="false"
      fixed
      direction="top"

      v-if="custumFloatingButton"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="blue darken-2"
          dark
          fab

        >
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-if="!fab">mdi-apps</v-icon>
        </v-btn>
      </template>

      <v-btn
        v-show="offsetTop>30"
        @click="goToTop()"
        color="pink"
        fab
        dark
        small
      >
        <v-icon>
          mdi-chevron-up
        </v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        @click="create()"
        color="indigo"
        v-if="$route.name.indexOf('Create') == -1"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="red"
        v-if="$route.name.indexOf('Delete') == -1"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-speed-dial
      v-model="fab"
      :top="false"
      :bottom="true"
      :right="true"
      :left="false"
      fixed
      direction="left"
      v-if="custumFloatingButton"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          :color="(darkTheme)?'':'green darken-2'"
          dark
          fab

        >
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-if="!fab && $route.name.indexOf($t(`dashboardL.dashboard`)) != -1">mdi-apps</v-icon>
          <v-icon v-if="!fab && $route.name.indexOf('Discussion') != -1">mdi-message-text</v-icon>
          <v-icon v-if="!fab && $route.name.indexOf($t(`dashboardL.projects`)) !== -1">mdi-wallet-travel</v-icon>
          <v-icon v-if="!fab && $route.name.indexOf($t(`dashboardL.contribute`)) !== -1">mdi-wallet-travel</v-icon>
        </v-btn>
      </template>
      <v-btn
         fab
        dark
        small
        v-if="$route.name != $t(`dashboardL.dashboard`)"
        color="orange"
         @click="navigateTo('/dashboard')"
        >

          <v-icon >mdi-apps</v-icon>
        </v-btn>
      <v-btn

        fab
        dark
        small
        color="green"
        v-if="$route.name != 'Discussions'"
        @click="navigateTo('/dashboard/discussion')"
      >

        <v-icon>mdi-message-text</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        v-if="$route.name != $t(`dashboardL.projects`)"
        @click="navigateTo('/dashboard/projects')"
        color="indigo"
      >
        <v-icon>mdi-wallet-travel</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="red"
        v-if="$route.name != $t(`dashboardL.profil`)"
        @click="navigateTo('/dashboard/profil')"
      >
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>


    </v-speed-dial>
       <v-speed-dial

        v-model="fab"
        :top="false"
        :bottom="true"
        :right="true"
        :left="false"
        fixed
        direction="top"
        :open-on-hover="!mobileDevice"
        transition="slide-y-reverse-transition"
        v-if="!custumFloatingButton"
        v-show="($route.name == $t(`dashboardL.projects`) || $route.name == $t(`dashboardL.manage_projets`))"
      >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="blue darken-2"
          dark
          fab

        >
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-if="$route.name == $t(`dashboardL.manage_users`)&&!fab">mdi-account-circle</v-icon>
          <v-icon v-if="($route.name == $t(`dashboardL.projects`) || $route.name == $t(`dashboardL.manage_projets`))&&!fab">mdi-wallet-travel</v-icon>
        </v-btn>
      </template>

      <v-btn
        v-show="offsetTop>30"
        @click="goToTop()"
        color="pink"
        fab
        dark
        small
      >
        <v-icon>
          mdi-chevron-up
        </v-icon>
      </v-btn>

      <v-btn

        fab
        dark
        small
        color="green"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        @click="create()"
        color="indigo"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="red"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-app>


</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import axios from 'axios';
import Cookies from 'js-cookie';
import i18n from '@/plugins/i18n';
import { saveVoterData, getVoterData, mode_exact, themeName } from '@/fonctions.js';


export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
  },
  mounted(){
    this.$root.$on('updateProfil', this.updateProfil);
      
      secureSocket.on('connect', this.waitConnect);
      secureSocket.on('reconnect_attempt', this.waitReconnectAttempt);
      secureSocket.on('reconnect', this.waitReconnect);
      secureSocket.on('notification',this.seeNotif);

      secureSocket.on('listVotersOnline',this.waitListVotersOnline);


      secureSocket.on('unReadNotifCount', this.countNotif );
      secureSocket.on('notifs', this.waitNotif);
      secureSocket.on('newVoterOnline', this.waitNewVoterOnline );

      this.voter = JSON.parse(this.$Cookies.get(this.$Cookies.get('voter')));

      this.$root.voter = this.voter;
      this.$root.$on('loadStatus', (data) => {
        this.loading = data.status;
      });


    secureSocket.emit('getListVotersOnline');
    secureSocket.emit('getUnReadNotifCount');

    this.$root.$emit('secureSocket', true);

    this.$root.$emit('login', true);
    this.$vuetify.theme.dark = this.darkTheme;
    this.fetchNb();

    secureSocket.emit('getNotifs');
    secureSocket.emit('getVoterOnline');
    this.$root.$on('custumnav',(data)=>{
      this.custumnav = data;
    });

  },
  created(){

    window.addEventListener('resize',this.checkDevice);
    this.checkDevice();
    this.$root.$on('darkTheme', data => this.darkTheme = data);
    this.$root.$on('isFullScreen', data => this.isFullScreen = data);
    this.isFullScreen = !this.checkFullScreen();
    secureSocket = io('/voter/'+JSON.parse(this.$Cookies.get(this.$Cookies.get('voter')))["_id"],{
        query: {
          Token: this.$Cookies.get('XSRF-TOKEN'),
        },

      });
  },
  computed: {
    themeColor(){

      if(this.darkTheme){
        return '';
      }
      return this.appColor;
    }
  },
  watch: {
    drawer(){
      this.nbBadge = !this.drawer;
    },
     currentTab(){
      this.$root.$emit('tabChange',this.currentTab);
    },
    darkTheme(){
      this.$root.$emit('darkTheme', this.darkTheme);
      saveVoterData('darkTheme', this.darkTheme);
      this.$vuetify.theme.dark = this.darkTheme;
    },
    notifsNb(){
      this.seeNbNotif = this.notifsNb > 0;
    }
  },
  methods: {
    waitConnect(){
      secureSocket.io.opts.query = {
        Token: this.$Cookies.get('XSRF-TOKEN'),
      };
    },
    waitReconnectAttempt(){
      secureSocket.io.opts.query = {
        Token: this.$Cookies.get('XSRF-TOKEN'),
      };
    },
    waitListVotersOnline(voters){
      this.listVotersOnline = voters;
      
    },
    waitReconnect(socket) {
      secureSocket.emit('getVoterOnline');
      secureSocket.emit('getUnReadNotifCount');
      secureSocket.emit('getNotifs');
    },
    seeNotif(data) {
      secureSocket.emit('getUnReadNotifCount');
      secureSocket.emit('getNotifs');
    },
    waitNotif (data){
        let notifs = []
        for(let notif of data){

          let option = {};

          option["data"] = {};
          option["read"] = notif.read;
          option._id = notif._id;
          option["badge"] = this.BASE + 'assets/img/png/homescreen-96.png';
          option["date"] = notif.time_create;
          option["icon"] = this.BASE + 'assets/img/png/homescreen-96.png' ;
          if(notif.voter&&!notif.like){
              option["data"]["_id"] = notif.voter._id;
              try{
                option["icon"] = this.BASE + 'api/img/' + notif.voter.image.src;
                option["image"] = this.BASE + 'api/img/' + notif.voter.image.src;
                option['title'] = notif.voter.name;
                if(this.voter._id == notif.voter._id){
                  option['body'] =  ' Welcome in ours comunity';
                  option["data"]["url"] = '/dashboard/me';
                }else{
                  option["data"]["url"] = '/dashboard/in/' + notif.voter.url;
                  if( notif.type == 'welcomeMessage'){
                    option['body'] = notif.voter.name +' '+i18n.tc("profilPublic.joinComunity");
                  }else{
                    if(notif.type == 'profilPictureChange'){
                      option['body'] = notif.voter.name +' '+i18n.tc("profilPublic.updatePicture")
                    }
                  }

                }

              }catch(e){
                console.log(e)
              }


          }else{
            if(notif.project&&!notif.like){
              option["data"]["_id"] = notif.project._id;
              option['body'] = notif.project.short_description;
             
              if( notif.type == 'submit'){
                option['title'] = 'Check this Project: ' + notif.project.name;
              }else{
                if(notif.type == 'new'){
                  option['title'] = i18n.tc("projects.newProjet")+' '+ notif.project.name;
                }else{
                  if(notif.type == 'decline'){
                    option['title'] = 'Project refused by admin ';
                  }else{
                    if(notif.type == 'accepted'){
                      option['title'] = 'Project accepted by admin ';
                    }else{
                      if(notif.type == 'update'){
                        option['title'] = 'Project has been update ';
                      }
                    }

                  }
                }
                
              }
              
              option["action"] = [
                {action: 'like', title: 'Like', icon: '/assets/img/like.png' },
                {action: 'link', title: 'See' }
              ];

              option["icon"] = (notif.project.image)? '/api/img/' + notif.project.image.src: '/assets/img/default_project_img.jpg';
              option["image"] = option["icon"];
              option["data"]["url"] = '/dashboard/project/' + notif.project.url;
            } else {
              if(notif.event&&!notif.like){
                option["data"]["_id"] = notif.event._id;
                option['body'] = notif.event.description;
                option['title'] = notif.event.title;

                option["action"] = [
                  {action: 'like', title: 'Like', icon: this.BASE + 'assets/img/like.png' },
                  {action: 'link', title: 'Comments' }
                ];
                if(notif.event.document.cathegorie == 'image'){
                  option["icon"] =  this.BASE + 'api/img/' + notif.event.document.src;
                }else{

                  if(notif.event.document.cathegorie == 'voix' || notif.event.document.cathegorie == 'audio'){
                    option["icon"] = this.BASE + 'assets/img/audio.png';
                  }else {
                    if(notif.event.document.cathegorie == 'video'){
                      option["icon"] = this.BASE + 'assets/img/video.png';
                    } else {
                      if(notif.event.document.cathegorie == 'link'){
                        option["icon"] = this.BASE +'assets/img/link.png';
                      }
                    }
                  }
                }

                option["data"]["url"] = '/dashboard/' + notif.event._id;
              }else{
                if(notif.message){

                }
              }
            }


          }
          notifs.push(option);
        }
        this.notifs = notifs;


      },
    updateProfil(){
      this.voter =  JSON.parse(this.$Cookies.get(this.$Cookies.get('voter')));
      this.$root.voter = this.voter;
    },
    countNotif(data){ this.notifsNb = data},
    waitNewVoterOnline(data){
      this.nbOnline = data
    },
    install() {
      
      if(!deferredPrompt)return;
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === "accepted") {
          window.addEventListener("appinstalled", evt => {
            this.$root.$emit("snackbar", {
              display: true,
              text: "Installation reussie"
            });
          });
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        
      });
      
    },
    mode_exact,
    setRead (id,actual){
      if(!actual){
        secureSocket.emit('setReadNotif',id)
      }
    },
    fetchNb(){
      this.$axios.get('/api/voter/nb')
      .then((rep)=>{
        if (rep.data.status) {
          this.nb = rep.data.nb;
        }
      }).catch((err)=>{
        this.$root.$emit('snackbar',{display: true});
        this.$root.$emit('neterror', { err: err, callback: this.fetchNb});
      });
    },
    logout() {
      this.menu = false;
      this.$Cookies.set('login',false);
      this.$axios.get("/api/logout")
      .then((rep)=>{

       this.$router.push('/login');
      }).catch((err)=>{
        this.$root.$emit('snackbar',{display: true});
        this.$root.$emit('neterror', { err: err, callback: this.logout});
      });
      if(secureSocket){
        secureSocket.close();
        secureSocket = null;
      }
      try{
        FB.logout();
        auth2.signOut();
      }catch(e){
        
      }
    },
    profil() {
      this.menu = false;
      this.navigateTo('/dashboard/me')
    },
    previewImg(e){
      this.$root.$emit('previewImage', {imgs:[e]});
    },
    create(){

      if(this.$route.name == i18n.tc("dashboardL.projects")){
        this.loading = true;
        this.$router.push('/dashboard/projects/create');
      }else{
        if(this.$route.name == 'Vote'){
          this.loading = true;
          this.$router.push('/dashboard/admin/poll/create');
        }
      }

    },
    closeCreateProject(){
      this.createProject = false;
    },
    navigateTo(link){
      if(location.pathname != link){
        this.loading = true;
        this.$router.push(link);
      }

    },
    goToTop(){
      document.documentElement.scrollTo({top:0});
    },
    testList(routeName, Liste){
      for(let i of Liste){
        if(routeName == i){
          return true;
        }
      }
      return false;
    },
    onScroll (e) {
        this.offsetTop = document.documentElement.scrollTop;
    },
    checkDevice(){
      this.mobileDevice  = /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent);
    },
    toggleFullScreen () {
      let doc = window.document;
      let docEl = doc.documentElement;

      let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
      let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

      if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
      }
      else {
        cancelFullScreen.call(doc);
      }
      this.isFullScreen =  this.checkFullScreen();
      this.$root.$emit('isFullScreen', this.isFullScreen);
    },
    checkFullScreen(){
      let doc = window.document;
      let docEl = doc.documentElement;

      let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
      let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
      return !doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement;
    }
  },
  props: {
      source: String,
    },
    beforeUpdate(){

    },
    beforeDestroy(){
      if(secureSocket){
        secureSocket.removeListener('newVoterOnline', this.waitNewVoterOnline );
        secureSocket.removeListener('notifs', this.waitNotif);
        secureSocket.removeListener('unReadNotifCount', this.countNotif );
        secureSocket.removeListener('listVotersOnline',this.waitListVotersOnline);


        

        secureSocket.removeListener('notification',this.seeNotif);
      }
      window.removeEventListener('resize', this.checkDevice);
    },
    data: () => ({
      listVotersOnline: [],
      notifMenu: false,
      selected: [],
      notifsNb: 0,
      nbOnline: 0,
      installed: 
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
      ,
      seeNbNotif: 0,
      isFullScreen: false,
      BASE: process.env.BASE_URL,
      notifs: [],
      currentTab: 'tab-about',
      custumnav: {
        active: false,
        src: '',
        links: [
          {
            url: '#',
            name: 'salut'
          }
        ]
      },
      snackbar: false,
      custumFloatingButton: true,
      liste: {
        projects: ['Projects','Manages Projects', 'Deleted Project', 'Create Project'],
        user: ['Manage Users', 'Users', 'Deleted user'],
        up: ['Dashboard'],
        minUp: ['Projects','Manages Projects', 'Deleted Project', 'Create Project'],
        minUpCustum: ['Dashboard','Manages Projects', 'Deleted Project', 'Create Project'],
        minUser: ['Dashboard','Projects',]
      },
      appColor: 'green darken-3',
      comunitypage: '/dashboard/comunity',
      settings: {
        icon: 'mdi-settings-outline',
        text: i18n.tc(`dashboardL.settings`),
        link: '/dashboard/settings'
      },
      options: {
          duration: 800,
          offset: -24,
          easing: 'easeInOutCubic',
      },
      nb: 0,
      voter: {
        image: {}
      },
      darkTheme:  (getVoterData(themeName) !== '')?getVoterData(themeName):false,
      loading: false,
      target: '#top',
      offsetTop: 0,
      fab: false,
      nbBage: true,
      accountfab: false,
      mobileDevice: null,
      userOnlineMenuOpen: false,
      menu: false,
      appName: process.env.APP_NAME,
      dialog: false,
      drawer: null,
      iconcolor: 'dark',
      selectedColor: 'light',
      items: [
        { icon: 'mdi-apps', text: i18n.tc("dashboardL.dashboard"), link: '/dashboard', 'icon-alt': 'dashboard_ico', rolelevel: 3 },
        { icon: 'mdi-vote', text: i18n.tc("dashboardL.contribute"), link: '/dashboard/contribute', 'icon-alt':'contribute_ico',rolevel:3 },
        {
          icon: 'mdi-account-tie',
          text: i18n.tc("dashboardL.admin"),
          rolelevel: 2,
          'icon-alt': 'admin_ico',
          children: [
            { icon: 'mdi-account-group', text: i18n.tc("dashboardL.manage_users"), link: '/dashboard/admin/users'},
            { icon: 'mdi-folder-download', text: i18n.tc("dashboardL.check_submit_projet"), link: '/dashboard/admin/projects/submit'},
            { icon: 'mdi-clipboard-list', text: i18n.tc("dashboardL.manage_projets"), link: '/dashboard/admin/projects/manage'},
            { icon: 'mdi-heart-box', text: i18n.tc("dashboardL.poll"), link: '/dashboard/admin/poll'},
            { icon: 'mdi-wallet', text: i18n.tc("dashboardL.pending_projet"), link: '/dashboard/admin/projects/pending'},
          ]
        },
        {
          icon: 'mdi-wallet-travel',
          text:i18n.tc("dashboardL.projects"),
          rolelevel: 3,
          'icon-alt': 'admin_ico',
          'link': '/dashboard/projects',
          'icon-alt': 'project_ico',
        },
        {
          icon: 'mdi-wallet-membership',
          text: i18n.tc("dashboardL.state_projet"),
          rolelevel: 3,
          'icon-alt': 'admin_ico',
          'link': '/dashboard/projects/state',
          'icon-alt': 'project_ico',
        },{
          icon: 'mdi-wallet-giftcard',
          text: i18n.tc("dashboardL.process_projet"),
          rolelevel: 3,
          'icon-alt': 'admin_ico',
          'link': '/dashboard/projects/inprocess',
          'icon-alt': 'project_ico',
        },
        { icon: 'mdi-docs', text: "File", link: '/dashboard/file', rolelevel: 3 },
        { icon: 'mdi-message-text', text: i18n.tc("dashboardL.forum"), link: '/dashboard/forum', rolelevel: 3 },
        { icon: 'mdi-help', text: i18n.tc("dashboardL.help"), link: '/dashboard/help', rolelevel: 3 },
      ],
    }),
    beforeRouteEnter (to, from, next) {
      if( Cookies.get('login') != 'true'){
        return next('/login?redirect=true');
      }
      return axios
      .get('/api/debut')
      .then((rep) => {
        if(rep.data.status){
          Cookies.set('voter', rep.data.voter.email);
          let voter = {};
          if(Cookies.get(rep.data.voter.email)){
            voter = JSON.parse(Cookies.get(rep.data.voter.email));
          }
          for(let i in rep.data.voter){
            voter[i] = rep.data.voter[i];
          }

          Cookies.set(rep.data.voter.email, JSON.stringify(voter));
          return next()
        }
       Cookies.set('login',false);
        return next('/login?redirect=true');
      })
      .catch((err) => {

        next('/networkerror')
      })


  },
};
</script>
<style lang="scss" scoped>

</style>
