<template>
  <v-row>
    <v-col :cols="12" :lg="3" :xl="3" order="first" order-lg="last" order-xl="last" >
      <v-col><v-btn color="blue" text>{{$t("notification.reads")}}</v-btn></v-col>

    </v-col>
    <v-col :cols="12" :offset-xl="1" :md="10" :offset-md="1" :xl="8" :lg="9">
      <v-list two-line>
                <v-list-item-group
                  v-model="selected"
                  multiple
                  active-class="blue--text"
                >
                  <template v-for="(item, index) in notifs">
                    <v-list-item :key="item._id" @click="$router.push(item.data.url); setRead(item._id, item.read)" dense>
                      <template v-slot:default="{ active, toggle }">
                        <v-list-item-avatar>
                          <img :src="item.icon" :alt="item.title"/>
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
                            :title="$t('notification.read')"
                            color="blue"
                          >
                          mdi-circle-small

                          </v-icon>

                          <v-icon
                            v-else
                            color="grey lighten-1"
                            :title="$t('notification.rd')"
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
    </v-col>
    <v-col cols="12" class="align-center" >
      <v-btn  style="display: contents;" v-if="continuer" text @click="getNext()">{{$t('notification.getmoreBtn')}}</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import i18n from '@/plugins/i18n';
import { mode_exact } from '@/fonctions.js';

export default {
  data() {
    return {
      continuer: false,
      notifs: [],
      notifsNb: 0,
      selected: [],
      BASE: process.env.BASE_URL,
      notification: window["Notification"] || window["mozNotification"] || window["webkitNotification"],
    };
  },
  methods: {
    loadStatus(status = true){
      this.$root.$emit('loadStatus',{ status });
    },
    mode_exact,
    setRead (id,actual){
      if(!actual){
        secureSocket.emit('setReadNotif',id)
      }
    },
    getNext(){
      this.$axios.get('/api/notification/next').then(({data})=>{

        if(data.status){
          this.waitNotif(data.notifications);
          this.loadStatus(false);
          this.continuer = data.continue;
        }

      })
    },
    getNotification(){
      this.$axios.get('/api/notification/start').then(({data})=>{

        if(data.status){
          this.waitNotif(data.notifications);
          this.loadStatus(false);
          this.continuer = data.continue;
        }

      })
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
                if(this.$root.voter._id == notif.voter._id){
                  option['body'] =  ' '+i18n.tc('notification.welcome');
                  option["data"]["url"] = '/dashboard/me';
                }else{
                  option["data"]["url"] = '/dashboard/in/' + notif.voter.url;
                  option['body'] = notif.voter.name + ' '+i18n.tc('profilPublic.joinComunity');
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
                {action: 'like', title: i18n.tc('notification.like'), icon: '/assets/img/like.png' },
                {action: 'link', title: i18n.tc('notification.see') }
              ];

              option["icon"] = (notif.project.image)? 'api/img/' + notif.project.image.src: '/assets/img/default_project_img.jpg';
              
              option["data"]["url"] = '/dashboard/project/' + notif.project.url;
            } else {
              if(notif.event&&!notif.like){
                option["data"]["_id"] = notif.event._id;
                option['body'] = notif.event.description;
                option['title'] = notif.event.title;

                option["action"] = [
                  {action: 'like', title: i18n.tc('notification.like'), icon: this.BASE + 'assets/img/like.png' },
                  {action: 'link', title: i18n.tc('notification.comments') }
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
      countNotif(data){ this.notifsNb = data}
  },
  mounted(){
    this.getNotification();
  }
};
</script>
