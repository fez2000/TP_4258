<template>
  <div class="wrapper">
    <div class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="md-layout">
          <div
            class="md-layout-item md-size-33 md-small-size-66 md-xsmall-size-100 md-medium-size-40 mx-auto"
          >
            <login-card header-color="green">
              <h4 slot="title" class="card-title">{{$t("resetpassword.title")}}</h4>
              <md-button
                slot="buttons"
                @click="$router.push('/login')"
                class="md-just-icon md-simple md-white"
              >
                  <md-tooltip md-direction="bottom"
                  >{{$t("navbar.login")}}</md-tooltip
                >
                <i class="material-icons">fingerprint</i>
              </md-button>
              <md-button
                slot="buttons"
                href="javascript:void(0)"
                class="md-just-icon md-simple md-white"
                @click="$router.push('/singup')"
              >
                <v-icon color="white">mdi-account-badge-horizontal-outline</v-icon>
                  <md-tooltip md-direction="bottom"
                  >{{$t("navbar.signup")}}</md-tooltip
                >
              </md-button>
              <p slot="description"  v-show="step == 1"  class="description">
                <span  @click="goToCode()"   >
                  {{$t("resetpassword.description")}}
                </span>
              </p>
              <p slot="description" v-show="step == 2" class="description">{{$t("resetpassword.methode")}}</p>
              <p slot="description" v-show="step == 3 && method == 'code'" class="description">{{$t("resetpassword.code")}}</p>
              <p slot="description" v-show="step == 3 && method == 'link'" class="description">{{$t("resetpassword.email")}}</p>
              <p slot="description" v-show="step == 4" class="description">{{$t("resetpassword.text")}}</p>
              <p slot="description" v-show="step == 5" class="description">{{$t("resetpassword.log")}}</p>
              <md-field v-if="step == 1" :class="emailClass" :md-counter="false" class="md-form-group" slot="inputs">
                <md-icon>email</md-icon>
                <label>{{$t("resetpassword.label")}}</label>
                <md-input v-model="email"  type="email" :maxlength="300"  ></md-input>
                <span v-if="email_errors&&email&&!input_submit" class="md-suffix"><md-icon>error</md-icon></span>
                <span v-if="input_submit" class="md-suffix"> <md-progress-spinner :md-diameter="20" :md-stroke="4" md-mode="indeterminate"></md-progress-spinner> </span>
                <span class="md-error">{{email_errors}}</span>
              </md-field>
              <md-field v-if="step == 3&& method == 'code'" :class="codeClass" :md-counter="false" class="md-form-group" slot="inputs">
                <md-icon>shield-lock</md-icon>
                <label>{{$t("resetpassword.labelcode")}}</label>
                <md-input v-model="code"  type="text" :maxlength="5"  ></md-input>
                <span v-if="input_submit" class="md-suffix"> <md-progress-spinner :md-diameter="20" :md-stroke="4" md-mode="indeterminate"></md-progress-spinner> </span>
                <span v-if="code_errors&&code&&!input_submit" class="md-suffix"><md-icon>error</md-icon></span>
                <span class="md-error">{{code_errors}}</span>
              </md-field>
             =
              <p v-if="step == 3&& method == 'link'" slot="inputs">We have send a reset link in box, check your mail to end reset password process.</p>
              <md-field v-if="step == 4" :class="passwordClass" :md-counter="false" class="md-form-group" slot="inputs">
                <md-icon>lock</md-icon>
                <label>{{$t("resetpassword.password")}}</label>
                <md-input v-model="password"  type="password" :maxlength="password_max_length" :minlength="password_min_length"  ></md-input>
                <span v-if="password_errors&&password" class="md-suffix"><md-icon>error</md-icon></span>
                <span class="md-error">{{password_errors}}</span>
              </md-field>
              <md-field v-if="step == 4" :class="confirmPasswordClass" :md-counter="false" class="md-form-group" slot="inputs">
                <md-icon>lock</md-icon>
                <label>{{$t("resetpassword.confirm")}}</label>
                <md-input v-model="confirm_password"  type="password" :maxlength="password_max_length" :minlength="password_min_length"  ></md-input>
                <span v-if="confirm_password_errors&&confirm_password" class="md-suffix"><md-icon>error</md-icon></span>
                <span class="md-error">{{confirm_password_errors}}</span>
              </md-field>
              <md-radio v-if="step == 2" slot="inputs" v-model="method" value="code" class="md-primary"><p>{{$t("resetpassword.sendcode")}}</p></md-radio>
              <md-radio v-if="step == 2" slot="inputs" v-model="method" value="link" class="md-primary"><p>{{$t("resetpassword.sendlink")}}</p> </md-radio>
              <p  v-if="step == 0" style="{color:'red'}" slot="inputs">{{message}}</p>

              <div slot="footer">
                <md-button  @click="prev()" v-if="step > 1 || (step == 4 && method == 'email')" class="md-simple md-success md-lg">
                  {{$t("resetpassword.prev")}}
                </md-button>
                <div style="{display: 'flex'}"></div>
                <md-button  @click="next()" v-show="step < 5&&((step == 3 && method != 'link')|| step != 3)" v-bind:disabled=" submiting|| (((confirm_password!=password) ||(password_errors || confirm_password_errors ) )&&step==4  ) ||((step == 3 && method == 'code' && code_status == 'invalid')) || (step==1&&email&&email_status!='valid')  || (!email && step == 1) || (!method && step == 2) " class="md-simple md-success md-lg">
                  {{(submiting)?$t("resetpassword.submit"):$t("resetpassword.next")}}
                </md-button>
              </div>

            </login-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LoginCard } from '@/components'
