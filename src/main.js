import Vue from 'vue';
import store from  './store';
import App from './App';
import Axios from 'axios';
import VueAxios from 'vue-axios';
import common from './common';
import router from './router';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

Vue.use(VueAxios, Axios);
Vue.use(common);
Vue.use(ViewUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
