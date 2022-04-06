<template>

  <md-empty-state
    v-if="donthavepoll&&pollNb==0"
    :class="color"
    md-icon="shop"
    :md-label="$t('poll.title')"
    :md-description="$t('poll.description')">
    <md-button @click="goToCreatePoll" class="md-primary md-raised">{{$t('poll.button')}}</md-button>
  </md-empty-state>
<md-empty-state
    v-else-if="donthavepoll&&pollNb!=0"
    :class="color"
    md-icon="shop"
    :md-label="$t('poll.button')"
    :md-description="$t('projects.description')">
    <md-button @click="goToCreatePoll" class="md-primary md-raised">{{$t('poll.button')}}</md-button>
  </md-empty-state>


      <v-row v-else-if="havepoll">

          <v-col v-for="i in poll"  v-show="!i.deleted" :key="i._id" cols="12"  :sm="6" :md="4" :lg="4" :xl="3"  >
            <v-dialog :dark="darkTheme" :max-width="290" v-model="i.deleteDialogue">
              <v-card  :dark="darkTheme">
                <v-card-title class="headline red" >{{$t("projects.c_confirmT")}}</v-card-title>
                <v-card-text>{{$t("projects.c_confirmD")}}</v-card-text>
                <v-card-actions>
                  <div class="flex-grow-1"></div>
                  <v-btn color="red darken-1" text @click="i.deletePoll">{{$t("projects.delete_button")}}</v-btn>

                </v-card-actions>
              </v-card>
            </v-dialog>

              <v-card>
                <v-card-text>
                  <div v-if="!i.modeEdit">id: {{i._id}}</div>
                  <div class="flex-grow-1"></div>
                  <v-btn v-if="!i.modeEdit&&(i.status!='close')" absolute top right  @click="i.modeEdit = true" icon><v-icon>mdi-pencil </v-icon></v-btn>
                  <v-btn v-if="i.modeEdit" color="red" absolute top left @click="i.clear" icon><v-icon>mdi-close</v-icon></v-btn>
                  <v-btn v-if="i.modeEdit" color="primary" absolute top right @click="i.save" icon><v-icon>mdi-check</v-icon></v-btn>
                </v-card-text>
                <v-card-text>
                  <v-form>
                    <p>{{$t('poll.question')}}</p>
                    <v-text-field solo :disabled="!i.modeEdit"  v-model="i.form.question" :label="$t('poll.question')"></v-text-field>

                     <p class="mb-0">{{$t("pollCreate.startDate")}}</p>
                    <v-dialog
                        :ref="i._id+'start'"
                        v-model="i.form.startDateModal"
                        
                        persistent

                        max-width="500px"
                    >
                        <template v-slot:activator="{ on }">

                        <v-text-field
                            v-model="i.form.startDate"
                            :label="$t('pollCreate.startDate')"
                            prepend-icon="event"
                            :disabled="!i.modeEdit"
                            solo
                            v-on="on"
                        ></v-text-field>
                        </template>
                        <v-date-picker v-model="i.form.startDate" :allowed-dates="i.form.allowedStartDates" :landscape="!$vuetify.breakpoint.xs"  scrollable>
                        <v-spacer></v-spacer>

                        <v-btn text color="primary" @click="i.form.startDateModal = false">{{$t('pollCreate.ok')}}</v-btn>
                        </v-date-picker>
                    </v-dialog>
                    <p class="mb-0">{{$t('pollCreate.endDate')}}</p>
                    <v-dialog
                        max-width="500px"

                        v-model="i.form.endDateModal"
                       :ref="i._id+'end'"
                        persistent

                    >

                    <template v-slot:activator="{ on }">

                      <v-text-field
                        v-model="i.form.endDate"
                        :label="$t('pollCreate.endDate')"

                        prepend-icon="event"
                        readonly
                        solo
                        :disabled="!i.modeEdit"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="i.form.endDate" :allowed-dates="i.form.allowedEndDates" :landscape="!$vuetify.breakpoint.xs"  scrollable>
                      <v-spacer></v-spacer>

                      <v-btn text color="primary" @click="i.form.endDateModal = false">{{$t("pollCreate.ok")}}</v-btn>
                    </v-date-picker>
                  </v-dialog>
                  <p v-if="i.modeEdit">{{$t("pollCreate.addProject")}}</p>
                  <v-autocomplete
                    v-model="i.form.options"
                    :items="projects"
                    solo
                    chips
                    color="blue-grey lighten-2"
                    label="Project"
                    item-text="name"
                    item-value="_id"
                    multiple
                    v-if="i.modeEdit"

                    :hide-selected="true"
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        close
                        @click="data.select"
                        @click:close="remove(data.item)"
                      >
                        <v-avatar left>
                          <v-img :src="'/api/img/'+data.item.image.src"></v-img>
                        </v-avatar>
                        {{ data.item.name }}
                      </v-chip>
                    </template>
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content v-text="data.item"></v-list-item-content>
                      </template>
                      <template v-else>
                        <v-list-item-avatar>
                          <v-img :src="'/api/img/'+data.item.image.src" :alt="data.item.image.name"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-html="data.item.name"></v-list-item-title>

                        </v-list-item-content>
                      </template>
                    </template>
                  </v-autocomplete>
                  </v-form>
                 <p>{{$t("pollCreate.project")}}</p>
                </v-card-text>
                <v-card-actions v-for="option of i.options" v-show="!option.hidden" :key="`op${option._id}`">
                  <router-link :to="'/dashboard/project/'+option.project.url">
                    <v-avatar>

                      <v-img :alt="option.project.name"  :src="'/api/img/'+option.project.image.src"></v-img>
                    </v-avatar>
                  </router-link>
                  <div class="ml-1">{{option.project.name}}</div>
                  <div class="flex-grow-1"></div>
                  <v-btn dark color="grey" v-if=" i.status != 'close'&&i.modeEdit" icon @click="i.supOption(option)" > <v-icon>mdi-close</v-icon></v-btn>

                </v-card-actions>
                <v-card-actions v-if="i.modeEdit">
                  <v-btn color="red" v-if=" i.status != 'close'" @click="i.deleteDialogue = true" text>Delete</v-btn><v-spacer></v-spacer>
                  <v-btn  v-if="voter.type == 'SUPERUSER'&&i.status == 'inprocess'" @click="i.close" text>Stop</v-btn></v-card-actions>
                <v-overlay :absolute="true"

                  :value="i.form.submitting">
                  <v-progress-circular v-if="!i.form.submitErrors && !i.form.submitSuccess" indeterminate size="64"></v-progress-circular>
                  <v-btn
                    v-if="i.form.submitErrors"
                    color="error"
                    @click="i.form.submitting = false; i.form.submitErrors = ''"
                  >
                    {{$t("projects.check_button")}}
                  </v-btn>
                  <v-btn  color="green" x-large dark icon>
                    <v-icon @click="i.form.submitting = false; i.form.submitSuccess = false;">mdi-check</v-icon>
                  </v-btn>
                  <p v-if="i.form.submitErrors"  class="text-center red--text body-1">{{i.form.submitErrors}}</p>
                </v-overlay>
              </v-card>
            </v-col>



        </v-row>



