<template>
  <v-card v-if="voter.roleLevel < 3 || (voter.roleLevel == 3 && !info.hidden) ">
        <v-dialog scrollable v-model="edit">
            <v-card>
                <v-card-title>modifiez les infos du post</v-card-title>
                <v-card-text>
                    <v-form >
                        <v-text-field v-model="editedItem.title" type="text" rounded title="entrez le titre de cette section" label="title" ></v-text-field>
                        <v-textarea v-model="editedItem.content" rounded  label="content" ></v-textarea>
                        <v-switch v-model="editedItem.hidden" color="primary" label="visibilite"></v-switch>
                    
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/><v-btn text :disabled="!editedItem || !editedItem.title || ! editedItem.content" @click="update">Enregistrer</v-btn>
                </v-card-actions>    
            </v-card>
        </v-dialog>
        <v-dialog scrollable v-model="more">
            <v-card>
                <v-card-title> {{info.title}} </v-card-title>
                <v-card-text> {{ info.content}} </v-card-text>
                <v-card-actions><v-spacer/> <v-btn text color="primary" @click="more = false">Fermer</v-btn></v-card-actions>
            </v-card>
        </v-dialog>    
        <v-toolbar elevation="0">
          <v-toolbar-title>{{info.title}}</v-toolbar-title> <v-spacer/>
          <v-btn icon @click="edit = true" color="primary"> <v-icon>mdi-pencil</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>{{info.content}}</v-card-text>

        <v-card-actions>
          <v-btn x-small v-if="info.content && info.content.length > 150" color="primary" @click="more = true" text>Lire</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

export default {
     name: "l-info",
    beforeDestroy(){
        if(secureSocket){
            secureSocket.removeListener('help', this.waitUpdate );}
    },
 created(){
  if(secureSocket){
          secureSocket.on("help", this.waitUpdate);
      }
 },
 mounted(){

     this.voter =  (this.$Cookies.get(this.$Cookies.get("voter")))?JSON.parse(this.$Cookies.get(this.$Cookies.get("voter"))):{};
      this.getInfo();
 },
 data(){
     let voter ={};
     return {
         voter,
         info: {},
         edit: false,
         more: false,
         editedItem: {
             content: '',
             title: '',
             hidden: false,
         },
     }
 },
 methods: {
     waitUpdate(data){
        this.info = data;
          
     },
     getInfo(){
        this.$axios
            .get(
            "/api/info",
            {
                headers: {
                "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
                }
            }
            ).then(({ data })=>{
                if(data.status){
                    this.info = data.info;
                    
                    this.editedItem = Object.assign({}, this.info);
                }
                
            })
     },
     update(){
        this.$axios
            .post(
            "/api/info",
            this.info,
            {
                headers: {
                "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
                }
            }
            ).then(({ data })=>{
                if(data.status){
                    this.$root.$emit("snackbar", {
                        display: true,
                        text: "info block update with success"
                    });
                    this.info = this.editedItem
                }else{
                    this.$root.$emit("snackbar", {
                        display: false,
                        text: "info block update fails"
                    });
                }
            }).catch(()=>{
                this.$root.$emit("snackbar", {
                        display: false,
                        text: "info block update fails"
                    });
            })
            this.edit = false;
     }
 }
}
</script>

<style>

</style>