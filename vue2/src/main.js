/**
 * @file main entry
 * @author
 */
import Vue from 'vue';

import App from '@/index.vue';
import bkMagicVue from 'bk-magic-vue';
import 'bk-magic-vue/dist/bk-magic-vue.min.css';

Vue.use(bkMagicVue);

global.mainComponent = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
