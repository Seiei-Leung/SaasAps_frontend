<template>
  <div id="userSetting-component">
    <div class="userSettingWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
      <!-- 左侧栏 -->
      <div class="userSettingLeftBlock" ref="userSettingLeftBlock">
        <div class="spinWrapper" v-show="isShowSpin">
          <Spin fix size="large"></Spin>
        </div>
        <div v-show="!isShowSpin">
          <Tree :data="treeData" :render="renderContent"></Tree>
        </div>
      </div>
      <!-- 右侧栏 -->
      <div class="userSettingRightBlock" ref="userSettingRightBlock">
        <Table v-bind:height="tableHeight" :loading="tableLoading" border :columns="tableTitle" :data="tableData"></Table>
        <div style="margin-top: 5px; text-align: center;">
          <Button type="primary" @click="insertUserSetting">新 增 用 户 设 置</Button>
        </div>
      </div>
    </div>
    <div>
      <!-- 修改用户信息 -->
      <Modal v-model="isModifyUserSetting" v-bind:title="ModifyUserSettingTitle" @on-ok="ModifyUserSettingOk" @on-cancel="ModifyUserSettingCancel" ok-text="确认" cancel-text="取消">
        <div class="userSetting-component">
          <div class="inputBar">
            <div class="title">
              &nbsp;用户账号：
            </div>
            <div class="inputWrapper">
              <Input v-model="inputCode" style="width: 100px" />
            </div>
            <div class="title">
              用户名称：
            </div>
            <div class="inputWrapper">
              <Input v-model="inputName" style="width: 100px" />
            </div>
          </div>
          <div class="inputBar">
            <div class="title">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;邮箱：
            </div>
            <div class="inputWrapper">
              <Input v-model="inputEmail" style="width: 100px" />
            </div>
            <div class="title">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手机：
            </div>
            <div class="inputWrapper">
              <Input v-model="inputPhoneNum" style="width: 100px" />
            </div>
          </div>
          <div class="inputBar">
            <div class="title">
              管理级别：
            </div>
            <div class="inputWrapper">
              <Input v-model="inputRole" style="width: 100px" />
            </div>
            <div class="title">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;密码：
            </div>
            <div class="inputWrapper">
              <Input v-model="inputPassWord" style="width: 100px" />
            </div>
          </div>
        </div>
      </Modal>
      <!-- 删除用户 -->
      <Modal v-model="isShowDeleteBlock" v-bind:title="deleteBlockTitle" @on-ok="deleteBlockOk" @on-cancel="deleteBlockCancel" ok-text="确认" cancel-text="取消">
        <div>{{deleteBlockText}}</div>
      </Modal>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      tableHeight: 0,
      treeData: [],
      tableLoading: false,
      tableTitle: [{
          title: '用户账号',
          key: 'usercode',
          align: "center"
        },
        {
          title: '用户名称',
          key: 'username',
          align: "center"
        },
        {
          title: '管理级别',
          key: 'role',
          align: "center"
/*          render: (h, params) => {
            const row = params.row;
            const type = params.row.role == 1 ? "md-checkmark-circle" : "md-radio-button-off";
            return h('Icon', {
              props: {
                type: type,
                color: "#2d8cf0"
              }
            });
          }*/
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.changeAttributeTable(params.row, params.index)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteUserSetting(params.row.id, params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      tableData: [],
      isModifyUserSetting: false,
      ModifyUserSettingTitle: "修改用户资料",
      inputCode: "",
      inputName: "",
      inputPassWord: "",
      inputEmail: 0,
      inputRole: "",
      inputID: "",
      inputIndex: "",
      inputTreeCode: "",
      isInsertUserSetting: false,
      isShowDeleteBlock: false,
      deleteBlockText: "是否删除该用户设置",
      deleteBlockTitle: "删除用户设置",
      isShowSpin: true
    };
  },
  methods: {
    reloadTree: function() {
      var that = this;
      this.isShowSpin = true;
      this.axios.get(this.seieiURL + "/usergroup/getall").then((response) => {
        that.treeData = response.data.data;
        that.isShowSpin = false;
      }).catch((error) => {
        that.isShowSpin = false;
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    renderContent: function(h, { root, node, data }) {
      return h('span', {
        class: 'hoverItem ' + data.title,
        style: {
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: '4px',
          cursor: 'pointer'
        },
        on: {
          click: () => { this.selectTree(root, node, data) }
        }
      }, [
        h('Icon', {
          props: {
            type: 'ios-folder-outline'
          },
          style: {
            marginRight: '8px',
            fontSize: '18px'
          }
        }),
        h('span', data.resource.name)
      ]);
    },
    selectTree: function(root, node, data) {
      if (node.nodeKey == 0) {
        return;
      }
      if (this.$refs['userSettingLeftBlock'].getElementsByClassName('active')[0]) {
        this.$refs['userSettingLeftBlock'].getElementsByClassName('active')[0].className = this.$refs['userSettingLeftBlock'].getElementsByClassName('active')[0].className.replace(" active", "");
      }
      this.$refs['userSettingLeftBlock'].getElementsByClassName(data.title)[0].className += ' active';
      var that = this;
      this.tableLoading = true;
      this.inputTreeCode = data.resource.id;
      this.axios.get(this.seieiURL + "/user/getallbyusergroupid", {
        params: {
          usergroupid: data.resource.id
        }
      }).then((response) => {
        that.tableLoading = false;
        that.tableData = response.data.data;
      }).catch((error) => {
        that.tableLoading = false;
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    changeAttributeTable: function(data, index) {
      this.isModifyUserSetting = true;
      this.inputCode = data.usercode;
      this.inputName = data.username;
      this.inputPassWord = data.password;
      this.inputPhoneNum = data.phone;
      this.inputEmail = data.email;
      this.inputRole = data.role;
      this.inputID = data.id;
      this.ModifyUserSettingTitle = "修改用户资料";
      this.isInsertUserSetting = false;
      this.inputIndex = index;
    },
    ModifyUserSettingOk: function() {
      var that = this,
        url;
      if (!this.isInsertUserSetting) {
        url = this.seieiURL + "/user/update";
      } else {
        url = this.seieiURL + "/user/add";
      }
      this.axios.post(url, {
        usercode: this.inputCode,
        username: this.inputName,
        password: this.inputPassWord,
        email: this.inputEmail,
        role: this.inputRole,
        phone: this.inputPhoneNum,
        id: this.inputID,
        usersGroupId: this.inputTreeCode
      }).then((response) => {
        if (response.data.status == 0) {
          that.$Message.success(response.data.msg);
          if (that.isInsertUserSetting) {
            that.tableData.push({
              usercode: that.inputCode,
              username: that.inputName,
              password: "",
              usergroupid: that.inputTreeCode,
              phone: that.inputPhoneNum,
              email: that.inputEmail,
              role: that.inputRole,
              id: response.data.data
            })
          } else {
            that.$set(that.tableData, [that.inputIndex], {
              usercode: that.inputCode,
              username: that.inputName,
              password: "",
              usergroupid: that.inputTreeCode,
              phone: that.inputPhoneNum,
              email: that.inputEmail,
              role: that.inputRole,
              id: that.inputID,
            });
          }
        } else {
          that.$Message.error(response.data.msg);
        }
      }).catch((error) => {
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    ModifyUserSettingCancel: function() {

    },
    deleteUserSetting: function(id, index) {
      this.inputID = id;
      this.inputIndex = index;
      this.isShowDeleteBlock = true;
    },
    deleteBlockOk: function(id) {
      var that = this;
      this.axios.get(this.seieiURL + "/user/delete", {
        params: {
          userid: this.inputID
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.$Message.success(response.data.msg);
          that.tableData.splice(that.inputIndex, 1);
        } else {
          that.$Message.error(response.data.msg);
        }
      }).catch((error) => {
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    deleteBlockCancel: function() {

    },
    insertUserSetting: function() {
      if (!this.inputTreeCode) {
        this.$Message.error("请点击用户组别！");
      } else {
        this.ModifyUserSettingTitle = "新增用户资料";
        this.isInsertUserSetting = true;
        this.isModifyUserSetting = true;
        this.inputCode = "";
        this.inputName = "";
        this.inputPassWord = "";
        this.inputEmail = "";
        this.inputPhoneNum = "";
        this.inputRole = 0;
      }
    }
  },
  created: function() {
    // 页面初始化设置高度
    this.$nextTick(() => {
      this.$refs["userSettingLeftBlock"].style.height = this.$refs["userSettingRightBlock"].style.height = this.windowHeight - 40 - 49 - 30 + "px";
      this.tableHeight = this.windowHeight - 40 - 49 - 30 - 50;
    });
    this.reloadTree();
  }
}

</script>
<style>
#userSetting-component {
  font-size: 0px;
}

#userSetting-component .spinWrapper {
  position: relative;
  margin-top: 50px
}

#userSetting-component .userSettingWrapper {
  overflow-y: hidden;
}

#userSetting-component .userSettingLeftBlock,
#userSetting-component .userSettingRightBlock {
  display: inline-block;
  width: 20%;
  padding-left: 5px;
  font-size: 12px;
  border: 1px solid #ddd;
  overflow-y: scroll;
}

#userSetting-component .userSettingRightBlock {
  width: 80%;
  overflow-y: hidden;
}

#userSetting-component .ivu-table-cell {
  padding: 0;
}

.hoverItem.active {
  background-color: #e0ebff
}

.userSetting-component .inputBar {
  margin-top: 20px;
  font-size: 0;
}

.userSetting-component .inputBar .title {
  display: inline-block;
  margin-left: 15px;
  line-height: 40px;
  font-size: 18px;
  vertical-align: top;
}

.userSetting-component .inputBar .titleFirst {
  margin-left: 5px;
}

.userSetting-component .inputBar .inputWrapper {
  display: inline-block;
  margin-left: 5px;
  line-height: 35px;
  font-size: 12px;
  vertical-align: top;
}

</style>
