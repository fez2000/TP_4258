<template>
  <v-row justify="center" align="center">
      <v-form>
        <h2 class="title" :class="{ 'white--text':darkTheme}">{{$t("settings.title")}}</h2>
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
            <v-list-item  @click="activeNotif()"
              >
              <v-list-item-action>
                <v-switch color="primary" v-model="notifPermission" @click="activeNotif()" :dark="darkTheme"></v-switch>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{(!notifPermission)?$t('settings.active'): $t('settings.deactive')}} {{$t('settings.notification')}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <h2 class="title" :class="{ 'white--text':darkTheme}">{{$t('settings.account')}}</h2>
          <v-list dense>
            <v-list-item @click="toggleState()">
              <v-list-item-action>
                <v-switch color="primary" :loading="stateSubmit" v-model="state" @click="toggleState()" :dark="darkTheme"></v-switch>
              </v-list-item-action>
              <v-list-item-title >{{$t("settings.profil")}} {{(state)?$t('settings.private'):$t('settings.public')}}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="toggleMailnotificationPermission()">
              <v-list-item-action>
                <v-switch color="primary" :loading="mailNotificationPermissionSubtmit" v-model="mailNotificationPermission" @click="toggleMailnotificationPermission()" :dark="darkTheme"></v-switch>
              </v-list-item-action>
              <v-list-item-title >{{(!mailNotificationPermissionSubtmit)?$t('settings.active'):$t('settings.deactive')}} {{$t("settings.mailNotification")}}</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-subheader>{{$t('settings.changePassword')}}</v-subheader>
          <div>
            <v-text-field solo  type="password"  :error-messages="oldPasswordError"  v-model="oldPassword" :placeholder="$t('settings.oldPassword')"></v-text-field>
                <v-text-field solo  :rules="passwordRules" type="password" v-model="newPassword" :placeholder="$t('settings.newPassword')"></v-text-field>
                <v-text-field solo :error="confirmPassword!=newPassword" type="password" v-model="confirmPassword" :placeholder="$t('settings.confirmPassword')"></v-text-field>
            <v-btn :loading="passwordSubmit" :disabled="passwordSubmit || confirmPassword != newPassword || !oldPassword " @click="saveNewPassowd()"  text> {{$t("settings.btnChange")}}</v-btn>
          </div>

      </v-form>

  </v-row>
</template>

<script>
import { saveVoterData, getVoterData, mode_exact, themeName } from '@/fonctions.js';
export default {
    mounted(){
      this.$root.$on('updateProfil', this.updateProfil);
        this.loadStatus(false);
        this.$root.$on('darkTheme', data => this.darkTheme = data);
        this.$root.$on('isFullScreen', data => this.isFullScreen = data);
        this.isFullScreen = !this.checkFullScreen();


    },
    methods: {
        test(){
            return 'undefined' === typeof this.notification
        },
        activeNotif(){
          if(this.notifPermission){
            saveVoterData('notif',false);
          }else{
            if(this.notification.permission !== 'granted'){
                this.notification.requestPermission((status) => {
                    this.notifPermission = status == 'granted';
                    saveVoterData('notif',this.notifPermission);
                    this.$root.$emit('notifPermission', this.notifPermission);
                });
            }else{
                this.notifPermission = true;
                saveVoterData('notif', true);
                this.$root.$emit('notifPermission', this.notifPermission);

            }
          }

        },
        haveDesktopNotifPermission(){
            return  !this.test() &&this.notification.permission === 'granted';
        },
        loadStatus(status = true){
            this.$root.$emit('loadStatus',{ status });
        },
        checkFullScreen(){
            let doc = window.document;
            let docEl = doc.documentElement;

            let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
            let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
            return !doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement;
        },
        toggleMailnotificationPermission(){
          this.mailNotificationPermissionSubtmit = true;
          this.$axios.post('/api/voter/togglemailnotificationpermission',
          {
            mailNotificationPermission: !this.mailNotificationPermission
          },
          {
            headers: {
              'CSRF-Token': this.$Cookies.get('XSRF-TOKEN')
            }
          }).then(({ data })=>{
            this.mailNotificationPermissionSubtmit = false;
            if(data.status){
              this.mailNotificationPermission = data.mailNotificationPermission;
              saveVoterData('mailNotificationPermission', data.mailNotificationPermission + '');

            }
          }).catch(()=>{
            this.mailNotificationPermissionSubtmit = false;
            this.$root.$emit('snackbar', {
                display: true,
              })
          })
        },
        toggleState(){
          this.stateSubmit = true;
          this.$axios.post('/api/voter/togglestate',
          {
            state: !this.state
          },
          {
            headers: {
              'CSRF-Token': this.$Cookies.get('XSRF-TOKEN')
            }
          }).then(({ data })=>{
            this.stateSubmit = false;
            if(data.status){
              this.state = data.state;
              secureSocket.emit('profilUpdate');
              saveVoterData('state',data.state);
            }
          }).catch(()=>{
            this.stateSubmit = false;
            this.$root.$emit('snackbar', {
                display: true,
              })
          })
        },
        toggleFullScreen () {
            let doc = window.document;
            let docEl = doc.documentElement;

            let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
            let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

            if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                requestFullScreen.call(docEl);
                this.isFullScreen =  true;
            }
            else {
                cancelFullScreen.call(doc);
                this.isFullScreen =  false;
            }

            this.$root.$emit('isFullScreen', this.isFullScreen);
        },
        saveNewPassowd(){
          this.oldPasswordError = '';
          this.passwordSubmit = true;

          this.$axios.post('/api/voter/changepassword',
          {
            password: this.newPassword,
            oldPassword: this.oldPassword
          },
          {
            headers: {
              'CSRF-Token': this.$Cookies.get('XSRF-TOKEN')
            }
          }).then(({data})=>{
            this.passwordSubmit = false;
            if(data.status){
              this.oldPassword = '';
              this.newPassword = '';
              this.confirmPassword = '';
              this.$root.$emit('snackbar', {
                display: true,
                text: 'Password change with success'
              });


            }else{
              this.oldPasswordError = 'Please enter a valid password';
            }
          }).catch(()=>{
            this.passwordSubmit = false;
            this.$root.$emit('snackbar', {
                display: true,
            });
          })
        },
        updateProfil(){
          this.mailNotificationPermission = getVoterData('mailNotificationPermission');
          this.state = getVoterData('state');
        }
    },
    data(){
        return {
          passwordSubmit: false,
          confirmPassword: '',
          oldPassword: '',
          oldPasswordError: '',
          newPassword: '',
          mailNotificationPermission: getVoterData('mailNotificationPermission'),
          mailNotificationPermissionSubtmit: false,
          state: getVoterData('state'),
          stateSubmit: false,
          passwordRules: [
            v => (v && v.length >= process.env.PASSWORD_MIN_LENGTH) || `Password must be greater than ${process.env.PASSWORD_MIN_LENGTH} characters`,
          ],
          darkTheme:  (getVoterData(themeName) !== '')?getVoterData(themeName):false,
          isFullScreen: false,
          notifPermission: (getVoterData('notif') !== '')?getVoterData('notif'):true,
          notification: window["Notification"] || window["mozNotification"] || window["webkitNotification"],
        }
    },
    watch: {
        darkTheme(){
            this.$root.$emit('darkTheme', this.darkTheme);
            saveVoterData('darkTheme', this.darkTheme);
            this.$vuetify.theme.dark = this.darkTheme;
        }
    }
}
</script>

<style>

</style>
