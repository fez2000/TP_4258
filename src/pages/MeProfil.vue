<template>
  <v-row justify="center" align="center">
      <v-col cols="12" md="4" lg="4" xl="4"  :order="($vuetify.breakpoint.sm || $vuetify.breakpoint.xs)?'first':'last'" >
            <v-img @drop.prevent="addFile" @dragleave.prevent="gradient=''" @dragover.prevent="gradient='to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)'"
                lazy-src="https://picsum.photos/id/11/100/60"
                :src="previewSrc"
                max-width="300"
                max-height="300"
                :gradient="gradient"
                @click="getImg"
                class="mx-auto"
                >
                <template v-slot:placeholder>
                    <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                    >
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                </template>

            </v-img>
            <v-row v-if="userimg" class="pa-3">
                
                <v-btn dark color="red" @click="annuler()" text>Annuler</v-btn><div class="flex-grow-1"></div><v-btn :disabled="submitting" @click="updateImage()" dark color="primary" text>Save</v-btn>
                
            </v-row>
            <label  for="userimg" hidden><p>{{voter.name}} image</p></label>
            <input hidden name="userimg"  id="userimg" type="file" @input="checkFile"  accept="image/*" />

      </v-col>
      <v-col class="pa-4" offset="1" cols="11" md="5" lg="5" xl="5">
         <v-text-field :disabled="modeReadOnly" v-model="voter.name" label="Name"></v-text-field>
         
         <v-text-field :disabled="modeReadOnly" v-model="voter.short_bio" label="Short bio"></v-text-field>
         <p>description</p>
         <div  v-if="modeReadOnly" v-html="voter.bio" ></div>
         <ckeditor v-else :editor="editor" v-model="voter.bio" ></ckeditor>
         <v-text-field :disabled="modeReadOnly" v-model="voter.location" label="Location"></v-text-field>
         <v-text-field disabled  v-model="voter.email" label="Email"></v-text-field>
         <v-text-field disabled v-model="voter.url" label="Profil url" ></v-text-field>
         
           <v-text-field v-for="i in 3" :key="i" :disabled="modeReadOnly" v-model="voter.socials[i].value" :label="voter.socials[i].id" ></v-text-field>

        
         <v-btn v-if="modeReadOnly" color="primary" @click="modeReadOnly = false" text>Edit</v-btn>
         <v-row v-if="!modeReadOnly"><v-btn :disabled="submit" @click="voter = $root.voter; modeReadOnly = true" color="red" text>Annuler</v-btn><div class="flex-grow-1"></div><v-btn :disabled="submit" @click="edit() " color="primary" text>{{(submit)?'Saving...':'Save'}}</v-btn></v-row>         
      </v-col>
  </v-row>
</template>

<script>

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
export default {
    created(){
      this.$root.$on('updateProfil', this.updateProfil);
        this.voter = JSON.parse(this.$Cookies.get(this.$Cookies.get('voter')));
        
        this.previewSrc = '/api/img/' + this.voter.image.src;
        this.$root.$emit('loadStatus', {status: false});
    },
    methods: {
      updateProfil(){
        this.voter =  JSON.parse(this.$Cookies.get(this.$Cookies.get('voter')));
        
      },
      edit(){
        for(let link of this.voter.socials){
          this.$axios.post('/api/voter/updatesociallink', {
          _id: link._id,
          value: link.value,
        },{
            headers: {
            'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
            'enctype': 'multipart/form-data'
            },

        }).then(({ data })=>{

        })
        }
        this.$axios.put('/api/voter', {
          name: this.voter.name,
          bio: this.voter.bio,
          short_bio: this.voter.short_bio,
          location: this.voter.location
        },{
            headers: {
            'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
            'enctype': 'multipart/form-data'
            },

        }).then(({ data })=>{
          if(data.status){

            secureSocket.emit('profilUpdate');
            this.modeReadOnly = true;
            this.$root.$emit('snacbar', { display: true, text: 'Profil update with success' })  
          }else{
            this.$root.$emit('snacbar', { display: true, text: 'Profil update error ' })
            this.$root.$emit('snacbar', { display: true, text: JSON.stringify(data.errors) })
          }
          
          this.submit = false;
        }).catch(()=>{
          this.submit = false;
          this.$root.$emit('snacbar', { display: true })
        })
      },
      updateImage(){
        let formData = new FormData();
        this.submitting = true;
        formData.append('document', this.userimg);
        formData.append('cathegorie', 'image');
        formData.append('name', `${this.voter.name}`);
        formData.append('type', this.userimg.type.replace('image/',''));
        formData.append('_id', this.voter.image._id);

        this.$axios.put('/api/doc',
        formData,
        {
            headers: {
            'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
            'enctype': 'multipart/form-data'
            },

        }).then(({data})=>{
            if(data.status){
              secureSocket.emit('profilUpdate');
            this.voter.image.name = data.doc.name;
            this.voter.image.src = data.doc.src;
            this.submitting = false;
            this.mode = 'preview';
            this.$root.$emit('snackbar',{
                display: true,
                text: 'Your image was update whit success',
            });
            this.annuler();
            }else{
            this.submitErrors =  JSON.stringify(data.errors);
            this.$root.$emit('snackbar',{
                display: true,
                text: JSON.stringify(data.errors),
            });


            }
        }).catch(err=>{
            this.submitting = false;
            this.annuler();
            this.$root.$emit('snackbar', {
            display: true
            });
            this.$root.$emit('neterror', { err: err, callback: this.sendImage, data: projectId });
        })
      },
        annuler(){
            this.userimg = null;
            this.previewSrc = '/api/img/' + this.voter.image.src;
        },
        addFile(e) {
        let droppedFiles = e.dataTransfer.files;
        if(!droppedFiles) return;
        // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
        const isImage = /^image\/*/.test(droppedFiles[0].type);

        if(isImage){
          if(droppedFiles[0].size >  this.fileMaxSize){
    
             this.$root.$emit('snackbar',{display: true, text: 'Project image size should be less than 10 MB!.'});
            return;
          }
   
          this.file(droppedFiles[0]);
        }else{
          this.$root.$emit('snackbar',{display: true, text: 'Pleace Enter a valid image.'});
        }

      },
      file(file) {
        this.userimg = file;
      

          var reader = new FileReader();
          reader.onload = () => {
            setTimeout(() => {
              this.previewSrc = reader.result;
            
            },500)

          }
          reader.readAsDataURL(file);
      },
      checkFile(e) {
        if (e.target.files[0]){
          if (e.target.files[0].size > 10000000){
            alert('Project image size should be less than 10 MB!');
            return;
          }
          if (!e.target.files) return;
          
          
          this.file(e.target.files[0]);
          
        }

      },
      getImg(e) {
        var e = document.getElementById('userimg');
        e.click();
      }
    },
    data(){
        return {
          editor: ClassicEditor,
            submitting:false,
            previewSrc: '',
            gradient: '',
            voter: {},
            userimg: null,
            modeReadOnly: true,
            submit: false,
        }
    }
}
</script>

<style>

</style>