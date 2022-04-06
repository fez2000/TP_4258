<template>
  <v-data-table
    :headers="headers"
    :items="voters"
    :search="search"
    :single-select="false"
    v-model="users"
    show-select
    sort-by="name"
    class="elevation-1 width-100"
  >
    <template v-slot:top>
      <l-mailer :users="users" :email="email" :mode="mode" v-model="mailerOpen"></l-mailer>
      <v-toolbar flat color="white">
        <v-toolbar-title>User List</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-btn icon color="primary" @click="mode='selected';mailerOpen = true" :disabled="users.length == 0"><v-icon>mdi-mail</v-icon></v-btn><v-text-field
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
    <template v-slot:item.actions="{ item }">
      <v-icon  small
               class="mr-2"
               @click="email = item.email; mode = 'admin'; mailerOpen = true"
          >
        mdi-message-text
      </v-icon>  
      <router-link :to="'/in/'+item.url">
        <v-icon
          small
          class="mr-2"
          >
          mdi-eye
        </v-icon>
      </router-link>
      
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
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
  export default {
    data: () => ({
      dialog: false,
      isAdmin: false,
      email: "",
      mailerOpen: false,
      subject: "",
      message: "",
      search: "",
      mode: "admin",
      users: [],
      headers: [
        
        {
          text: 'Name',
          
          
          value: 'name',
        },
        { text: 'Email', value: 'email' },
        { text: 'Image', align: 'start', value: 'image', sortable: false },
        { text: 'Role', value: 'type' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      voters: [],
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
      isAdmin(val){
        this.editedItem.type = (val)?"ADMIN":"VOTER";
      }
    },
    beforeDestroy(){
      this.$root.$emit("loadStatus", { status: true });
    },
    created () {
      this.initialize();
      this.$root.$emit("loadStatus", { status: false });
    },

    methods: {
      
      initialize () {
        this.$axios.get("/api/admin/alluser").then(({ data })=>{
          this.voters = Object.assign([], data); 
        }).catch(()=>{

        })
        
      },

      editItem (item) {
        this.editedIndex = this.voters.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.isAdmin = item.type == "ADMIN";
        this.dialog = true;
      },

      deleteItem (item) {
        const index = this.voters.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.$axios.delete("/api/admin/userdelete/"+item._id,{
            headers: {
            'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
            
            },

        }).then(({ data })=>{
          if(data.status == true)
          this.voters.splice(index, 1)
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
            Object.assign(this.voters[this.editedIndex], this.editedItem)
          }).catch(()=>{})
          
        } else {
          this.voters.push(this.editedItem)
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