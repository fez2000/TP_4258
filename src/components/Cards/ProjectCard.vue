<template>
  <div>
    <v-dialog :dark="darkTheme" :max-width="290" v-model="i.deleteDialogue">
      <v-card  :dark="darkTheme">
        <v-card-title class="headline red" >{{$t("projects.c_confirmT")}}</v-card-title>
        <v-card-text>{{$t("projects.c_confirmD")}}</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="red darken-1" text @click="i.deleteProject">{{$t("projects.delete_button")}}</v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card
      @mouseenter="i.preview = true" @mouseleave="i.preview=false"
      style="margin: auto;"
      :max-width="cardWidth"
      :loading="i.form.loading"
      :dark="darkTheme"
      v-if="!i.hidden"
    >

      <v-img  @drop.prevent="i.addFile" @dragleave.prevent="i.dragleave" @dragover.prevent="i.dragover"
        class="white--text"
        :alt="i.image.name || 'default image'"
        :src="i.form.src"
        height="200px"
        :gradient="i.gradient"

      >
        <v-card-title v-if="i.mode === 'preview'"
          style="position: relative;" class="pt-6 align-end fill-height"
        >
          <h2  style="font-size: 20px">{{i.name}}</h2>
        </v-card-title>
      </v-img>
      <v-btn 
        class="positionTop" 
        v-if="(i.preview || checkDevice)&&i.mode === 'preview'"
        @click="previewImage(i)" dark color="white" icon
      > 
        <v-icon> mdi-rounded-corner </v-icon>
      </v-btn>
      <v-btn  
        @click="i.editImg(`img${i._id}`)"  
        class="positionTop" 
        v-if="(i.preview || checkDevice)&&i.mode === 'edit'" 
        dark color="white" 
        icon
      > 
        <v-icon>mdi-pencil </v-icon>
      </v-btn>
      <v-card-text 
        v-if="i.mode === 'preview'"  
        style="position: relative;" 
        class="pt-6"
      >
        <v-btn
            v-if="view != 'State'"
          @click="i.mode = 'edit'"
          absolute
          color="white"
          class="black--text"
          fab
          dark
          right
          top
          small
        >
          <v-icon>
            mdi-pencil
            <md-tooltip md-direction="bottom"
              >{{$t("projects.edit")}}</md-tooltip>
          </v-icon>
        </v-btn>
        <v-btn
            v-if="view == 'State'"
          @click="toggleLove"
          absolute
          color="white"
          class="black--text"
          fab
          dark
          right
          top
          small
              >
          <v-icon>
            mdi-heart
            <md-tooltip md-direction="bottom"
              >{{(iLove)?$t('projects.unlove'):$t('projects.love')}}</md-tooltip>
          </v-icon>
        </v-btn>
        <span style="display:block;height: 50px">
          {{i.short_description}}<br/><br/>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                {{i.docs.length}}
                {{$t("projects.document_button")}}
              </span>
            </template>
            <span>{{$t("projects.document_button")}}</span>
          </v-tooltip>  
        </span>
        <v-chip class="mt-4" v-if="view == 'StateP'" :color="(i.state == 'refused')?'red':'primary'">{{(i.state == 'refused')?'Project rejeter': 'En attente de validation'}}</v-chip>

      </v-card-text>
      <v-card-actions v-if="i.mode === 'preview'">
          
        <v-btn  v-if="(view == 'Pending' || view == 'State')&&i.state != 'voted'" text>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
            <span v-on="on">
              {{$t('projects.wait')}}
            </span>
          </template>
          {{(i.state == 'accepted')?$t('projects.selection'): $t('projects.waitSelection')}}

          </v-tooltip>
        </v-btn>
        <v-btn v-if="(view == 'Pending' || view == 'State')&&i.state == 'voted'" text>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
            <span v-on="on">
              {{(voter.type == 'SUPERUSER')?$t("projects.start"): $t("projects.wait")}}

            </span>
          </template>
          {{(i.state == 'accepted')?'En attente de selection':(i.state == 'voted')?'En attende de lancement': 'en cour de selection'}}

          </v-tooltip>
        </v-btn>
        <v-btn color="primary" v-if="view == 'Submit'"  @click="i.sendToValidation" text>{{(3 == voter.roleLevel)?$t(`projects.submit_button`):$t(`projects.sendToValidation`)}}</v-btn>
        <v-btn color="primary" v-if="view == 'Manage'" @click="i.validate('accept')" text>{{$t('projects.approval')}}</v-btn>
        <router-link :to="`/dashboard/project/${i.url}`">
          <v-btn
            text
            color="primary"
            @click="loadToggle(true)"
          >
            {{$t("projects.explore_button")}}
          </v-btn>
        </router-link>
        <div class="flex-grow-1"></div>
        <v-btn
            icon
            @click="i.show = !i.show"
        >
          <v-icon>{{ i.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>
      <transition-group name="fade"  mode="out-in"  v-show="i.mode === 'edit'">

        <v-card-text :key="'form'+i._id">
          <v-form v-model="i.form.valid">
            <v-subheader>{{$t("projects.f_name")}}:</v-subheader>
            <v-text-field v-model="i.form.name" :rules="nameRules" :label="$t('projects.f_name')" flat full-width filled></v-text-field>
            <v-subheader>{{$t("projects.f_desc")}}:</v-subheader>
            <v-text-field v-model="i.form.short_description" :rules="shortDescriptionRules" :label="$t('projects.f_desc')" flat full-width filled></v-text-field>
              <label  :for="`img${i._id}`" hidden><p>{{$t("projects.f_img")}}</p></label>
              <input hidden name="projectimg"  :id="`img${i._id}`" type="file" @input="i.checkFile"  accept="image/*" />
            <v-subheader>{{$t("projects.f_cat")}}</v-subheader>
            <v-chip-group
                v-model="i.form.cathegories"
              column
              multiple
              v-if="cathegoriesList.length !== 0 && cathegoriesList.length "
            >
            <v-chip v-for="cathegorie of cathegoriesList" :key="cathegorie._id" :value="cathegorie._id" filter outlined>{{cathegorie.name}}</v-chip>

            </v-chip-group>
            <v-subheader>{{$t("projects.f_description")}}:</v-subheader>
            
            <ckeditor :editor="editor" v-model="i.form.description" ></ckeditor>

          </v-form>
        </v-card-text>

        <v-card-actions :key="'action'+i._id">
          <v-btn @click="i.mode = 'preview'; i.clear();" text>{{$t("projects.annuler_button")}}</v-btn>
          <div class="flex-grow-1"></div>
          <v-btn
            text
            color="purple"
            @click="i.saveForm"
            :disabled="!i.form.valid"
          >
            {{$t("projects.save_button")}}
          </v-btn>
        </v-card-actions>



        </transition-group>

        <v-expand-transition v-if="i.mode === 'preview'">


          <div v-show="i.show">
            <v-form hidden>
              <input hidden name="docs"  :id="`docs${i._id}`" type="file" @input="i.checkDoc" multiple accept="*" />
            </v-form>

            <v-card-text>
              <h3  class="h" v-if="i.description" >{{$t("projects.f_description")}}:</h3>
              {{i.description}}
              <h3  class="h">cathegorie{{(i.cathegories.length>1)?'s':''}}:</h3>
              <v-chip v-for="cathegorie of i.cathegories" :key="cathegorie._id" outlined>{{cathegorie.name}}</v-chip>
            </v-card-text>
            <v-card-actions v-for="doc of i.docs" v-show="!doc.hidden" :key="`doc${doc._id}`">

                <v-avatar @click="$root.$emit('previewImage', {name: doc.name, src: '/api/img/'+doc.src});"  v-if="doc.cathegorie == 'image'">
                  <v-img :alt="doc.name"  :src="'/api/img/'+doc.src"></v-img>
                </v-avatar>
                <v-btn v-else><v-icon>mdi-file</v-icon></v-btn>
                  <div class="flex-grow-1"></div>
                  <v-btn dark color="grey" v-if="view != 'State'" icon @click="i.supDoc(doc)" > <v-icon>mdi-close</v-icon></v-btn>
                  <a :href="'/api/img/'+doc.src" download>
                    <v-btn dark color="grey" icon > <v-icon>mdi-download</v-icon></v-btn>
                  </a>
            </v-card-actions>
            <v-card-actions>

              <v-btn
                text
                color="red"
                v-if="view == 'Submit' || view == 'StateP' || (view == 'Pending'&&voter.type=='SUPERUSER')"
                @click="i.deleteDialogue = true;"
              >
                {{$t("projects.delete_button")}}
              </v-btn>
              <v-btn color="red" v-if="view == 'Manage'" @click="i.validate('decline')" text>{{$t("projects.decline")}}</v-btn>
              <div class="flex-grow-1"></div>

              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                  v-if="view != 'State'"
                    icon
                    v-on="on"
                    @click="i.editImg(`docs${i._id}`)"
                  >
                    <v-icon>mdi-file-plus</v-icon>
                  </v-btn>
                </template>
                <span>{{$t("projects.document_button")}}</span>
              </v-tooltip>
            </v-card-actions>
          </div>
        </v-expand-transition>
        <v-overlay :absolute="true"

          :value="i.form.submitting">
          <v-progress-circular v-if="!i.form.submitErrors " indeterminate size="64"></v-progress-circular>
          <v-btn
            v-if="i.form.submitErrors"
            color="error"
            @click="i.form.submitting = false; i.form.submitErrors = ''"
          >
            {{$t("projects.check_button")}}
          </v-btn>
          <p v-if="i.form.submitErrors"  class="text-center red--text body-1">{{i.form.submitErrors}}</p>
        </v-overlay>

      </v-card>
  </div>
</template>

<script>
import { checkDevice } from '@/fonctions';
export default {
    props: {
        i: {
            type: Object
        },
        cathegoriesList: {
            type: Array
        },
        darkTheme: {
            type: Boolean,
            default: false
        },
        voter: {
            type: Object
        },
        cardWidth: {

        },
        view: {
          type: String,
          default: 'Submit'
        }

    },
    methods: {
        previewImage(e){
            let image = {
                name: e.image.name || 'default image',
                src: e.form.src
            }
            this.$root.$emit('previewImage', {imgs:[image]});
        },
        toggleLove(){

        },
        loadToggle(status){
            this.$root.$emit('loadStatus',{ status: status });
        }
        ,checkDevice
    },
    data(){
      return {
        iLove: false,
        fileMaxSize: process.env.FILE_MAX_SIZE,
        nameMaxLength: process.env.PROJECT_NAME_MAX_LENGTH,
        shortDescriptionMaxLength: process.env.PROJECT_SHORT_DESCRIPTION_MAX_LENGTH,
        descriptionMaxLength: process.env.PROJECT_DESCRIPTION_MAX_LENGTH,
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
    watch: {}

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
