<template>
  <div id="signin-component">
    <div class="Header">
      登 陆
    </div>
    <div class="InputWrapper">
      <Input prefix="md-home" placeholder="公司名称" style="width: 250px;" size="large" v-model="campanyName" />
    </div>
    <div class="InputWrapper">
      <Input prefix="md-contact" placeholder="用户名" style="width: 250px" size="large" v-model="userName" />
    </div>
    <div class="InputWrapper">
      <Input prefix="md-key" placeholder="密码" style="width: 250px" size="large" type="password" v-model="password" />
    </div>
    <div class="InputWrapper">
      <Button size="large" type="success" style="width: 250px;" @click="signin" @keyup.enter="signin">提交</Button>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data: function() {
    return {
      campanyName: "",
      userName: "",
      password: ""
    }
  },
  created: function() {
    var that = this;
    // 全局绑定 enter 事件，enter 事件的key值为 13
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13) {
        that.signin();
      }
    }
  },
  methods: {
    signin: function() {
      var that = this;
      this.$Spin.show();
      this.axios.post(this.seieiURL + "/user/login", {
        usercode: this.userName,
        pwd: this.password
      }).then((response) => {
        if (response.data.status == 0) {
          sessionStorage.setItem(CONST.IS_ONLINE, true);
          var usermsg = JSON.stringify(response.data.data);
          sessionStorage.setItem(CONST.CURRENT_USER_MSG, usermsg);
          that.$Message.success(response.data.msg);
          that.$store.commit("setIsSignin", true);
          that.$store.commit("setUserRole", response.data.data.role);
          that.$Spin.hide();
        } else {
          that.$Message.error(response.data.msg);
          that.$Spin.hide();
        }
      }).catch((error) => {
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error);
        that.$Spin.hide();
      });
    }
  }
}

</script>
<style scoped>
.Header {
  margin-top: 30px;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
}

.InputWrapper {
  margin: auto;
  margin-top: 30px;
  text-align: center;
}

</style>
