/* eslint-disable max-len */
// Sidebar on the right. Used as a local plugin in DashboardLayout.vue
import VueMaterial from 'vue-material';


// asset imports
import 'vue-material/dist/vue-material.min.css';
import './assets/scss/material-dashboard.scss';
import 'vue-material/dist/theme/black-green-light.css';


/**
 * This is the main Light Bootstrap Dashboard Vue plugin where dashboard related plugins are registerd.
 */
export default {
  install(Vue) {
  
    Vue.use(VueMaterial);
  },
};
