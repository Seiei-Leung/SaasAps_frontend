<template>
  <div id="factoryCalender-compenont">
    <div class="factoryCalenderWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
      <transition name="fade">
        <div v-show="!isShowSettingBlock">
          <Table height="450" :loading="sumTableLoading" border :columns="sumTableTitle" :data="sumTableData"></Table>
          <div style="margin-top: 30px;text-align:center;">
            <Button type="primary" @click="showAddFactoryCalendar">新 增 工 作 日 历</Button>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div v-show="isShowSettingBlock">
          <div class="topBlock">
            <Divider class="headerDivider">主 要 信 息</Divider>
            <div class="inputBar">
              <div class="title">
                年度：
              </div>
              <div class="inputWrapper">
                <DatePicker type="year" @on-change="changeYear" :value="nowYear" placeholder="选择年份" style="width: 200px" :clearable="false"></DatePicker>
              </div>
            </div>
            <div class="inputBar">
              <div class="title">
                工作日设置：
              </div>
              <div class="inputWrapper">
                <CheckboxGroup v-model="workDates">
                  <Checkbox label="1">
                    <span>星期一</span>
                  </Checkbox>
                  <Checkbox label="2">
                    <span>星期二</span>
                  </Checkbox>
                  <Checkbox label="3">
                    <span>星期三</span>
                  </Checkbox>
                  <Checkbox label="4">
                    <span>星期四</span>
                  </Checkbox>
                  <Checkbox label="5">
                    <span>星期五</span>
                  </Checkbox>
                  <Checkbox label="6">
                    <span>星期六</span>
                  </Checkbox>
                  <Checkbox label="7">
                    <span>星期日</span>
                  </Checkbox>
                </CheckboxGroup>
              </div>
            </div>
          </div>
          <div class="bottomBlock">
            <Divider class="headerDivider" style="font-weight:normal;">特 殊 日 期 设 置</Divider>
            <div>
              <Table :loading="inputTableLoading" border :columns="inputTableTitle" :data="inputTableData"></Table>
            </div>
            <div class="addFestivalBlock">
              <Button type="warning" @click="addFestival" size="small">
                新增特殊日期
              </Button>
            </div>
            <div style="margin-top:30px;text-align:center;">
              <Button type="success" style="width: 200px;" size="large" @click="submit" :loading="isSubmitloading">
                保 存 设 置
              </Button>
              <Button type="text" style="margin-left: 30px;width: 200px;background-color:#ddd;" size="large" @click="getOut">
                退 出
              </Button>
            </div>
          </div>
          <div>
            <Modal v-model="isShowSettingFestival" v-bind:title="modelTitle" @on-ok="settingFestivalOk" @on-cancel="settingFestivalCancel" ok-text="确认" cancel-text="取消">
              <div>节日名称：<Input v-model="inputFestivalName" placeholder="输入节日名称" style="margin-left: 10px;width:200px" /></div>
              <div style="margin-top:20px;">开始日期：<DatePicker type="date" @on-change="changeInputFestivalBtime" :value="inputFestivalBtime" placeholder="选择日期" style="margin-left: 10px;width: 200px" :clearable="false"></DatePicker>
              </div>
              <div style="margin-top:20px;">结束日期：<DatePicker type="date" @on-change="changeInputFestivalEtime" :value="inputFestivalEtime" placeholder="选择日期" style="margin-left: 10px;width: 200px" :clearable="false"></DatePicker>
              </div>
            </Modal>
            <!-- 删除日历 -->
            <Modal v-model="isShowDeleteBlock" v-bind:title="deleteBlockTitle" @on-ok="deleteBlockOk" @on-cancel="deleteBlockCancel" ok-text="确认" cancel-text="取消">
              <div>{{deleteBlockText}}</div>
            </Modal>
            <!-- 新建日历 -->
            <Modal v-model="isShowAddFactoryCalendar" v-bind:title="addFactoryCalendarTitle" @on-ok="addFactoryCalendar" @on-cancel="addFactoryCalendarCancel" ok-text="确认" cancel-text="取消">
              <div>年度：
                <DatePicker type="year" @on-change="changeYear" :value="nowYear" placeholder="选择年份" style="width: 200px;margin-left: 15px;" :clearable="false"></DatePicker>
              </div>
              <div class="inputBar" style="margin-top: 15px;line-height: 2em;">
                <div class="title">
                  工作日设置：
                </div>
                <div class="inputWrapper" style="margin-top: 5px;">
                  <CheckboxGroup v-model="workDates">
                    <Checkbox label="1">
                      <span>星期一</span>
                    </Checkbox>
                    <Checkbox label="2">
                      <span>星期二</span>
                    </Checkbox>
                    <Checkbox label="3">
                      <span>星期三</span>
                    </Checkbox>
                    <Checkbox label="4">
                      <span>星期四</span>
                    </Checkbox>
                    <Checkbox label="5">
                      <span>星期五</span>
                    </Checkbox>
                    <Checkbox label="6">
                      <span>星期六</span>
                    </Checkbox>
                    <Checkbox label="7">
                      <span>星期日</span>
                    </Checkbox>
                  </CheckboxGroup>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import DateUtil from "../../common/DateUtil";

