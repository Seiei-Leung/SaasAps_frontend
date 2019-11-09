<template>
  <div id="indexContextSplit-component">
    <div class="splitWrapper" ref="splitWrapper">
      <Split v-model="splitPercent" min="200px" max="1000px">
        <div slot="left">
          <div class="left-split-pane">
            <div class="closeBtn" @click="closeLeftBlock">
              <Icon type="ios-arrow-back" v-show="splitPercent != 0" />
              <Icon type="ios-arrow-forward" v-show="splitPercent == 0" />
            </div>
            <div class="leftBlock" ref="leftBlock">
              <Menu :theme="theme" width="100%" accordion @on-select="openTag">
                <Submenu name="1" v-if="isAdmin">
                  <template slot="title">
                    <Icon type="ios-paper" />
                    权限管理
                  </template>
                  <MenuItem name="11">用户设置</MenuItem>
                  <MenuItem name="12">权限设置</MenuItem>
                  <MenuItem name="13">用户组别</MenuItem>
                </Submenu>
                <Submenu name="2" v-if="isAdmin">
                  <template slot="title">
                    <Icon type="ios-people" />
                    参数设置
                  </template>
                  <MenuItem name="21">颜色设置</MenuItem>
                </Submenu>
                <Submenu name="3">
                  <template slot="title">
                    <Icon type="ios-stats" />
                    基础设置
                  </template>
                  <MenuItem name="31">生产设置</MenuItem>
                  <MenuItem name="32">工厂日历</MenuItem>
                  <MenuItem name="33">排产品类</MenuItem>
                </Submenu>
                <Submenu name="4">
                  <template slot="title">
                    <Icon type="ios-people" />
                    排产管理
                  </template>
                  <MenuItem name="41">走货一览表</MenuItem>
                  <MenuItem name="42">排产器</MenuItem>
                </Submenu>
                <Submenu name="5">
                  <template slot="title">
                    <Icon type="ios-people" />
                    报表查询
                  </template>
                  <MenuItem name="5-1">生产排期查询</MenuItem>
                  <MenuItem name="5-2">SAH每月查询</MenuItem>
                </Submenu>
              </Menu>
            </div>
          </div>
        </div>
        <div slot="right">
          <div class="right-split-pane">
            <div class="rightBlock" ref="rightBlock">
              <Tabs type="card" closable @on-tab-remove="handleTabRemove" :value="activeTab" name="indexContentSplit">
                <!-- 用户设置 -->
                <TabPane label="用户设置" v-if="isShowList['11']" name="11" tab="indexContentSplit">
                  <v-userSetting></v-userSetting>
                </TabPane>
                <!-- 权限设置 -->
                <TabPane label="权限设置" v-if="isShowList['12']" name="12" tab="indexContentSplit">
                  <v-userRoleSetting></v-userRoleSetting>
                </TabPane>
                <!-- 用户组别 -->
                <TabPane label="用户组别" v-if="isShowList['13']" name="13" tab="indexContentSplit">
                  <v-userGroup></v-userGroup>
                </TabPane>
                <!-- 颜色设置 -->
                <TabPane label="颜色设置" v-if="isShowList['21']" name="21" tab="indexContentSplit">
                  <v-colorSetting></v-colorSetting>
                </TabPane>
                <!-- 生产设置 -->
                <TabPane label="生产设置" v-if="isShowList['31']" name="31" tab="indexContentSplit">
                  <v-productionSetting></v-productionSetting>
                </TabPane>
                <!-- 工厂日历 -->
                <TabPane label="工厂日历" v-if="isShowList['32']" name="32" tab="indexContentSplit">
                  <v-factoryCalendar></v-factoryCalendar>
                </TabPane>
                <!-- 排产品类 -->
                <TabPane label="排产品类" v-if="isShowList['33']" name="33" tab="indexContentSplit">
                  <v-productionClass></v-productionClass>
                </TabPane>
                <!-- 排产品类 -->
                <TabPane label="走货一览表" v-if="isShowList['41']" name="41" tab="indexContentSplit">
                  <v-productionPlanningDetail></v-productionPlanningDetail>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </Split>
    </div>
  </div>
</template>
<script>
import factoryCalendar from "../factoryCalendar/factoryCalendar";
import productionSetting from "../productionSetting/productionSetting";
import productionClass from "../productionClass/productionClass";
import userGroup from "../userGroup/userGroup";
import userSetting from "../userSetting/userSetting";
import userRoleSetting from "../userRoleSetting/userRoleSetting";
import productionPlanningDetail from "../productionPlanningSetting/productionPlanningSetting";
import colorSetting from "../colorSetting/colorSetting";

const headerBarHeight = 40;

