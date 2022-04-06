import Vue from 'vue';
import VueI18n from 'vue-i18n';

const config = require('../../config/lang');

Vue.use(VueI18n);
function importLang(config) {
  const messages = {};
  for (const lang of config.lang) {
    messages[lang.code] = require(`../lang/${lang.file}.${config.extension}`);
  }
  return messages;
}




const messages = importLang(config);
export default new VueI18n({
  locale: config.locale,
  messages: messages
});