export default {
  data: function() {
    return {
      sumTableLoading: true,
      // 主档表格标题
      sumTableTitle: [{
          title: '年度',
          key: 'year',
          align: "center",
          sortType: "desc"
        },
        {
          title: '星期一',
          key: 'monday',
          align: "center",
          render: (h, params) => {
            const type = params.row.monday ? "md-checkmark-circle" : "md-radio-button-off";
            return h('Icon', {
              props: {
                type: type,
                color: "#2d8cf0"
              }
            });
          }
        },
        {
          title: '星期二',
          key: 'tuesday',
          align: "center",
          render: (h, params) => {
            const type = params.row.tuesday ? "md-checkmark-circle" : "md-radio-button-off";
            return h('Icon', {
              props: {
                type: type,
                color: "#2d8cf0"
              }
            });
          }
        },
        {
          title: '星期三',
          key: 'wednesday',
          align: "center",
          render: (h, params) => {
            const type = params.row.wednesday ? "md-checkmark-circle" : "md-radio-button-off";
            return h('Icon', {
              props: {
                type: type,
                color: "#2d8cf0"
              }
            });
          }
        },
        {
          title: '星期四',
          key: 'thursday',
          align: "center",
          render: (h, params) => {
            const type = params.row.thursday ? "md-checkmark-circle" : "md-radio-button-off";
            return h('Icon', {
              props: {
                type: type,
                color: "#2d8cf0"
              }
            });
          }
        },
        {
          title: '星期五',
          key: 'friday',
          align: "center",
          render: (h, params) => {
            const type = params.row.friday ? "md-checkmark-circle" : "md-radio-button-off";
            return h('Icon', {
              props: {
                type: type,
                color: "#2d8cf0"
              }
            });
          }
        },
        {
          title: '星期六',
          key: 'saturday',
          align: "center",
          render: (h, params) => {
            const type = params.row.saturday ? "md-checkmark-circle" : "md-radio-button-off";
            return h('Icon', {
              props: {
                type: type,
                color: "#2d8cf0"
              }
            });
          }
        },
        {
          title: '星期日',
          key: 'sunday',
          align: "center",
          render: (h, params) => {
            const type = params.row.sunday ? "md-checkmark-circle" : "md-radio-button-off";
            return h('Icon', {
              props: {
                type: type,
                color: "#2d8cf0"
              }
            });
          }
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
                    this.showSettingBlock(params.row, params.index)
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
                    this.deleteSumTable(params.row, params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      sumTableData: [], // 主档数据
      isAddMainTable: false, // 是否新增主档数据
      isShowSettingBlock: false, // 是否显示设置模块
      workDates: [], // 选择星期工作日
      nowYear: "", // 年度
      // 修改栏表格标题
      inputTableTitle: [{
          title: '节日名称',
          key: 'festivalName'
        },
        {
          title: '开始时间',
          key: 'btime'
        },
        {
          title: '结束时间',
          key: 'etime'
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
                    this.changeFestival(params.index)
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
                    this.removeFestival(params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      isSubmitloading: false, // 点击提交按钮loading
      id: "", // 工厂日历唯一标识号
      inputTableLoading: true, // 节日表 loading
      inputTableData: [], // 修改栏表格数据
      modelTitle: "", // 设置特殊日期对话框题目
      isShowSettingFestival: false, // 是否显示设置特殊日期对话框
      isModify: false, // 是否是修改特殊日期
      modifyIndex: "", // 修改特殊日期的索引
      inputFestivalName: "", // 设置特殊日期的名称
      inputFestivalBtime: "", // 设置特殊日期的开始日期
      inputFestivalEtime: "", // 设置特殊日期的结束日期
      isShowDeleteBlock: false,
      deleteBlockText: "是否删除该工作日历",
      deleteBlockTitle: "删除工作日历",
      isShowAddFactoryCalendar: false,
      addFactoryCalendarTitle: "新增工作日历",

    }
  },
  created: function() {
    // 页面初始化设置高度
    this.$nextTick(() => {
      this.$refs["rightBlockTabpaneWrapper"].style.height = this.windowHeight - 40 - 49 + "px"
    });
    this.reloadMainTable();
  },
  methods: {
    // 刷新主档表格数据
    reloadMainTable: function() {
      var that = this;
      this.sumTableLoading = true;
      this.axios.get(this.seieiURL + '/factoryCalendar/getFactoryCalendarList').then((response) => {
        if (response.data.status) {
          that.$Message.error(response.data.msg);
          that.isInvaildSession(response.data.status);
          return;
        }
        var list = [];
        response.data.data.forEach((item) => {
          var listItem = {};
          listItem.year = item.effectiveYear;
          listItem.btime = item.beginWorkingTime;
          listItem.etime = item.endWorkingTime;
          listItem.workDates = [];
          listItem.monday = item.monday;
          listItem.tuesday = item.tuesday;
          listItem.wednesday = item.wednesday;
          listItem.thursday = item.thursday;
          listItem.friday = item.friday;
          listItem.saturday = item.saturday;
          listItem.sunday = item.sunday;
          item.monday ? listItem.workDates.push('1') : null;
          item.tuesday ? listItem.workDates.push('2') : null;
          item.wednesday ? listItem.workDates.push('3') : null;
          item.thursday ? listItem.workDates.push('4') : null;
          item.friday ? listItem.workDates.push('5') : null;
          item.saturday ? listItem.workDates.push('6') : null;
          item.sunday ? listItem.workDates.push('7') : null;
          listItem.id = item.id;
          list.push(listItem);
        });
        that.sumTableData = list;
        that.sumTableLoading = false;
      }).catch((error) => {
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    // 显示添加工厂日历
    showAddFactoryCalendar: function() {
      this.isShowAddFactoryCalendar = true;
      this.workDates = []; // 选择星期工作日
      this.nowYear = ""; // 年度
    },
    // 添加工厂日历
    addFactoryCalendar: function() {
      if (!this.nowYear) {
        this.$Message.error("年度不能为空");
        return;
      }
      var that = this;
      var args = {};
      args.effectiveYear = (new Date(this.nowYear)).getFullYear();
      if (this.workDates.length == 0) {
        args.monday = false;
        args.tuesday = false;
        args.wednesday = false;
        args.thursday = false;
        args.friday = false;
        args.saturday = false;
        args.sunday = false;
      } else {
        this.workDates.forEach((item) => {
          args.monday = (args.monday || item == "1") ? true : false;
          args.tuesday = (args.tuesday || item == "2") ? true : false;
          args.wednesday = (args.wednesday || item == "3") ? true : false;
          args.thursday = (args.thursday || item == "4") ? true : false;
          args.friday = (args.friday || item == "5") ? true : false;
          args.saturday = (args.saturday || item == "6") ? true : false;
          args.sunday = (args.sunday || item == "7") ? true : false;
        });
      }
      this.axios.get(this.seieiURL + "/factoryCalendar/addFactoryCalendar", {
        params: args
      }).then((response) => {
        if (response.data.status == 0) {
          that.$Message.success(response.data.msg);
          that.isShowSettingBlock = true;
          that.inputTableLoading = false;
          that.idOfFactoryCalendar = response.data.data;
        } else {
          that.$Message.error(response.data.msg);
          that.isInvaildSession(response.data.status);
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
    // 点击主档表格
    showSettingBlock: function(data, index) {
      this.workDates = data.workDates;
      this.nowYear = new Date(data.year + "-01-01");
      this.idOfFactoryCalendar = data.id;
      this.isShowSettingBlock = true;
      this.inputTableLoading = true;
      var that = this;
      this.axios.get(this.seieiURL + '/factoryCalendar/getFestival?id=' + data.id).then((response) => {
        if (response.data.status) {
          that.$Message.error(response.data.msg);
          that.isInvaildSession(response.data.status);
          return;
        }
        var list = [];
        response.data.data.forEach((item) => {
          var listItem = {};
          listItem.festivalName = item.festivalName;
          listItem.btime = DateUtil.timeStampToDate(new Date(item.beginDate));
          listItem.etime = DateUtil.timeStampToDate(new Date(item.endDate));
          listItem.id = item.id;
          that.inputTableData.push(listItem);
        });
        that.inputTableLoading = false;
      }).catch((error) => {
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    // 修改年度
    changeYear: function(date) {
      this.nowYear = new Date(date);
    },
    // 修改节日开始日期
    changeInputFestivalBtime: function(date) {
      this.inputFestivalBtime = new Date(date);
    },
    // 修改节日结束日期
    changeInputFestivalEtime: function(date) {
      this.inputFestivalEtime = new Date(date);
    },
    // 点击修改按钮
    changeFestival: function(index) {
      this.inputFestivalName = this.inputTableData[index].festivalName;
      this.inputFestivalBtime = new Date(this.inputTableData[index].btime);
      this.inputFestivalEtime = new Date(this.inputTableData[index].etime);
      this.isModify = true;
      this.modifyIndex = index;
      this.modelTitle = "修改节日";
      this.isShowSettingFestival = true;
    },
    // 点击移出按钮
    removeFestival: function(index) {
      var that = this;
      this.axios.get(this.seieiURL + "/factoryCalendar/deleteFestival?id=" + this.inputTableData[index].id).then((response) => {
        if (response.data.status == 0) {
          that.inputTableData.splice(index, 1);
          that.$Message.success(response.data.msg);
        } else {
          that.$Message.error(response.data.msg);
          that.isInvaildSession(response.data.status);
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
    // 点击设置特殊日期的确认按钮
    settingFestivalOk: function() {
      if (!this.inputFestivalName) {
        this.$Message.error("节日名不能为空");
        return;
      }
      // 修改日期
      if (this.isModify) {
        var that = this;
        this.isModify = false;
        this.$set(this.inputTableData, [this.modifyIndex], {
          "festivalName": this.inputFestivalName,
          "btime": DateUtil.timeStampToDate(this.inputFestivalBtime),
          "etime": DateUtil.timeStampToDate(this.inputFestivalEtime),
          "id": this.inputTableData[this.modifyIndex].id
        });
        var args = {};
        args.id = this.inputTableData[this.modifyIndex].id;
        args.festivalName = this.inputFestivalName;
        args.beginDate = this.inputFestivalBtime.getTime();
        args.endDate = this.inputFestivalEtime.getTime();
        this.axios.get(this.seieiURL + "/factoryCalendar/updateFestival", {
          params: args
        }).then((response) => {
          if (response.data.status == 0) {
            that.$Message.success(response.data.msg);
          } else {
            that.$Message.error(response.data.msg);
            that.isInvaildSession(response.data.status);
          }
        }).catch((error) => {
          that.$Message.error({
            content: "服务器异常,请刷新！！",
            duration: 0,
            closable: true
          });
          console.log(error)
        });
      }
      // 新增日期
      else if (!this.isModify) {
        var that = this;
        var args = {};
        args.factoryCalendarId = this.idOfFactoryCalendar;
        args.festivalName = this.inputFestivalName;
        args.beginDate = this.inputFestivalBtime.getTime();
        args.endDate = this.inputFestivalEtime.getTime();
        this.axios.get(this.seieiURL + "/factoryCalendar/addFestival", {
          params: args
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.inputTableData, that.inputTableData.length, {
              "festivalName": that.inputFestivalName,
              "btime": DateUtil.timeStampToDate(that.inputFestivalBtime),
              "etime": DateUtil.timeStampToDate(that.inputFestivalEtime),
              "id": response.data.data
            });
            that.$Message.success(response.data.msg);
          } else {
            that.$Message.error(response.data.msg);
            that.isInvaildSession(response.data.status);
          }
        }).catch((error) => {
          that.$Message.error({
            content: "服务器异常,请刷新！！",
            duration: 0,
            closable: true
          });
          console.log(error)
        });
      }
    },
    // 点击设置特殊日期的取消按钮
    settingFestivalCancel: function() {
      this.isModify = false;
    },
    addFestival: function() {
      this.modelTitle = "增添节日";
      this.inputFestivalName = "";
      this.inputFestivalBtime = new Date();
      this.inputFestivalEtime = new Date();
      this.isShowSettingFestival = true;
    },
    // 提交修改主档信息
    submit: function() {
      if (!this.nowYear) {
        this.$Message.error("年度、开始时间及结束时间不能为空");
      } else {
        var that = this;
        var args = {};
        args.id = this.idOfFactoryCalendar;
        args.effectiveYear = (new Date(this.nowYear)).getFullYear();
        if (this.workDates.length == 0) {
          args.monday = false;
          args.tuesday = false;
          args.wednesday = false;
          args.thursday = false;
          args.friday = false;
          args.saturday = false;
          args.sunday = false;
        } else {
          this.workDates.forEach((item) => {
            args.monday = (args.monday || item == "1") ? true : false;
            args.tuesday = (args.tuesday || item == "2") ? true : false;
            args.wednesday = (args.wednesday || item == "3") ? true : false;
            args.thursday = (args.thursday || item == "4") ? true : false;
            args.friday = (args.friday || item == "5") ? true : false;
            args.saturday = (args.saturday || item == "6") ? true : false;
            args.sunday = (args.sunday || item == "7") ? true : false;
          });
        }
        this.isSubmitloading = true;
        this.axios.get(this.seieiURL + "/factoryCalendar/updateFactoryCalendar", {
          params: args
        }).then((response) => {
          this.isSubmitloading = false;
          if (response.data.status == 0) {
            that.$Message.success(response.data.msg);
            that.isShowSettingBlock = false;
            that.reloadMainTable();
          } else {
            that.$Message.error(response.data.msg);
            that.isInvaildSession(response.data.status);
          }
        }).catch((error) => {
          that.$Message.error({
            content: "服务器异常,请刷新！！",
            duration: 0,
            closable: true
          });
          console.log(error)
        });
      }
    },
    // 退出设置
    getOut: function() {
      this.inputTableData = [];
      this.isShowSettingBlock = false;
      this.reloadMainTable();
    },
    deleteSumTable: function(data, id) {
      this.isShowDeleteBlock = true;
      this.idOfFactoryCalendar = data.id;
    },
    deleteBlockOk: function() {
      var that = this;
      this.axios.get(this.seieiURL + "/factoryCalendar/deleteFactoryCalendar", {
        params: {
          id: this.idOfFactoryCalendar
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.$Message.success(response.data.msg);
          that.reloadMainTable();
        } else {
          that.$Message.error(response.data.msg);
          that.isInvaildSession(response.data.status);
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

    }
  }
}

</script>
<style scoped>
.headerDivider {
  font-size: 18px;
  font-weight: bold;
  color: #565656;
}

.factoryCalenderWrapper .inputBar {
  margin-top: 20px;
  font-size: 0;
}

.factoryCalenderWrapper .inputBar .title {
  display: inline-block;
  margin-left: 5px;
  line-height: 40px;
  font-size: 18px;
  vertical-align: top
}

.factoryCalenderWrapper .inputBar .inputWrapper {
  display: inline-block;
  margin-left: 5px;
  line-height: 35px;
  font-size: 12px;
  vertical-align: top;
}

.bottomBlock .addFestivalBlock {
  box-sizing: border-box;
  padding: 5px 30px 5px 0;
  text-align: right;
  border: 1px solid #ddd;
  border-top: none;
}

</style>