export default {
  data: function() {
    return {
      splitPercent: 0.2, // 左右侧初始化比例
      theme: "light", // 左侧栏主题颜色
      // 用于是否显示右侧模块
      isShowList: {
        11: false, // 用户设置
        12: false, // 权限设置
        13: false, // 用户组别
        21: false, // 颜色设置
        32: false, // 工厂日历
        31: false, // 生产设置
        33: false, // 排产品类
        41: false, // 走货一览表
      },
      nowShowingList: [], // 用于重新加载 Tab 组件
      activeTab: ""
    }
  },
  methods: {
    // 左侧栏关闭按钮事件
    closeLeftBlock: function() {
      this.splitPercent == 0 ? this.splitPercent = 0.2 : this.splitPercent = 0;
    },
    // 左侧栏项目点击显示事件
    openTag: function(name) {
      // 如果点击排产器，跳转页面
      if (name == "42") {
        var href = window.location.href;
        href = href.split("/#")[0] + "/ps/#/";
        window.open(href);
        return true;
      }
      // 框架有bug，必须按 TabPane 组件Dom书写顺序进行加载组件，否则会导致 Tab 组件与 TabPane 组件内容错乱
      // 记录已经激活的Tab组件后，设置 Tab 组件为初始状态
      var isnowShowingListHadName = false; 
      this.nowShowingList.forEach((item) => {
        this.isShowList[item] = false;
        if (item == name) {
          isnowShowingListHadName = true;
        }
      });
      if (!isnowShowingListHadName) {
        this.nowShowingList.push(Number(name));
      }
      var that = this;
      this.nowShowingList.sort();
      // 增加延迟，按 TabPane 组件Dom书写顺序进行加载组件
      setTimeout(function() {
        that.nowShowingList.forEach((item) => {
          that.isShowList[item] = true;
          that.activeTab = name;
        })
      }, 100);
    },
    // 分页栏关闭事件
    handleTabRemove: function(name) {
      this.isShowList[name] = false;
      // 移出记录
      for (var i=0; i<this.nowShowingList.length; i++) {
        if (this.nowShowingList[i] == name) {
          // 如果当前标签为激活标签，则重新定义激活标签
          if (name == this.activeTab) {
            if (i != 0) {
              this.activeTab = String(this.nowShowingList[i-1]);
            } else if (this.nowShowingList.length > 1){
              this.activeTab = String(this.nowShowingList[i+1]);
            } else {
              this.activeTab = "";
            }
          }
          this.nowShowingList.splice(i, 1);
          break;
        }
      }
    },
  },
  computed: {
    isAdmin: function() {
      return this.$store.state.userRole == CONST.ISADMIN;
    }
  },
  created: function() {
    // 初始化页面
    this.$nextTick(() => {
      // 定高度值
      this.$refs.splitWrapper.style.height = this.windowHeight - headerBarHeight + "px";
      this.$refs.leftBlock.style.height = this.windowHeight - headerBarHeight + "px";
      this.$refs.rightBlock.style.height = this.windowHeight - headerBarHeight + "px";
    });
  },
  components: {
    'v-factoryCalendar': factoryCalendar,
    'v-productionSetting': productionSetting,
    'v-productionClass': productionClass,
    'v-userGroup': userGroup,
    'v-userSetting': userSetting,
    'v-userRoleSetting': userRoleSetting,
    'v-productionPlanningDetail': productionPlanningDetail,
    'v-colorSetting': colorSetting,
  }
}

</script>
<style>
#indexContextSplit-component .splitWrapper {
  height: 200px;
  border-bottom: 1px solid #dcdee2;
}

#indexContextSplit-component .splitWrapper .leftBlock {
  position: relative;
  overflow-y: scroll;
}

#indexContextSplit-component .splitWrapper .closeBtn {
  position: absolute;
  right: -20px;
  top: 40%;
  width: 15px;
  height: 100px;
  line-height: 100px;
  border: 1px solid #ddd;
  text-align: center;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: #fff;
  z-index: 1
}

#indexContextSplit-component .splitWrapper .closeBtn:hover {
  background-color: #eee
}

#indexContextSplit-component .splitWrapper .rightBlock {
  box-sizing: border-box;
  width: 100%;
  padding: 1px 0 0 7px;
}

/* 修正 */
#indexContextSplit-component .splitWrapper .ivu-menu-submenu-title {
  border-bottom: 1px solid #dcdee2;
}

#indexContextSplit-component .splitWrapper .ivu-menu-vertical.ivu-menu-light:after {
  width: 0
}

#indexContextSplit-component .splitWrapper .ivu-menu-item {
  background-color: #fbfbfb
}

#indexContextSplit-component .splitWrapper .ivu-menu-item:hover {
  background-color: #eee
}

#indexContextSplit-component .splitWrapper .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: #e0ebff;
}

.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active {
	color: #565656;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