</template>

<script>
import SkeletonCard from '@/components/CardSkeleton.vue';
import ProjectCard from '@/components/Cards/ProjectCard.vue';
import { checkDevice, getVoterData, themeName } from '@/fonctions';
import { defaultGradient, addFile, checkFile, updateImage, supDoc, updateImgRef, deleteProject, sendToValidation, sendDoc, updateProjectDoc, dragoverGradient,  dragover, dragleave, sendImage, localUpdate, editImg, checkDoc, saveForm } from '@/fonctions/project';

function clear(e){

 this.form = {
    startDate: e.initDate(this.start),
    endDate: e.initDate(this.expiration),
    question: this.question,

    endDateModal: false,
    startDateModal: false,
    options: [],
    isUpdating: false,
    autoUpdate: true,
    submitting: false,
    submitErrors: '',
    submitSuccess: false,
  }
  this.modeEdit = false;
}

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
  props: {

  },
  data(){
    return {
      windowWidth: window.innerWidth,
      voter: {},
      pollNb: 0,
      darkTheme:  (getVoterData( themeName) !== '')?getVoterData( themeName):false,
      fileMaxSize: process.env.FILE_MAX_SIZE,
      nameMaxLength: process.env.PROJECT_NAME_MAX_LENGTH,
      shortDescriptionMaxLength: process.env.PROJECT_SHORT_DESCRIPTION_MAX_LENGTH,
      descriptionMaxLength: process.env.PROJECT_DESCRIPTION_MAX_LENGTH,
      donthavepoll: false,
      havepoll: false,
      poll: [],
      submit: false,
      projects: [],
      options: [],
      isUpdating: false,
      autoUpdate: true,
    }
  },

  created(){
    
    this.getPollNb();
    this.getPoll();
    this.getProject();
    this.voter = JSON.parse(this.$Cookies.get(this.$Cookies.get('voter')));
    window.addEventListener('resize',this.waitResize);
    this.$root.$on('darkTheme',data => this.darkTheme = data);
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.waitResize);
  },
  methods: {
    getProject(){
      this.$axios.get('/api/project/waitselection').then(({ data})=>{
          this.projects = data;

      }).catch((err)=>{
        this.$root.$emit('neterror', { err: err, callback: this.getProject });
      }) 
    },
    allowedEndDates (val) {
        if(!this.startDate){
            return new Date(val) >= new Date()
        }else{
            return (new Date(val) >= new Date()) && (new Date(val) >=  new Date(this.startDate));
        }

    },
    allowedStartDates (val) {
        if(!this.endDate){
            return new Date(val) >= new Date()
        }else{
            return new Date(val) >= new Date() && new Date(val) <= new Date(this.endDate);
        }

    },
    waitResize(){
      this.windowWidth = window.innerWidth;
    },
    initDate(date){
      let t = date;
      if(typeof(date)== 'Date'){ 
        return date.getUTCFullYear()+ '-' + date.getUTCMonth() + '-' + date.getUTCDate()
      }
      return date.substr(0,4) + '-' + date.substr(5,2) + '-' + date.substr(8,2);
      
    }
    ,
    goToCreatePoll() {
      this.loadToggle(true);
      this.$router.push('/dashboard/admin/poll/create')
    },
    previewImage(e){
      let image = {
        name: e.image.name || 'default image',
        src: e.form.src
      }
      this.$root.$emit('previewImage', {imgs:[image]});
    },
    loadToggle(status){
       this.$root.$emit('loadStatus',{ status });
    },
    getPollNb(){
      this.$axios.get('/api/poll/nb').then(({ data })=>{
        if(data.status){
          this.pollNb = data.nb;
        }

      }).catch((err) => {

          this.$root.$emit('neterror', { err: err, callback: this.getPollNb });
        })
    },
    getPoll() {
      this.$axios.get('/api/poll/manage')
      .then(({ data }) => {
        this.loadToggle(false);
        if(data.length === 0){
          this.donthavepoll = true;
        } else {
          for(let poll of data ){
              poll.modeEdit = false;
              poll.clear = clear.bind(poll,this);
              poll.clear();
              poll.close = function(p){
                p.form.submitting = true;
                this.$axios.get(`/api/poll/close/${p._id}`)
                .then(({ data })=>{
                  if(data.status){
                    p.modeEdit = false;
                    p.form.submitting = false;
                    p.status = 'close';
                    this.$root.$emit('snackbar', {
                      display: true,
                      text: 'Poll close with success'
                    })
                  }else{
                    this.$root.$emit('snackbar', {
                      display: true,
                      text: JSON.stringify(data.errors)
                    })
                  }
                }).catch(()=>{

                })
              }.bind(this, poll)
              poll.save =function(p){
                p.form.submitting = true;
                
                this.$axios.put('/api/poll',
                {
                  _id: p._id,
                  question: p.form.question,
                  expiration: p.form.endDate,
                  start: p.form.startDate,
                  status: p.status
                    
                },{
                  headers: {
                    'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
                  }
                }).then(({ data })=>{
                    if(data.status){
                      p.question = p.form.question;
                      p.endDate =  p.form.endDate,
                      p.startDate =  p.form.startDate;
                      if(p.form.options.length > 0){
                        this.$axios.post('/api/poll/addoptions',{
                          _id: p._id,
                          options: p.form.options ,
                        },{
                          headers: {
                            'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
                          }
                        }).then(({ data })=>{
                          if(data.status){
                            this.getProject();
                            p.form.submitting = false;
                            p.modeEdit = false;
                            this.$root.$emit('snackbar', {
                              display: true,
                              text: 'poll update with success'
                            }) 
                          }
                        })
                      }else{
                        this.form.submitting = false
                        this.$root.$emit('snackbar', {
                          display: true,
                          text: 'poll update with success'
                        });
                      }
                      
                    }else{
                      p.form.submitErrors = JSON.stringify(data.errors);
                    }
                  })
              }.bind(this, poll)
              poll.allowedEndDates = function (val) {
                  if(!this.form.startDate){
                      return new Date(val) >= new Date()
                  }else{
                      return (new Date(val) >= new Date()) && (new Date(val) >=  new Date(this.form.startDate));
                  }

              }
              poll.allowedStartDates = function (val) {
                  if(!this.form.endDate){
                      return new Date(val) >= new Date()
                  }else{
                      return new Date(val) >= new Date() && new Date(val) <= new Date(this.form.endDate);
                  }

              }
              poll.deleteDialogue = false;
              
              poll.supOption = function (p, op){
               
                p.form.submitting = true;
                
                this.$axios.delete(`/api/poll/option/${p._id}/${op._id}`,{
                  headers: {
                    'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
                  },

                }).then(({ data })=>{
                  if(data.status){
                    op.hidden = true;
                    p.form.submitting = true;
                    this.$root.$emit('snackbar', {
                      display: true,
                      text: 'Option delete whit success'
                    })
                    this.getProject()
                  }else{
                    if(data.errors.options){
                      p.form.submitErrors = 'Add another option before delete this';
                    }else{
                      p.form.submitErrors = JSON.stringify(data.errors);
                    }
                    
                  }
                }).catch((err)=>{
                  this.$root.$emit('snackbar', { display: true });
                })
              }.bind(this, poll);
              poll.deletePoll = function(p){
                p.deleteDialogue = false;
                p.deleted = true;
                this.$axios.delete('/api/poll/'+p._id,{
                  headers: {
                    'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
                  },

                }).then(({ data })=>{
                  if(data.status){
                    this.$root.$emit('snackbar', {
                      display: true,
                      text: 'Poll delete with success'
                    })
                  }
                }).catch((err)=>{

                })
              }.bind(this, poll);

            this.poll.push(poll)
          }

          this.havepoll = true;
        }
      })
      .catch((err) => {
        console.log(err)
          this.$root.$emit('snackbar', { display: true });
          this.$root.$emit('neterror', { err: err, callback: this.getPoll });
        })
    }
  }
}
</script>
