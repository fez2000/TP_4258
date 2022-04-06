<template>
  <v-card :elevation="0" :loading="loadedRatio > 0 && loadedRatio < 1">
    <v-toolbar dark v-if="custum" :elevation="0">
      <v-toolbar-items>
        <v-btn @click="close()" small icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-title>{{page}}/{{numPages}}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn icon small @click="zoum_plus()">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn small icon @click="zoum_moin()">
          <v-icon>mdi-minus</v-icon>
        </v-btn>

        <v-btn small @click="$refs.pdf.print()" icon>
          <v-icon>mdi-printer</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-card-text>
      <center>
        <v-progress-circular
          class="mx-auto"
          v-if="loadedRatio > 0 && loadedRatio < 1"
          :rotate="-90"
          :size="100"
          :width="15"
          :value="Math.floor(loadedRatio * 100)"
          color="primary"
        >{{ Math.floor(loadedRatio * 100) }}%</v-progress-circular>
      </center>
      <pdf-preview
        ref="pdf"
        v-show="!custum"
        :src="src"
        :page="page"
        :rotate="rotate"
        @password="password"
        @progress="loadedRatio = $event"
        @error="error"
        @num-pages="numPages = $event"
        @link-clicked="page = $event"
      ></pdf-preview>
      <pdf-preview
        v-show="custum"
        v-for="i in numPages"
        @password="password"
        :key="i"
        @link-clicked="page = $event"
        :src="src"
        :page="i"
        :style="{ width:  zoume + '%', margin: 'auto' }"
      ></pdf-preview>

      <v-btn
        v-if="!custum"
        fab
        top
        dark
        color="primary"
        small
        :right="true"
        :left="false"
        @click="fullPdf"
        absolute
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    src: {
      default: "",
      type: String
    },
    custum: {
      defaut: false,
      type: Boolean
    }
  },
  watch: {
    fab() {
      if (!this.fab) {
        this.fab = true;
      }
    }
  },
  data() {
    return {
      loadedRatio: 0,
      page: 1,
      numPages: 1,
      rotate: 0,
      zoume: 50,
      fab: true
    };
  },
  computed: {
    zoumeStyle() {
      return {
        width: this.zoume + "%"
      };
    }
  },
  methods: {
    close() {
      this.$emit('close', true);
    },
    fullPdf() {
      this.$root.$emit("pdf", {
        src: this.src
      });
    },
    password: function(updatePassword, reason) {
      updatePassword(prompt('password is "test"'));
    },
    error: function(err) {
      console.log(err);
    },
    prev() {
      this.page > 0 ? this.page-- : 0;
    },
    next() {
      this.page < this.numPages ? this.page++ : "";
    },
    zoum_plus() {
      if (this.zoume < 150) {
        this.zoume += 15;
      }
    },
    zoum_moin() {
      if (this.zoume > 15) {
        this.zoume -= 15;
      }
    }
  }
};
</script>

<style>
</style>