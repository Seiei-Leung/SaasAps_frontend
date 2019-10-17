import Vue from 'vue';
import store from  './store';
import App from './App';
import Axios from 'axios';
import VueAxios from 'vue-axios';
import util from './util';
import router from './router';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

Vue.use(VueAxios, Axios);
Vue.use(util);
Vue.use(ViewUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
