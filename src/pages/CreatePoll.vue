<template>
  <v-row>
      <v-col class="pa-4" offset="1" cols="11" md="5" lg="5" xl="5">
         <v-text-field solo  v-model="question" :label="$t('pollCreate.questionLabel')"></v-text-field>
         <v-switch color="primary" :label="$t('pollCreate.startNowLabel')" v-model="startNow"> </v-switch>

         <v-dialog
            ref="startDialog"
            v-model="startDateModal"
            :return-value.sync="startDate"
            persistent
            v-if="!startNow"
            max-width="500px"
        >
            <template v-slot:activator="{ on }">
            <v-text-field
                v-model="startDate"
                :label="$t('pollCreate.startDate')"
                prepend-icon="event"

                solo
                v-on="on"
            ></v-text-field>
            </template>
            <v-date-picker v-model="startDate" :allowed-dates="allowedStartDates" :landscape="!$vuetify.breakpoint.xs"  scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="startDateModal = false">{{$t("pollCreate.cancel")}}</v-btn>
            <v-btn text color="primary" @click="$refs.startDialog.save(startDate)">{{$t("pollCreate.ok")}}</v-btn>
            </v-date-picker>
        </v-dialog>
        <v-dialog
            max-width="500px"
            ref="endDialog"
            v-model="endDateModal"
            :return-value.sync="endDate"
            persistent

        >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="endDate"
            :label="$t('pollCreate.endDate')"
            prepend-icon="event"
            readonly
            solo
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="endDate" :allowed-dates="allowedEndDates" :landscape="!$vuetify.breakpoint.xs"  scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="endDateModal = false">{{$t('pollCreate.cancel')}}</v-btn>
          <v-btn text color="primary" @click="$refs.endDialog.save(endDate)">{{$t('pollCreate.ok')}}</v-btn>
        </v-date-picker>
      </v-dialog>
      <p>{{$t("pollCreate.minProject")}}</p>
       <v-autocomplete
              v-model="options"
              :disabled="isUpdating"
              :items="projects"
              solo
              chips
              color="blue-grey lighten-2"
              :label="$t('pollCreate.project')"
              item-text="name"
              item-value="_id"
              multiple


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
                    <v-img :src="'/api/img/'+data.item.image.src"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.name"></v-list-item-title>

                  </v-list-item-content>
                </template>
              </template>
            </v-autocomplete>



          <v-row >
            <router-link to="./">
              <v-btn :disabled="submit" @click="loadToggle(true)"  color="red" text>{{$t('pollCreate.cancel')}}</v-btn>
            </router-link>
            <div class="flex-grow-1"></div>
            <v-btn :disabled="submit || !question || (!startNow&&!startDate) || !endDate " @click="create() " color="primary" text>{{(submit)?$t('pollCreate.saving'):$t('pollCreate.save')}}</v-btn>
          </v-row>
      </v-col>
  </v-row>

</template>

<script>
export default {
 title: {
        inner: 'Create Poll' ,
        separator: ' | ',
        complement: process.env.APP_NAME
    },
    meta: [
        { name: "description", content: "create poll" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:creator", content: process.env.twitter_name },
        { name: "twitter:title",  content: `Create poll | ${process.env.APP_NAME}` },
        { name: "twitter:description",  content: "pages des projects" },
        { name: "twitter:image", content: "/assets/img/apple-icon.png" },
        { property: 'fb:app_id', content: '123456789' },
        { property: 'og:title', content: `Create poll | ${process.env.APP_NAME}` },
        { property: "og:site_name", content: `${process.env.APP_NAME}` },
        { property: "og:url", content: `${process.env.BASE_URL||''}/dashboard/poll/create` },
        { property: "og:description", content:"description" },
        { property: "og:image", content: "/assets/img/apple-icon.png" },
        { property: "og:image:type", content: "image/png" },
        { name: "author", content:`${process.env.AUTOR},${process.env.AUTOR2}` }
    ],
  data(){
        return {
            submit: false,
            startDate: null,
            endDate: null,
            question: '',
            startNow: true,
            endDateModal: false,
            startDateModal: false,
            projects: [],
            options: [],
            isUpdating: false,
            autoUpdate: true,
        }
    },
    created(){
        this.getProject();
        this.startDate= this.now();
    },
    methods: {
        remove (item) {
            const index = this.options.indexOf(item._id)
            if (index >= 0) this.options.splice(index, 1)
        },
        allowedStartDates (val) {
            if(!this.endDate){
                return new Date(val) >= new Date()
            }else{
                return new Date(val) >= new Date() && new Date(val) <= new Date(this.endDate);
            }

        },
        getProject(){
          this.$axios.get('/api/project/waitselection').then(({ data})=>{
              this.projects = data;
              this.loadToggle(false);
          }).catch((err)=>{

          })
        },
        loadToggle(status){
            this.$root.$emit('loadStatus',{ status: status });
        },
        allowedEndDates (val) {
            if(!this.startDate){
                return new Date(val) >= new Date()
            }else{
                return (new Date(val) >= new Date()) && (new Date(val) >=  new Date(this.startDate));
            }

        },
        create(){
            this.submit = true;
            this.$axios.post('/api/poll', {
                question: this.question,
                start: this.startDate,
                expiration: this.endDate,
                status: (this.startNow)?'inprocess':'wait',
                options: this.options,
            },
            {
                headers: {
                    'CSRF-Token': this.$Cookies.get('XSRF-TOKEN')
                }
            }).then(({ data })=>{
                this.submit = false;
                if(data.status){
                    this.loadToggle(true);
                    this.$root.$emit('snackbar', {
                        display: true,
                        text: 'poll create with success',
                    })
                    this.$router.push('./');
                }
            }).catch((err)=>{
                this.submit = false;
                this.$root.$emit('neterror', { err: err, callback: this.create });
            })
        },
        now(){
            let v = new Date();
            return v.getFullYear()+'-'+v.getMonth()+'-'+v.getDate();
        }
    },
    watch: {
        startNow(){
            if(this.startNow){
                this.startDate= this.now();
            }
        }
    }
}
</script>

<style>

</style>
