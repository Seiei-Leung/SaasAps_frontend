import Vue from 'vue'
import store from  './store'
import App from './App'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import util from './util'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(VueAxios, Axios);
Vue.use(util);
Vue.use(iView);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
