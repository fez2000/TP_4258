<template>

<md-empty-state
     v-if="donthaveproject"
    :class="color"
    md-icon="shop"
    :md-label="$t(`projects.noProjetToCheck`)"
    :md-description="$t('projects.description')">
    <md-button @click="goToCreateProject()" class="md-primary md-raised">{{$t("projects.create_button2")}}</md-button>
  </md-empty-state>


      <v-row v-else-if="haveproject">

        <v-col  :sm="6" :md="4" :lg="4" :xl="3"  v-for="(i,index) in projects"  v-show="!i.deleted" :key="i._id" >
            <project-card :i="i" view="Manage" :voter="voter" :cardWidth="cardWidth"   :darkTheme="darkTheme"    :cathegoriesList="cathegoriesList" ></project-card>
            
        </v-col>
         <v-row align="center" v-if="continuer"><v-btn @click="getMore()" style="margin: auto;" color="blue" text>Get more</v-btn></v-row>

      </v-row>



</template>

<script>
import SkeletonCard from '@/components/CardSkeleton.vue';
import ProjectCard from '@/components/Cards/ProjectCard.vue';
import {  getVoterData, themeName } from '@/fonctions';
import { validate, defaultGradient, addFile, checkFile, clear, updateImage, supDoc, updateImgRef, deleteProject, sendToValidation, sendDoc, updateProjectDoc, dragoverGradient,  dragover, dragleave, sendImage, localUpdate, editImg, checkDoc, saveForm } from '@/fonctions/project';


export default {
  components:{
    SkeletonCard,
    ProjectCard
  },
  computed: {
   
    cardWidth(){
      if(this.windowWidth > 350){
        return 350;
      }else{
        return this.windowWidth - 25;
      }
    },
    color(){
            return (this.darkTheme)? 'md-white' : '';
    }
  },
  data(){
    return {
      continuer: false,
      
      voter: {},
      myNb: 0,
      darkTheme:  (getVoterData( themeName) !== '')?getVoterData( themeName):false,
      fileMaxSize: process.env.FILE_MAX_SIZE,
      windowWidth: window.innerWidth,
      donthaveproject: false,
      haveproject: false,
      displayPending: true,
      projects: [],
      cathegoriesList: [],
      
    }
  },

  created(){
    this.getCathegories();
    this.getMyProjectNb();
    this.getMyProject();

    this.voter = JSON.parse(this.$Cookies.get(this.$Cookies.get('voter')));
    window.addEventListener('resize',this.waitResize);
    this.$root.$on('darkTheme',data => this.darkTheme = data);
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.waitResize);
  },
  methods: {
    waitResize(){
      this.windowWidth = window.innerWidth;
    },
    getCathegories(){
        this.$axios.get('/api/cathegorie')
        .then(({data})=>{
          if(data.status){
            this.cathegoriesList = data.cathegories;
          }else{
            this.$root.$emit('snackbar',{ display: true, text: JSON.stringify(data.errors)});
          }
        })
        .catch((err)=>{
          this.$root.$emit('snackbar', { display: true });
          this.$root.$emit('neterror', { err: err, callback: this.getCathegories});
        })
    }
    ,
    goToCreateProject() {
      this.$root.$emit('loadStatus',{ status: true });
      this.$router.push('/dashboard/projects/create')
    },
    getMyProjectNb(){
      this.$axios.get('/api/project/my/nb').then(({data})=>{
        if(data.status){
          this.myNb = data.nb;
        }

      }).catch((err) => {

          this.$root.$emit('neterror', { err: err, callback: this.getMyProjectNb });
        })
    },
    addProject( project){
        project.show = false;
            project.preview = false;
            project.deleted = false;
            project.deleteDialogue = false;
            project.editDialogue = false;
            project.mode = 'preview';
            project.form = {};
            project.form.loading = false;
            project.gradient = defaultGradient;
            project.dragleave = dragleave;
            project.dragover = dragover;
            project.localUpdate = localUpdate;
            project.editImg = editImg;

            project.checkDoc = checkDoc.bind(this, project);
            project.checkFile = checkFile.bind(this, project);
            project.saveForm = saveForm.bind(this, project);
            project.sendImage = sendImage.bind(this, project);
            project.updateImage = updateImage.bind(this, project);
            project.updateImgRef = updateImgRef.bind(this, project);
            project.sendDoc = sendDoc.bind(this, project);
            project.updateProjectDoc = updateProjectDoc.bind(this, project);
            project.supDoc = supDoc.bind(this, project);
            project.sendToValidation = sendToValidation.bind(this, project);
            project.deleteProject = deleteProject.bind(this, project);
            project.addFile =  addFile.bind(this,project);
            project.validate = validate.bind(this,project);
            if(!project.image){
              project.image = {};
              project.image.name = project.name;
              project.image.src = '/assets/img/default_project_img.jpg'

            }else{
              project.image.src = '/api/img/' + project.image.src;
            }
            project.file = function(file) {
              this.form.blob = file;

                this.form.loading = true;
                var reader = new FileReader();
                reader.onload = () => {
                  setTimeout(() => {
                    this.form.src = reader.result;
                    this.form.loading = false;
                  },500)

                }
                reader.readAsDataURL(file);
            };




            project.clear = clear;
            project.clear();

            this.projects.push(project)
    },
    getMore(){
      this.$axios.get('/api/project/tocheckstart')
      .then(({data})=>{
        this.continuer = data.continue;


          for(let project of data.projects){
            this.addProject(project);

        }
      })
      .catch((err) => {
        console.log(err)
          this.$root.$emit('snackbar', { display: true });

        })
    },
    getMyProject() {
      this.$axios.get('/api/project/tocheckstart')
      .then(({data})=>{
        this.$root.$emit('loadStatus',{ status: false });
        if(data.projects.length === 0){
          this.donthaveproject = true;
        } else {
          this.continuer = data.continue;
          this.displayPending = true;
          for(let project of data.projects){
            this.addProject(project);
          }
          setTimeout(() => { this.displayPending = false }, 500)
          this.haveproject = true;
        }
      })
      .catch((err) => {
        console.log(err)
          this.$root.$emit('snackbar', { display: true });
          this.$root.$emit('neterror', { err: err, callback: this.getMyProject });
        })
    }
  }
}
</script>

<style scoped>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .5;
    position: absolute;
    width: 100%;
  }
 .positionTop{
    position: absolute;
    top: 0;
    right: 0;
  }
  .h{
    font-size: 17px;
    font-weight: bold;
  }
  .md-white i{
    color: white!important;
  }
</style>
