<template>
  <v-data-table
    :headers="headers"
    :items="docs"
    :search="search"
    
    v-model="selectedDocs"
    show-select
    
    sort-by="time_create"
    class="elevation-1 width-100"
  >
    <template v-slot:top>

      <v-toolbar flat color="white">
        <v-toolbar-title>Documents</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="deleteAll()" v-if="voter.roleLevel < 2" :disabled="selectedDocs.length == 0" icon><v-icon>mdi-delete</v-icon></v-btn>
        <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
        <v-dialog v-model="dialog" max-width="500px">
          
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                   
                   {{editedItem.name}}
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-switch v-model="isAdmin" label="Admin user"></v-switch>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.voter="{item}">
        {{item.voter?item.voter.name: 'Superuser'}}
    </template>
    <template v-slot:item.time_create="{item}">
        {{mode_exact2(item.time_create||new Date)}}
    </template>
    
    <template v-slot:item.actions="{ item }">
      
      <a download :href="'/api/doc/'+item._id+'/'+item.name">
        <v-icon
          small
          class="mr-2"
          >
         mdi-folder-download
        </v-icon>
      </a>
      
                            <v-menu :offset-x="true" right>
                        <template v-slot:activator="{ on }">
                        
                          <v-icon v-on="on" class="mr-2" small>mdi-share-variant</v-icon>
                            
                        </template>
                        <socials-links
                          :url="origin+'/api/doc/'+item._id+'/'+item.name"
                          :title="'share file'"
                          :description="item.name"
                          :quote="''"
                          :hashtags="'files,'+item.type"
                          :twitter-user="'jk'"
                        ></socials-links>
                      </v-menu>
      <v-icon
        small
        v-if="voter.roleLevel < 2"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
       no data
    </template>
  </v-data-table>
</template>


<script>
import {mode_exact2} from '../fonctions';
  export default {
    data: () => ({
      dialog: false,
      isAdmin: false,
      origin: location.origin,
      selectedDocs: [],
      subject: "",
      message: "",
      search: "",
      mode: "admin",
      docs: [],
      headers: [
        
        {
          text: 'Name',
          
          
          value: 'name',
        },
        { text: 'voter', value: 'voter' },
       
        { text: 'Type', value: 'type' },
        { text: 'Create At', value: 'time_create' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      voter: {},
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
     
    },
    beforeDestroy(){
      this.$root.$emit("loadStatus", { status: true });
    },
    created () {
      this.initialize();
      this.$root.$emit("loadStatus", { status: false });
    },
    mounted(){
        this.voter =  (this.$Cookies.get(this.$Cookies.get("voter")))?JSON.parse(this.$Cookies.get(this.$Cookies.get("voter"))):{};
    },
    methods: {
        mode_exact2,
      deleteAll(){
          this.selectedDocs.forEach((item)=>{
              this.deleteItem(item)
          })
      },
      initialize () {
        this.$axios.get("/api/doc/getall").then(({ data })=>{
            if(data.status)
            this.docs = Object.assign([], data.docs); 
        }).catch(()=>{

        })
        
      },

      

      deleteItem (item) {
        const index = this.docs.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.$axios.delete("/api/doc/"+item._id,{
            headers: {
            'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
            
            },

        }).then(({ data })=>{
          if(data.status == true)
          this.docs.splice(index, 1)
        }).catch(()=>{

        }) 
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          this.axios.post("/api/admin/usertypeupdate/"+this.editedItem._id, { role: this.editedItem.type }, {
            headers: {
            'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
            
            },

        }).then(({ data })=>{
            Object.assign(this.docs[this.editedIndex], this.editedItem)
          }).catch(()=>{})
          
        } 
        this.close()
      },
    },
  }
</script>

<style>
.width-100{
  width: 100%;
}
</style>