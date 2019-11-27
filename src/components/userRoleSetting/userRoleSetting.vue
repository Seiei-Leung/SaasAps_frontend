<template>
  <div id="userRoleSetting-component">
    <div class="userRoleSettingWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
      <div class="leftContainer">
        <div class="topWrapper">
          <div class="title">
            用户组别
          </div>
          <div class="topContain" ref="topContain">
            <div class="spinWrapper" v-show="isShowSpinTop">
              <Spin fix size="large"></Spin>
            </div>
            <div v-show="!isShowSpinTop">
              <Tree :data="treeData" @on-select-change="selectUserGroup"></Tree>
            </div>
          </div>
        </div>
        <div class="bottomWrapper" style="margin-top: 10px;">
          <div class="title">
            用户列表
          </div>
          <div class="bottomContain">
            <Table v-bind:height="tableHeight" :loading="tableLoading" border :columns="tableTitle" :data="tableData" @on-row-dblclick="selectTable" :highlight-row="highlightRow"></Table>
          </div>
        </div>
      </div>
      <div class="rightContainer">
        <div class="title">
          生产线
        </div>
        <div class="bottomContain" ref="rightContainer">
            <div class="spinWrapper" v-show="isShowSpinRight">
              <Spin fix size="large"></Spin>
            </div>
            <div v-show="!isShowSpinRight">
              <Tree :data="mainTreeData" show-checkbox multiple ref="mainTree"></Tree>
            </div>
        </div>
        <div style="margin-top: 15px;text-align:center;">
          <Button type="primary" @click="submitData">保 存 设 置</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CONST from "../../common/const";

