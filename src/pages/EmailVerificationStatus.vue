<template>
<div>
    <md-empty-state
      :class="color"
      md-icon="email"
      md-label="Email verification status"
      :md-description="(errors)?errors:''">
      <md-button v-if="!success&&(errors=='Token don\'t matche'||errors=='Token validity has expired')" :disabled="loading" @click="resendMessage()" class="md-accent md-raised">{{(loading)?'Sending...':'Resend the confirmation message'}}</md-button>
      <router-link to="/login">
          <md-button v-if="success||(errors=='Account is verifed')"  class="md-primary md-raised">Login</md-button>
       </router-link>
       <router-link to="/singup">
          <md-button v-if="!success&&(errors=='No user find with this id')"  class="md-primary md-raised">Singup</md-button>
       </router-link>
    </md-empty-state>

</div>

</template>

<script>
export default {
    bodyClass: "login-page",
      head: {
        title: {
            inner: `Verify your email | ${process.env.APP_NAME}`,
            separator: ''
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
    },
    computed: {
        color(){
            return (this.$Cookies.get('status') == 'false')? 'md-accent' : 'md-primary';
        },
        success(){
            return this.$Cookies.get('status') === 'true';
        },
        errors(){
            return this.$Cookies.get('errors');
        }
    }
}
</script>

<style>

</style>