<template>
  <v-container :fluid="true">
    <v-dialog max-width="300" v-model="addC">
      <v-card>
        <v-card-title>cathegorie name</v-card-title>
        <v-card-text> <v-form > <v-text-field label="Cathegorie" v-model="cathegorieName"></v-text-field> </v-form> </v-card-text>
        <v-card-actions>
          <v-btn color="danger" @click="addC= false; cathegorieName=''" text>Annuler</v-btn>
          <v-spacer/>
          <v-btn @click="saveC()" text>Save</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col
          cols="12"
          md="4"
          offset-md="2"
          offset-lg="1"
          lg="5"
          :order="($vuetify.breakpoint.sm || $vuetify.breakpoint.xs)?'first':'last'"
        >
          <p align="center">{{$t("createproject.f_img")}}</p>
          <v-row justify="center">
            <v-img
              @drop.prevent="addFile"
              @dragleave.prevent="gradient=''"
              @dragover.prevent="gradient='to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)'"
              lazy-src="https://picsum.photos/id/11/100/60"
              :src="previewSrc"
              max-width="300"
              max-height="300"
              :gradient="gradient"
              @click="getImg"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-row>
          <v-row align="center">
            <label for="projectimg" hidden>
              <p>{{$t("createproject.f_img")}}</p>
            </label>
            <input
              hidden
              name="projectimg"
              id="projectimg"
              type="file"
              @input="checkFile"
              accept="image/*"
            />
          </v-row>
        </v-col>
        <v-col cols="12" md="4" offset-md="2" offset-lg="1" lg="5">
          <v-card-text>
            <h2 class="title mt-1 mb-2">{{$t("createproject.f_name")}}:</h2>
            <v-text-field
              v-model="name"
              :rules="nameRules"
              :label="$t('createproject.f_name')"
              required
              solo
              max-length="150"
            ></v-text-field>
            <h2 class="title mt-1 mb-2">{{$t("createproject.f_desc")}}:</h2>
            <v-text-field
              v-model="short_description"
              max-length="150"
              :rules="shortDescriptionRules"
              :label="$t('createproject.f_desc')"
              required
              solo
            ></v-text-field>
            <h2 class="title mt-1 mb-2">{{$t("createproject.f_cat")}}:</h2>
            <v-chip-group
              v-model="cathegories"
              column
              multiple
              v-if="cathegoriesList.length !== 0 && cathegoriesList.length "
            >
              <v-chip
                v-for="cathegorie of cathegoriesList"
                :key="cathegorie._id"
                :value="cathegorie._id"
                filter
                outlined
              >{{cathegorie.name}}</v-chip>
              <v-chip @click="addC = true"><v-icon>mdi-plus</v-icon></v-chip>
            </v-chip-group>
            <h2 class="title mt-1 mb-2">{{$t("createproject.description")}}:</h2>
            
            <ckeditor :editor="editor" v-model="description" ></ckeditor>
          </v-card-text>
          
          
          <v-btn
            :disabled="!valid || submiting || !name || cathegoriesList.length == 0 || cathegories.length == 0 "
            color="blue darken-1"
            text
            @click="save()"
          >{{(submiting)?$t("createproject.f_runbutton"):$t("createproject.f_button")}}</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
