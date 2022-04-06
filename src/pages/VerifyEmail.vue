<template>
<div>
    <md-empty-state
      md-icon="email"
      :md-label="$t('verifyEmail.confirm')"
      :md-description="$t('verifyEmail.description')">
      <md-button :disabled="loading" @click="resendMessage()" class="md-primary md-raised">{{(loading)?$t('verifyEmail.btn_sending'):$t('verifyEmail.btn_resend')}}</md-button>
    </md-empty-state>
    <v-btn

        fab
        large
        dark
        bottom
        right
        fixed
        @click="$router.go(-1)"
      >
        {{$t('verifyEmail.back')}}
      </v-btn>
</div>

</template>

<script>
import i18n from '@/plugins/i18n';

export default {
    bodyClass: "login-page",
      head: {
        title: {
            inner: i18n.tc('verifyEmail.confirm'),
            separator: '|',
            complement: process.env.APP_NAME
        },

        link: [
            { rel: 'canonical', href: `${process.env.BASE_URL||''}verifyemail/`, id: 'canonical' },
            { rel: 'author', href: 'https://fezeueugene.web.app' }, // undo property - not to remove the element
            //{ rel: 'icon', href: require('./path/to/icon-16.png'), sizes: '16x16', type: 'image/png' },
            // with shorthand
            //{ r: 'icon', h: 'path/to/icon-32.png', sz: '32x32', t: 'image/png' },
            // ...

        ],
        script: [
            //{ type: 'text/javascript', inner: , body: true},

        ]
  },
    methods: {
        resendMessage(){
            this.loading = true;
            this.$axios.post('/api/voter/retryverify',{email: this.$Cookies.get('voter')},{
                headers: {
                    'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
                }
            }).then((rep)=>{
                this.loading = false;
            }).catch((err)=>{
                this.loading = false
            })
        }
    },
    data(){
        return {
            loading: false
        }
    }
}
</script>

<style>

</style>