export default {
  data: function() {
    return {
      treeData: [],
      tableHeight: 0,
      tableLoading: false,
      tableTitle: [{
        title: '编码',
        key: 'usercode'
      }, {
        title: '姓名',
        key: 'username'
      }],
      tableData: [],
      mainTreeData: [],
      highlightRow: true,
      selectedUserId: "",
      isShowSpinTop: true,
      isShowSpinRight: true
    }
  },
  methods: {
    reloadMainTable: function() {
      var that = this;
      this.isShowSpinTop = true;
      this.isShowSpinRight = true;
      this.axios.get(this.seieiURL + "/usergroup/getall").then((response) => {
        if (response.data.status) {
          that.$Message.error(response.data.msg);
          that.isInvaildSession(response.data.status);
          return;
        }
        that.treeData = response.data.data;
        that.isShowSpinTop = false;
      }).catch((error) => {
        that.isShowSpinTop = false;
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
      this.axios.get(this.seieiURL + "/productionlineright/getall").then((response) => {
        if (response.data.status) {
          that.$Message.error(response.data.msg);
          that.isInvaildSession(response.data.status);
          return;
        }
        that.mainTreeData.push(response.data.data);
        that.isShowSpinRight = false;
      }).catch((error) => {
        that.isShowSpinRight = false;
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    selectUserGroup: function(data) {
      if (data[0] == null) {
        return;
      }
      var that = this;
      this.tableLoading = true;
      this.axios.get(this.seieiURL + "/user/getallbyusergroupid", {
        params: {
          usergroupid: data[0].resource.id
        }
      }).then((response) => {
        if (response.data.status) {
          that.$Message.error(response.data.msg);
          that.isInvaildSession(response.data.status);
          return;
        }
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
    selectTable: function(data, index) {
      this.clearChecked();
      this.selectedUserId = data.id;
      var that = this;
      this.axios.get(this.seieiURL + "/productionlineright/getbyuserid", {
        params: {
          userid: data.id
        }
      }).then((response) => {
        if (response.data.status) {
          that.$Message.error(response.data.msg);
          that.isInvaildSession(response.data.status);
          return;
        }
        this.test = true
        var resultList = [];
        var
          mainTreeData = that.mainTreeData[0].children,
          resultmainTreeData = that.mainTreeData[0].children.slice();
        response.data.data.forEach((item) => {
          for (var i = 0; i < mainTreeData.length; i++) {
            var treeBean = mainTreeData[i].children;
            for (var n = 0; n < treeBean.length; n++) {
              var treeBean1 = treeBean[n].children;
              for (var m = 0; m < treeBean1.length; m++) {
                if (treeBean1[m].id == item.productLineId) {
                  resultmainTreeData[i].children[n].children[m].checked = true;
                }
              }
            }
          }
        });
        var resultList = [];
        var resultObj = {};
        resultObj.title = "全部";
        resultObj.children = resultmainTreeData;
        resultObj.expand = true;
        resultList.push(resultObj);
        that.mainTreeData = resultList;
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
    clearChecked: function() {
      var
        mainTreeData = this.mainTreeData[0].children,
        resultmainTreeData = mainTreeData.slice(0, mainTreeData.length);

      for (var i = 0; i < resultmainTreeData.length; i++) {
        var treeBean = resultmainTreeData[i].children;
        for (var n = 0; n < treeBean.length; n++) {
          var treeBean1 = treeBean[n].children;
          for (var m = 0; m < treeBean1.length; m++) {
            resultmainTreeData[i].checked = false;
            resultmainTreeData[i].expand = false;
            resultmainTreeData[i].indeterminate = false;
            resultmainTreeData[i].children[n].checked = false;
            resultmainTreeData[i].children[n].expand = false;
            resultmainTreeData[i].children[n].indeterminate = false;
            resultmainTreeData[i].children[n].children[m].checked = false;
          }
        }
      }
      var resultList = [];
      var resultObj = {};
      resultObj.title = "全部";
      resultObj.children = resultmainTreeData;
      resultObj.expand = false;
      resultList.push(resultObj);
      this.mainTreeData = resultList;
    },
    submitData: function() {
      if (!this.selectedUserId) {
        this.$Message.error("请先选择用户！！");
        return;
      }
      var
        list = [],
        that = this;
      this.$refs.mainTree.getCheckedNodes().forEach((item) => {
        if (item.id) {
          list.push(item.id);
        }
      });
      this.axios.post(this.seieiURL + "/productionlineright/update", {
        list: list,
        userId: this.selectedUserId
      }).then((response) => {
        if (response.data.status == 0) {
          that.$Message.success(response.data.msg);
        } else {
          that.$Message.error(response.data.msg);
          that.isInvaildSession(response.data.status);
        }
      }).catch((error) => {
        that.tableLoading = false;
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    }
  },
  created: function() {
    // 页面初始化设置高度
    this.$nextTick(() => {
      this.$refs["rightBlockTabpaneWrapper"].style.height = this.windowHeight - CONST.cssData.pageHeaderHeight - CONST.cssData.containerPageTabHeight + "px";
      var topContainHeight = Math.floor((this.windowHeight - CONST.cssData.pageHeaderHeight - CONST.cssData.containerPageTabHeight - CONST.cssData.rightBlockTabpaneWrapperPaddingBottom) / 2) - CONST.cssData.topWrapperTitleHeight - CONST.cssData.topWrapperTitleMarginTop - CONST.cssData.borderHeight * 2;
      this.tableHeight = topContainHeight;
      this.$refs["topContain"].style.height = topContainHeight + "px";
      this.$refs["rightContainer"].style.height = this.windowHeight - CONST.cssData.pageHeaderHeight - CONST.cssData.containerPageTabHeight - CONST.cssData.rightBlockTabpaneWrapperPaddingBottom - CONST.cssData.topWrapperTitleHeight - CONST.cssData.borderHeight * 4 - 47 + "px";

    });
    this.reloadMainTable();
  }
}

</script>
<style scoped>
#userRoleSetting-component {
  font-size: 0
}
#userRoleSetting-component .spinWrapper {
  position: relative;
  margin-top: 50px
}
#userRoleSetting-component .leftContainer,
#userRoleSetting-component .rightContainer {
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  width: 30%;
}

#userRoleSetting-component .rightContainer {
  margin-left: 1%;
  width: 69%;
}

#userRoleSetting-component .leftContainer .topWrapper,
#userRoleSetting-component .leftContainer .bottomWrapper {
  box-sizing: border-box;
}



#userRoleSetting-component .leftContainer .topContain,
#userRoleSetting-component .leftContainer .bottomContain,
#userRoleSetting-component .rightContainer .bottomContain {
  box-sizing: border-box;
}

#userRoleSetting-component .leftContainer .topContain,
#userRoleSetting-component .rightContainer .bottomContain {
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-top: none;
  overflow-y: scroll;
}

#userRoleSetting-component .leftContainer .topContain {
  padding-left: 5px;
}

#userRoleSetting-component .leftContainer .topWrapper .title,
#userRoleSetting-component .leftContainer .bottomWrapper .title,
#userRoleSetting-component .rightContainer .title {
  box-sizing: border-box;
  padding-left: 1.5em;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  background-color: #717171;
  color: #fff;
}

</style>
