<template>
  <div>
    <span v-if="label" :class="labelClass">{{ label }}</span>

    <div class="d-flex mt-3">
      <textarea
        hidden
        ref="p"
        v-model="a"
        :style="pStyle"
        :class="pClass"
        :placeholder="placeholder"
        v-on:input="updateValue($event.target.value)"
      ></textarea>
    </div>
  </div>
</template>

<script>
import { util } from "@/fonctions/emojis";

export default {
  name: "l-input",
  props: {
    label: {
      type: String,
      default: ""
    },
    init: {},
    inline: {
      type: Boolean,
      default: true
    },
    labelClass: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    },
    autocomplete: {
      type: Boolean,
      default: false
    },
    clear: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ""
    },

    emptyStyle: {
      type: String,
      default: `flex-grow:1;width:auto; font-size: 14px; color: '#888'; display: inline-flex`
    },
    emptyClass: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      first: true,
      text: "",
      selection: null,
      elm: null,
      position: 0,
      valueFiltered: "",
      menu: false,
      selected: "point_up",
      hasFocus: false,
      a: ""
    };
  },
  methods: {
    updateValue: function(value) {
      this.$emit("input", value);
    },
    enterUpdate(o) {
      this.$emit("input", this.$refs.p.innerText);
      //  this.text = o.target.innerText   ;
    },
    desable() {
      this.$refs.p.emojioneArea.desable();
    },
    enable() {
      this.$refs.p.emojioneArea.enable();
    }
  },
  watch: {
    text() {
      this.$emit("input", this.text);
    },
    disabled() {
      if (this.disabled) {
        this.desable();
      } else {
        this.enable();
      }
    }
  },

  created() {},
  computed: {
    pClass() {
      return this.value ? this.class : this.emptyClass;
    },
    pStyle() {
      return this.value ? this.style : this.emptyStyle;
    }
  },

  mounted() {
    $(this.$refs.p).emojioneArea({
      emojiPlaceholder: "emoji",
      pickerPosition: "bottom",
      filtersPosition: "top",
      searchPosition: "bottom",
      inline: this.inline,
      autocomplete: false,
      textcomplete: {
        maxCount: 8,
        placement: "top"
      },
      attributes: {
        dir: "ltr",
        spellcheck: true,
        autocomplete: "on",
        autocorrect: "on",
        autocapitalize: "on"
      },
      events: {
        keyup: (editor, event) => {
          this.$emit("input", this.$refs.p.emojioneArea.getText());
        },
        paste: (editor, event) => {
          this.$emit("input", this.$refs.p.emojioneArea.getText());
        },
        change: (editor, event) => {
          this.$emit("input", this.$refs.p.emojioneArea.getText());
        }
      }
    });
  },
  beforeDestroy() {}
};
</script>

<style>
[contenteditable]:empty:before {
  content: attr(data-placeholder);
}

.embedded-link {
  color: primary;
}
/*[data-placeholder]:empty:before {
    content: attr(data-placeholder);
    color: #888;
    font-style: italic;
    }*/
</style>