import * as Cookies from 'js-cookie';

export default {
  created() {
    let url = new URL(location.href);
    if(url.searchParams.get('status') != null){
      if(url.searchParams.get('status')){
        this.token = url.searchParams.get('token');
        this.email = this.$Cookies.get('voter');
        this.step = 4;
        this.method = 'link';
      }else{
        this.step = 0;
        this.message = 'And error occure, token must be invalid(has exprired)... Please retry process.'
      }
    }
  },
  beforeRouteEnter (to, from, next) {

      if( Cookies.get('login') == 'true'){
        return next('/dashboard');
      }
      next();
  },
  head: {
        
        title: {
            inner: 'Reset your password' ,
            separator: ' of ',
            complement: process.env.APP_NAME
        },
        meta: [
          { id: "meta_description", name: "description", content: "JesusKing account password forgot ?" },
          { id: "twitter_title", name: "twitter:title",  content: `Reset password | ${process.env.APP_NAME}` },
          { id: "twitter_description", name: "twitter:description",  content: "JesusKing account password forgot ?" },
          { id: "twitter_image", name: "twitter:image", content: "/assets/img/apple-icon.png" },
          
          { id: "og_title", property: 'og:title', content: `Reset password | ${process.env.APP_NAME}` },
         
          { id: "og_url", property: "og:url", content: `${process.env.BASE_URL||''}resetpassword/` },
          { id: "og_description", property: "og:description", content:"JesusKing account password forgot ?" },
        
        ],
        link: [
            { rel: 'canonical', href: `${process.env.BASE_URL||''}resetpassword/`, id: 'canonical' },
            { rel: 'author', href: 'https://fezeueugene.web.app' }, // undo property - not to remove the element
          
        ]
  },

  components: {
    LoginCard
  },
  bodyClass: "login-page",
  data() {
    return {
      email_errors: false,
      email: '',
      email_status: 'invalid',
      submiting: false,
      step: 1,
      method: '',
      password_errors: '',
      password: '',
      code_status: 'invalid',
      code: '',
      code_errors:'',
      confirm_password: '',
      confirm_password_errors: '',
      input_submit: false,
      token: '',
      password_min_length: process.env.PASSWORD_MIN_LENGTH || 3,
      password_max_length: process.env.PASSWORD_MAX_LENGTH || 15,
      message: ''
    };
  },
  props: {
    header: {
      type: String,
      default: require("../assets/img/Photo_by_Vincent_OROU_GOURA_via_Iwaria.jpeg")
    }
  },
  methods: {

    prev(){
      this.step --;
      if(this.step <= 0) this.step = 1;
      if(this.step == 2 && !this.email || this.email_errors)this.step = 1;
    },
    goToCode(){
      if(this.email&&!this.email_errors){
        this.step = 3;
        this.method='code';
      }else{
        this.email_errors = 'Enter your email'
      }

    },
    reset(){
      this.submiting = true;
      this.$axios.post(
          '/api/voter/resetpassword',
          {
            'email': this.email,
            token: this.token,
            password: this.password
          },
          {
            headers: {
              'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
            }
          }
        ).then((rep)=>{
          this.submiting = false;
          if(rep.data.status){
            this.$root.$emit('snackbar',{
              display: true,
              text: 'your password was reset whit success'
            });
            this.step ++;
            this.$Cookies.set('login', true);
            secureSocket = null;
            this.$router.push('/dashboard');
          }else{
            this.password_errors = rep.data.errors;
          }
        })
        .catch(
          (err)=> {
            this.submiting = false;
            this.$root.$emit('snackbar',{
            display: true,
          });
        });
    },
    password_reset_init(){

        this.submiting = true;
        this.$axios.post(
          '/api/voter/resetpasswordinit',
          {
            'email': this.email,
            'method': this.method
          },
          {
            headers: {
              'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
            }
          }
        ).then((rep)=>{
          this.submiting = false;
          if(rep.data.status){
            this.step ++;
          }
        })
        .catch(
          (err)=> {
            this.submiting = false;
            this.$root.$emit('snackbar',{
              display: true,
            });
        });

    },
    next(){
      if(this.step == 4) return this.reset();
      if(this.step == 2) return this.password_reset_init();
      this.step ++;
      if(this.step >= 5) this.step = 5;

    },
    test_email(){
      this.input_submit =  true;
      this.$axios.post(
        '/api/testaccount',
        {
          'email': this.email,
        },
        {
          headers: {
            'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
          }
        }
      )
      .then((rep)=>{
        this.input_submit = false;
        if(rep.data.status){
          if(this.email == rep.data.email){
            this.email_status = 'valid';
          }
        }else{
          if(this.email == rep.data.email){
            this.email_status = 'invalid';
            this.email_errors = 'This account don\'t exist'
          }
        }
      })
      .catch((err)=>{
        this.input_submit = false;
        this.$root.$emit('snackbar',{
            display: true,
          });
      })
    },

  },
  watch:{
    email(){

      this.email_errors = '';
      this.email_status = 'invalid';
      let valid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email);
      if(!valid) this.email_errors = 'Invalid Email';
      else this.test_email();
    },
    password(){
      this.password_errors = '';
      if(this.password && this.confirm_password){
        if(this.password != this.confirm_password){
          this.password_errors = "Passwords are not equal";
        }
      }
    },
    confirm_password(){
      this.confirm_password_errors = '';
      if(this.confirmpassword && this.confirm_password){
        if(this.confirm_password != this.confirm_password){
          this.confirm_password_errors = "Passwords are not equal";
        }
      }
    },
    code(){

      if(this.code.length  == 5){
        this.input_submit = true;
        this.$axios.post(
          '/api/voter/resetpasswordcode',
          {
            code: this.code,
            email: this.email,
          },
          {
            headers: {
              'CSRF-Token': this.$Cookies.get('XSRF-TOKEN')
            }
          }
        ).then((rep)=>{
          this.input_submit = false;

          if(rep.data.status){
            this.token = rep.data.token;
            this.code_status = true;
            this.step++;
          }else{
            this.code_errors = rep.data.errors
          }

        }).catch((err)=>{
          this.input_submit = false;
          this.$root.$emit('snackbar',{
            display: true,
          });
        });
      }else{
        this.code_errors = '';
      }
    }
  } ,
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    },
    emailClass() {
        return  {
          'md-error': this.email_errors&&this.email,
          'md-valid': !this.email_errors && this.email,
          'md-invalid': this.email_errors&&this.email
        };
    },
    passwordClass (){
      return  {
        'md-error': this.password_errors&&this.password,
        'md-valid': !this.password_errors &&this.password,
        'md-invalid': this.password_errors&&this.password,
      };
    },
    confirmPasswordClass(){
      return {
        'md-error': this.confirm_password_errors&&this.confirm_password,
        'md-valid': !this.confirm_password_errors &&this.confirm_password,
        'md-invalid': this.confirm_password_errors&&this.confirm_password,
      }
    },
    codeClass(){
      return {
        'md-error': this.code_errors&&this.code,
        'md-valid': !this.code_errors &&this.code,
        'md-invalid': this.code_errors&&this.code,
      }
    }
  }
};
</script>

<style lang="css">
  .md-field{
    margin-top: 25px!important;
  }

</style>
