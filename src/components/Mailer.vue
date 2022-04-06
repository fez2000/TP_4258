<template>
  <v-dialog v-model="value_" scrollable>
      <v-card>
          <v-card-title>{{label}}</v-card-title>
          <v-card-text>
                <v-form>
                    <v-select v-model="to" v-if="mode!= 'selected'" :items="items" label="for">
                        
                    </v-select>
                    <v-text-field label="subject" v-model="subject" ></v-text-field>
                    <v-text-field  type="email" v-model="useremail"  v-if="(mode!= 'selected' || mode == 'user' )||( to == 'one' && mode == 'admin' ) " label="destinataire">

                    </v-text-field>
                    <v-textarea label="message" :placeholder="placeholder" v-model="message">
                    </v-textarea>    
                </v-form>
          </v-card-text>
          <v-card-actions>
              <v-btn text color="danger" @click="value_ = false">ANNULER</v-btn>
              <v-spacer/>
              <v-btn text color="primary" :disabled="disabled || !subject || !message" @click="sendMail()">Send</v-btn>
          </v-card-actions>
      </v-card>    
  </v-dialog>
</template>

<script>
import { util } from "@/fonctions/emojis";

export default {
  name: "l-mailer",
  props: {
    label: {
      type: String,
      default: "Send mail"
    },
    mode: {
        type: String,
        default: "user"
    },
    email: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    
    placeholder: {
      type: String,
      default: "type your message"
    },
    users: {
      type: Array,
      default: new Array(0)
    }
    
  },
  data() {
    return {
        to: 'one',
        items: [
            'one',
            'any'
        ],
        message: '',
        useremail: '',
        subject: '',
        value_: false,
    };
  },
  methods: {
    updateValue: function(value) {
      this.$emit("input", value);
    },
    sendMail(){
      if(mode == 'selected'){
        this.users.forEach((user)=>{
          this.$axios.post("/api/admin/replyToOne",{
              email: user.email,
              subject: this.subject,
              message: this.message
            }).then(({ data })=>{
                
            })
        })
        this.updateValue(false);
      }else{
        this.$axios.post(this.to == "one"?"/api/admin/replyToOne":"/api/admin/reply",{
          email: this.useremail,
          subject: this.subject,
          message: this.message
        }).then(({ data })=>{
            this.updateValue(false);
        })
      }
        
      }
  },
  watch: {
    email(val){
      this.useremail = val;
    },
    value_(val){
      if(!val){
        this.updateValue(val);
      }
    },
    value(val){
      if(val){
        this.value_ = val;
      }
    }
  },

  created() {},
  computed: {
    
  },

  mounted() {
    
  },
  beforeDestroy() {}
};
</script>

<style>

</style>