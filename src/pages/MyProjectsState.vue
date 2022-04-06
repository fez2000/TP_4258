<template>

  <md-empty-state
    v-if="donthaveproject&&myNb==0"
    :class="color"
    md-icon="shop"
    :md-label="$t('projects.title')"
    :md-description="$t('projects.description')">
    <md-button @click="goToCreateProject()" class="md-primary md-raised">{{$t("projects.create_button")}}</md-button>
  </md-empty-state>
<md-empty-state
    v-else-if="donthaveproject&&myNb!=0"
    :class="color"
    md-icon="shop"
    :md-label="$t('projects.label')"
    :md-description="$t('projects.description')">
    <md-button @click="goToCreateProject()" class="md-primary md-raised">{{$t("projects.create_button2")}}</md-button>
  </md-empty-state>


      <v-row v-else-if="haveproject">

        <v-col  :sm="6" :md="4" :lg="4" :xl="3"  v-for="(i,index) in projects"  v-show="!i.deleted" :key="i._id" >
            <project-card view="StateP" :i="i" :voter="voter" :previewImage="previewImage" :descriptionRules="descriptionRules" :nameRules="nameRules" :darkTheme="darkTheme" :cardWidth="cardWidth"  :checkDevice="checkDevice" :cathegoriesList="cathegoriesList" :loadActive="loadActive"></project-card>

        </v-col>
      </v-row>



</template>

<script>
import SkeletonCard from '@/components/CardSkeleton.vue';
import ProjectCard from '@/components/Cards/ProjectCard.vue';
import { checkDevice, getVoterData, themeName } from '@/fonctions';
import { defaultGradient, addFile, checkFile, clear, updateImage, supDoc, updateImgRef, deleteProject, sendToValidation, sendDoc, updateProjectDoc, dragoverGradient,  dragover, dragleave, sendImage, localUpdate, editImg, checkDoc, saveForm } from '@/fonctions/project';


export default {
  components:{
    SkeletonCard,
    ProjectCard
  },
  computed: {
    checkDevice,
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
      windowWidth: window.innerWidth,
      voter: {},
      myNb: 0,
      darkTheme:  (getVoterData( themeName) !== '')?getVoterData( themeName):false,
      fileMaxSize: process.env.FILE_MAX_SIZE,
      nameMaxLength: process.env.PROJECT_NAME_MAX_LENGTH,
      shortDescriptionMaxLength: process.env.PROJECT_SHORT_DESCRIPTION_MAX_LENGTH,
      descriptionMaxLength: process.env.PROJECT_DESCRIPTION_MAX_LENGTH,
      donthaveproject: false,
      haveproject: false,
      displayPending: true,
      projects: [],
      cathegoriesList: [],
      nameRules: [
          v => !!v || 'Name is required',
          v => (v && v.length <= this.nameMaxLength) || `Name must be less than ${this.nameMaxLength} characters`,
        ],
      shortDescriptionRules: [
        v => !!v || 'Short Description is required',
        v => (v && v.length <= this.shortDescriptionMaxLength) ||  `Short Description must be less than ${this.shortDescriptionMaxLength} characters`,
      ],
      descriptionRules: [
        v=> !v || true,
        v =>  !v || v.length <= this.descriptionMaxLength || `Descript must be less than ${this.descriptionMaxLength} characters`,
      ]
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
          this.$root.$emit('snackbar',{display: true});
          this.$root.$emit('neterror', { err: err, callback: this.getCathegories});
        })
    }
    ,
    goToCreateProject() {
      this.$root.$emit('loadStatus',{ status: true });
      this.$router.push('/dashboard/projects/create')
    },
    previewImage(e){
      let image = {
        name: e.image.name || 'default image',
        src: e.form.src
      }
      this.$root.$emit('previewImage', {imgs:[image]});
    },
    loadActive(){
       this.$root.$emit('loadStatus',{ status: true });
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
    getMyProject() {
      this.$axios.get('/api/project/submit/my')
      .then(({data})=>{
        this.$root.$emit('loadStatus',{ status: false });
        if(data.length === 0){
          this.donthaveproject = true;
        } else {
          this.displayPending = true;
          for(let project of data){
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
