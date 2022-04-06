<template>
  <v-dialog
      v-show="dialogue"
      v-model="dialogue"
      scrollable
      :max-width="'400px'"
      :fullscreen="$vuetify.breakpoint.xs"
      :persistent="!$vuetify.breakpoint.xs"
    >
      <v-card :loading="submitting">
        <v-system-bar :color="(darkTheme)?'primary':'green darken-2'">
          <v-spacer></v-spacer>
          <v-icon @click="clear" color="white">mdi-close</v-icon>
        </v-system-bar>
        <v-img
          @drop.prevent="addFile"
          @dragleave.prevent="gradient=''"
          @dragover.prevent="gradient='to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)'"
          v-if="mode == 'image'"
          :src="previewSrc"
          :lazy-src="previewSrc"
          max-height="300"
          :gradient="gradient"
          @click="getName('photo')"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <vue-plyr v-if="mode == 'video'&&type == mode">
          <video>
            <source :src="video" :type="doc.type" />
          </video>
        </vue-plyr>

        <pdf-card  v-if="mode == 'application'&&type == 'pdf'" :src="application"></pdf-card>

        <vue-plyr v-if="mode == 'video'&&type != mode">
          <audio>
            <source :src="video" :type="doc.type" />
          </audio>
        </vue-plyr>
        <v-card-text v-show="mode == 'post'" style="height: 400px">
          <v-form class="mt-8">
            <l-input
              label="Title: "
              :clear="clearL"
              labelClass="title"
              placeholder="Entrez le titre de votre post"
              @value="getTitle"
            ></l-input>
            <l-input
              class="mt-4"
              label="Description: "
              :clear="clearL"
              :inline="false"
              labelClass="title"
              placeholder="Entrez la description de votre post"
              @value="getDescription"
            ></l-input>
            <v-combobox
              class="mt-5"
              outlined
              v-model="tagsInput"
              persistent-hint
              :items="tagsAll"
              :search-input.sync="searchTag"
              :hide-selected="true"
              label="Add some tags"
              :multiple="true"
              :small-chips="true"
              :hint="`Maximum of ${MAX_TAGS} tags`"
              :clearable="true"
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Pas de resultat "
                      <strong>{{ searchTag }}</strong>". Tapes
                      <kbd>Entrer</kbd> pour creer
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>
          </v-form>
        </v-card-text>
        <v-card-actions v-show="mode != 'post'">
          <input type="text" placeholder="text alternatif" />
          <v-spacer></v-spacer>
          <v-btn
            dark
            :color="(darkTheme)?'primary':'green darken-2'"
            @click="mode = 'post'"
            text
          >Suivant</v-btn>
        </v-card-actions>

        <v-card-actions v-if="mode == 'post'">
          <v-btn
            :disabled="doc&&!fichier"
            @click="getName('photo')"
            dark
            :color="(doc&&fichier)?'primary':'grey'"
            icon
          >
            <v-icon>mdi-camera-outline</v-icon>
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn
            :disabled="doc&&!video"
            @click="getName('video')"
            :color="(doc&&video)?'primary':'grey'"
            icon
          >
            <v-icon>mdi-camcorder</v-icon>
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn
            :disabled="doc&&!application"
            @click="getName('doc')"
            :color="(doc&&application)?'primary':'grey'"
            icon
          >
            <v-icon>mdi-file-outline</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            dark
            :color="(darkTheme)?'primary':'green darken-2'"
            @click="post"
            :load="submitting"
            :disabled="submitting|| (!message&&!doc) || !title"
            text
          >Post</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        dialogue: {
            type: Boolean,
            default: false
        },
        darkTheme: {
            type: Boolean,
            default: false
        },
        message: {

        },
        doc: {
            
        },
        post: {

        },
        submitting: {

        },
        application:{

        },
        video
    }
}
</script>

<style>

</style>