export default {
  title: {
    inner: "Create projects",
    separator: " | ",
    complement: process.env.APP_NAME
  },
  meta: [
    { name: "description", content: "pages des projects" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:creator", content: process.env.twitter_name },
    { name: "twitter:title", content: `Contribute | ${process.env.APP_NAME}` },
    { name: "twitter:description", content: "pages des projects" },
    { name: "twitter:image", content: "/assets/img/apple-icon.png" },
    { property: "fb:app_id", content: "123456789" },
    { property: "og:title", content: `Contribute | ${process.env.APP_NAME}` },
    { property: "og:site_name", content: `${process.env.APP_NAME}` },
    {
      property: "og:url",
      content: `${process.env.BASE_URL || ""}/dashboard/contribute`
    },
    { property: "og:description", content: "description" },
    { property: "og:image", content: "/assets/img/apple-icon.png" },
    { property: "og:image:type", content: "image/png" },
    { name: "author", content: `${process.env.AUTOR},${process.env.AUTOR2}` }
  ],
  mounted() {
    this.voter = JSON.parse(this.$Cookies.get(this.$Cookies.get("voter")));
    this.previewSrc = this.previewDefaultSrc;
    this.getCathegories();
    this.$root.$emit("loadStatus", { status: false });
  },
  data() {
    return {
      model: "<p>Content of the editor.</p>",
      submiting: false,
      cathegorieName: '',
      addC: false,
      editor: ClassicEditor,
      voter: {},
      valid: false,
      gradient: "",
      description: null,
      name: "",
      short_description: "",
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 150) || "Name must be less than 150 characters"
      ],
      shortDescriptionRules: [
        v => !!v || "Short Description is required",
        v =>
          (v && v.length <= 150) ||
          "Short Description must be less than 150 characters"
      ],
      descriptionRules: [
        v => !v || true,
        v =>
          !v || v.length <= 2000 || "Descript must be less than 2000 characters"
      ],
      dialog: false,
      cathegoriesList: [],
      projectimg: null,
      previewLoad: false,
      cathegories: [],
      rules: [
        value => {
          if (!value) {
            return "Select an Image";
          }
          if (value.size > 10 * 1024 * 1024) {
            return "Project image size should be less than 10 MB!";
          }
          return true;
        }
      ],
      loading: false,
      previewDefaultSrc: require("@/assets/img/defaultPreview.svg").default,
      previewSrc: ""
    };
  },
  props: {
    openClose: Boolean,
    theme: String,
    desktop: Boolean
  },
  watch: {
    openClose() {
      this.dialog = this.openClose;
    }
  },
  methods: {
    addFile(e) {
      let droppedFiles = e.dataTransfer.files;
      if (!droppedFiles) return;
      // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
      const isImage = /^image\/*/.test(droppedFiles[0].type);

      if (isImage) {
        if (droppedFiles[0].size > this.fileMaxSize) {
          this.$root.$emit("snackbar", {
            display: true,
            text: "Project image size should be less than 10 MB!."
          });
          return;
        }

        this.file(droppedFiles[0]);
      } else {
        this.$root.$emit("snackbar", {
          display: true,
          text: "Pleace Enter a valid image."
        });
      }
    },
    getCathegories() {
      this.$axios
        .get("/api/cathegorie")
        .then(({ data }) => {
          if (data.status) {
            this.cathegoriesList = data.cathegories;
          } else {
            this.$root.$emit("snackbar", {
              display: true,
              text: JSON.stringify(data.errors)
            });
          }
        })
        .catch(err => {
          this.$root.$emit("snackbar", { display: true });
          this.$root.$emit("neterror", {
            err: err,
            callback: this.getCathegories
          });
        });
    },
    save() {
      this.submiting = true;
      let data = {};
      data.name = this.name;
      data.short_description = this.short_description;
      data.description = this.description;
      data.cathegories = this.cathegories;
      this.$axios
        .post("/api/project", data, {
          headers: {
            "CSRF-Token": this.$Cookies.get("XSRF-TOKEN")
          }
        })
        .then(({ data }) => {
          if (data.status) {
            if (this.projectimg) {
              return this.sendImage(data.project._id);
            }
            this.submiting = false;
            this.$root.$emit("snackbar", {
              display: true,
              text: "Project create whit success."
            });
            this.$router.push("/dashboard/projects");
          } else {
            this.submiting = false;
            this.valid = false;
          }
        })
        .catch(err => {
          this.submiting = false;
          this.$root.$emit("snackbar", {
            display: true
          });
          this.$root.$emit("neterror", { err: err, callback: this.save });
        });
    },
    close() {
      this.$emit("close");
    },
    sendImage(projectId) {
      let formData = new FormData();
      formData.append("document", this.projectimg);
      formData.append("name", `${this.name}_project_${this.voter.name}`);
      formData.append("type", this.projectimg.type.replace("image/", ""));
      formData.append("cathegorie", "image");

      this.$axios
        .post("/api/doc", formData, {
          headers: {
            "CSRF-Token": this.$Cookies.get("XSRF-TOKEN"),
            enctype: "multipart/form-data"
          }
        })
        .then(({ data }) => {
          if (data.status) {
            this.updateImgRef(data.document._id, projectId);
          } else {
            this.$root.$emit("snackbar", {
              display: true,
              text: JSON.stringify(data.errors)
            });
            this.submiting = false;
          }
        })
        .catch(err => {
          this.submiting = false;
          this.$root.$emit("snacbar", {
            display: true
          });
          this.$root.$emit("neterror", {
            err: err,
            callback: this.sendImage,
            data: projectId
          });
        });
    },
    updateImgRef(docId, projectId) {
      this.$axios
        .get(`/api/project/${projectId}/${docId}`)
        .then(({ data }) => {
          this.submiting = false;
          if (data.status) {
            this.$root.$emit("snackbar", {
              display: true,
              text: "Project create whit success."
            });
            this.$router.push("/dashboard/projects");
          } else {
          }
        })
        .catch(err => {
          this.submiting = false;
          this.$root.$emit("snackbar", {
            display: true
          });
          this.$root.$emit("neterror", {
            err: err,
            callback: this.updateImgRef,
            data: { docId, projectId }
          });
        });
    },
    file(file) {
      this.projectimg = file;
      this.previewLoad = true;

      var reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.previewSrc = reader.result;
          this.previewLoad = false;
        }, 500);
      };
      reader.readAsDataURL(file);
    },
    saveC(){
      this.$axios.post("/api/cathegorie", { name: this.cathegorieName }, {
          headers: {
            "CSRF-Token": this.$Cookies.get("XSRF-TOKEN"),
            
          }
        }).then(({data})=>{
        if(data.status){
          this.cathegoriesList.push(data.cathegorie);
          this.$root.$emit("snackbar", {
            display: true,
            text: 'cathegorie add with success'
          });
          this.addC = false;
        }else{
          this.$root.$emit("snackbar", {
            display: true,
            text: 'cathegorie add fails'
          });
        }
      })
    },
    checkFile(e) {
      if (e.target.files[0]) {
        if (e.target.files[0].size > 10000000) {
          alert("Project image size should be less than 10 MB!");
          return;
        }
        if (!e.target.files) return;

        this.file(e.target.files[0]);
      }
    },
    getImg() {
      var e = document.getElementById("projectimg");
      e.click();
    },
    compress(e) {
      const width = 400;
      const height = 300;
      const fileName = e.name;
      const reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        (img.onload = () => {
          const elem = document.createElement("canvas");
          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext("2d");
          // img.width and img.height will contain the original dimensions
          ctx.drawImage(img, 0, 0, width, height);
          ctx.canvas.toBlob(
            blob => {
              const file = new File([blob], fileName, {
                type: "image/jpeg",
                lastModified: Date.now()
              });
            },
            "image/jpeg",
            1
          );
        }),
          (reader.onerror = error => console.log(error));
      };
    }
  },
  computed: {}
};
</script>

<style lang="css" scoped>
.v-form {
  width: 100%;
}
</style>
