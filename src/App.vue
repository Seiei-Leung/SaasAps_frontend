<template>
  <div id="app">
      <v-signin v-if="!isSignin"></v-signin>
      <div v-if="isSignin">
        <div class="indexPageWrapper">
          <v-pageHeader></v-pageHeader>
          <div class="content">
            <v-indexContentSplit></v-indexContentSplit>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import signIn from './components/signIn/signIn';
import pageHeader from './components/pageHeader/pageHeader';
import indexContentSplit from './components/indexContentSplit/indexContentSplit';
import CONST from "./common/const";

export default {
  name: 'App',
  data: function() {
    return {

    };
  },
  computed: {
    isSignin: function() {
      return this.$store.state.isSignin;
    }
  },
  created: function() {
    if (sessionStorage.getItem(CONST.CONSTOFUSER.IS_ONLINE)) {
      this.$store.commit("setIsSignin", true);
    }
    var usermsg = sessionStorage.getItem(CONST.CONSTOFUSER.CURRENT_USER_MSG);
    if (usermsg) {
      this.$store.commit("setUserRole", JSON.parse(usermsg).role);
    }
    var href = window.location.href;
    var index = href.match("/signIn");
    if (index != null && sessionStorage.getItem(CONST.CONSTOFUSER.IS_ONLINE)) {
			sessionStorage.clear();
      href = href.split("signIn")[0];
			this.$store.commit("setIsSignin", false);
			this.$store.commit("setUserRole", 0);
      window.location.assign(href);
    }
  },
  components: {
    'v-signin': signIn,
    'v-pageHeader': pageHeader,
    'v-indexContentSplit': indexContentSplit
  }
}
</script>

<style>
#app {

}
</style>
