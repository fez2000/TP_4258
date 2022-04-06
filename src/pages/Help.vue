<template>
  <v-card flat class="width-100">
      <v-dialog v-model="edit" scrollable>
          <v-card>
                <v-card-title>
                    edit help
                </v-card-title>
                <v-card-text >
                    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="edit = false" color="danger" text>Annuler</v-btn>
                    <v-spacer/> <v-btn @click="updateHelp()" text color="primary" >save</v-btn>
                </v-card-actions>
            </v-card>
      </v-dialog>
      <v-card-title v-if="voter.roleLevel < 3" ><v-spacer/><v-btn @click="editorData=help;edit=true" color="primary" icon><v-icon >mdi-pencil</v-icon></v-btn></v-card-title>
      <v-card-text v-if="help" v-html="help">
      </v-card-text>    
      <v-card-text v-else >
          no help to display
      </v-card-text>
  </v-card>    
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
 
  
export default {
     beforeDestroy(){
      this.$root.$emit("loadStatus", { status: true });
      if(secureSocket){
          secureSocket.removeListener("help", this.waitUpdate);
      }
    },
    created () {
      
      this.$root.$emit("loadStatus", { status: false });
      if(secureSocket){
          secureSocket.on("help",this.waitUpdate);
      }
    },
    data(){
        return {
            editor: ClassicEditor,
                editorData: '<p>write your help here.</p>',
                editorConfig: {
                    
                },
            voter: {},
            edit: false,
            help: '',
        }
    },
    mounted(){
        this.voter =  (this.$Cookies.get(this.$Cookies.get("voter")))?JSON.parse(this.$Cookies.get(this.$Cookies.get("voter"))):{};
         this.getHelp();
    },
    watch: {
        
    },
    methods: {
        waitUpdate({data}){
              this.editorData = data.data;
          },
        getHelp(){
            this.$axios.get('/api/help')
            .then(({ data })=>{
                if(data.status ){
                    this.help = data.help.data;
                }
            }).catch(()=>{})
        },
        updateHelp(){
            this.edit = false
            this.$axios.post('/api/help',{ data: this.editorData }, {
            headers: {
            'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
            
            },

        }).then( rep =>{
                if(rep.status){
                    this.help = this.editorData;
                }
            })
        }
    },
}
</script>

<style>

</style>