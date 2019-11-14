<template>
  <div id="productionSetting-component">
    <div class="productionSettingWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
      <transition name="fade">
        <div v-show="!isShowSettingBlock">
          <div class="filterBar" style="margin-bottom: 10px;">
            <div class="title titleFirst">筛选组别：</div>
            <div class="inputWrapper">
              <Input v-model="filterGroup" style="width: 50px" @on-change="filterSumTableData" />
            </div>
            <div class="title">筛选车间：</div>
            <div class="inputWrapper">
              <Input v-model="filterWorkShop" style="width: 50px" @on-change="filterSumTableData" />
            </div>
            <div class="title">筛选生产线：</div>
            <div class="inputWrapper">
              <Input v-model="filterProductionLine" style="width: 50px" @on-change="filterSumTableData" />
            </div>
          </div>
          <Table height="450" :loading="sumTableLoading" border :columns="sumTableTitle" :data="sumTableDataForShow"></Table>
          <div style="margin-top: 30px;text-align:center;">
            <Button type="primary" @click="addSumTable">新 增 生 产 设 置</Button>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div v-show="isShowSettingBlock">
          <div class="topBlock">
            <Divider class="headerDivider">主 要 信 息</Divider>
            <div class="inputBar">
              <div class="title">
                组别：
              </div>
              <div class="inputWrapper">
                <Input v-model="inputWorkGroup" style="width: 100px" />
              </div>
              <div class="title">
                车间：
              </div>
              <div class="inputWrapper">
                <Input v-model="inputWorkShop" style="width: 100px" />
              </div>
              <div class="title">
                生产线：
              </div>
              <div class="inputWrapper">
                <Input v-model="inputLineCode" style="width: 100px" />
              </div>
              <div class="title">
                默认人数：
              </div>
              <div class="inputWrapper">
                <InputNumber :min="0" :step="1" v-model="inputPeopleNum" style="margin-left: 10px;width: 100px"></InputNumber>
              </div>
              <div class="title">
                默认工时：
              </div>
              <div class="inputWrapper">
                <InputNumber :min="0" :step="0.1" v-model="inputWorkHours" style="width: 100px"></InputNumber>
              </div>
              <div class="title">
                默认属性：
              </div>
              <div class="inputWrapper">
                <Select v-model="inputDefaultStyleName" style="margin-left: 7px;width: 100px">
                  <Option v-for="item in properityNameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
              </div>
            </div>
          </div>
          <div class="bottomBlock">
            <Divider class="headerDivider" style="font-weight:normal;">其 他 设 置</Divider>
            <Tabs type="card" value="a" name="productionSetting">
              <TabPane label="属性效率设置" name="a" tab="productionSetting">
                <Table height="300" border :columns="attributeTableTitle" :data="attributeTableData" :loading="inputTableLoading"></Table>
                <div class="addBlock">
                  <Button type="warning" @click="addAttributeTable" size="small">
                    新增属性效率
                  </Button>
                </div>
              </TabPane>
              <TabPane label="日期工时设置" name="b" tab="productionSetting">
                <Table height="300" border :columns="workTimeTableTitle" :data="workTimeTableData"></Table>
                <div class="addBlock">
                  <Button type="warning" @click="addWorkTimeTable" size="small">
                    新增日期工时设置
                  </Button>
                </div>
              </TabPane>
              <TabPane label="日期人数设置" name="c" tab="productionSetting">
                <Table height="300" border :columns="peopleNumTableTitle" :data="peopleNumTableData"></Table>
                <div class="addBlock">
                  <Button type="warning" @click="addPeopleNumTable" size="small">
                    新增日期人数设置
                  </Button>
                </div>
              </TabPane>
            </Tabs>
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
            <!-- 修改属性浮层 -->
            <Modal v-model="isShowSettingProperity" v-bind:title="settingProperityTitle" @on-ok="settingProperityOk" @on-cancel="settingProperityCancel" ok-text="确认" cancel-text="取消">
              <div>属性：
                <Select v-model="inputProperityName" style="margin-left: 7px;width: 100px">
                  <Option v-for="item in properityNameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
              </div>
              <div style="margin-top:20px;">效率：<InputNumber :min="0" :max="1" :step="0.01" v-model="inputProperityEfficiency" style="margin-left: 10px;width: 100px"></InputNumber>
              </div>
            </Modal>
            <!-- 修改工时浮层 -->
            <Modal v-model="isShowSettingWorkTime" v-bind:title="settingWorkTimeTitle" @on-ok="settingWorkTimeOk" @on-cancel="settingWorkTimeCancel" ok-text="确认" cancel-text="取消">
              <div>工时：<InputNumber :min="0" :step="0.1" v-model="settingWorkTime" style="margin-left: 10px;width: 100px"></InputNumber>
              </div>
              <div style="margin-top:20px;">开始日期：<DatePicker type="date" @on-change="changeSettingWorkTimeBtime" :value="settingWorkTimeBtime" placeholder="选择日期" style="margin-left: 10px;width: 200px" :clearable="false"></DatePicker>
              </div>
              <div style="margin-top:20px;">结束日期：<DatePicker type="date" @on-change="changeSettingWorkTimeEtime" :value="settingWorkTimeEtime" placeholder="选择日期" style="margin-left: 10px;width: 200px" :clearable="false"></DatePicker>
              </div>
            </Modal>
            <!-- 修改人数浮层 -->
            <Modal v-model="isShowSettingPeopleNum" v-bind:title="settingPeopleNumTitle" @on-ok="settingPeopleNumOk" @on-cancel="settingPeopleNumCancel" ok-text="确认" cancel-text="取消">
              <div>人数：<InputNumber :min="0" :step="1" v-model="settingPeopleNum" style="margin-left: 10px;width: 100px"></InputNumber>
              </div>
              <div style="margin-top:20px;">开始日期：<DatePicker type="date" @on-change="changeSettingPeopleNumBtime" :value="settingPeopleNumBtime" placeholder="选择日期" style="margin-left: 10px;width: 200px" :clearable="false"></DatePicker>
              </div>
              <div style="margin-top:20px;">结束日期：<DatePicker type="date" @on-change="changeSettingPeopleNumEtime" :value="settingPeopleNumEtime" placeholder="选择日期" style="margin-left: 10px;width: 200px" :clearable="false"></DatePicker>
              </div>
            </Modal>
            <!-- 新增生产线 -->
            <Modal v-model="isShowAddProductionLine" v-bind:title="addProductionLineTitle" @on-ok="addProductionLine" @on-cancel="addProductionLineCancel" ok-text="确认" cancel-text="取消">
              <div style="margin-left: 41px">组别：<Input v-model="inputWorkGroup" style="margin-left: 10px;width: 100px" />
              </div>
              <div style="margin-top:20px;margin-left: 41px">车间：<Input v-model="inputWorkShop" style="margin-left: 10px;width: 100px" />
              </div>
              <div style="margin-top:20px;margin-left: 28px;">生产线：<Input v-model="inputLineCode" style="margin-left: 10px;width: 100px" />
              </div>
              <div style="margin-top:20px;margin-left: 41px">人数：<InputNumber :min="0" :step="1" v-model="inputPeopleNum" style="margin-left: 10px;width: 100px"></InputNumber>
              </div>
              <div style="margin-top:20px;margin-left: 41px">工时：<InputNumber :min="0" :step="0.1" v-model="inputWorkHours" style="margin-left: 10px;width: 100px"></InputNumber>
              </div>
              <div style="margin-top:20px;margin-left: 12px">默认属性：
                <Select v-model="inputDefaultStyleName" style="margin-left: 7px;width: 100px">
                  <Option v-for="item in properityNameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
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
      sumTableLoading: false,
      isShowSettingBlock: false,
      sumTableTitle: [{
          title: '组别',
          key: 'workgroup',
          align: "center"
        },
        {
          title: '车间',
          key: 'workshop',
          align: "center"
        },
        {
          title: '生产线',
          key: 'lineCode',
          align: "center"
        },
        {
          title: '人数',
          key: 'peopleNum',
          align: "center"
        },
        {
          title: '工时',
          key: 'workhours',
          align: "center"
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
                    this.clickSumTable(params.index)
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
                    this.removeProductLine(params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      sumTableDataForShow: [], // 主档表格显示数据
      sumTableDataForResource: [], // 主档表格源数据
      filterGroup: "", // 主档筛选组别
      filterWorkShop: "", // 主档筛选生产车间
      filterProductionLine: "", // 主档筛选生产线
      inputProductionLineId: "", // 激活主档生产线 Id
      inputWorkGroup: "", // 主档输入组别
      inputWorkShop: "", // 主档输入车间
      inputLineCode: "", // 主档输入生产线
      inputWorkHours: 0, // 主档输入工时
      inputPeopleNum: 0, // 主档输入人数
      inputDefaultStyleName: "", // 主档输入默认属性

      // 属性效率表头
      attributeTableTitle: [{
          title: "属性",
          key: "styleName",
          align: "center"
        },
        {
          title: "效率",
          key: "efficiency",
          align: "center"
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
                    this.changeAttributeTable(params.index)
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
                    this.removeAttributeTable(params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      // 属性效率表数据
      attributeTableData: [],
      // 日期工时表头
      workTimeTableTitle: [{
          title: "开始日期",
          key: "startTime",
          align: "center"
        },
        {
          title: "结束日期",
          key: "endTime",
          align: "center"
        },
        {
          title: "工时",
          key: "workhours",
          align: "center"
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
                    this.changeWorkTimeTable(params.index)
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
                    this.removeWorkTimeTable(params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      // 日期工时表数据
      workTimeTableData: [],
      // 日期人数表头
      peopleNumTableTitle: [{
          title: "开始日期",
          key: "startTime",
          align: "center"
        },
        {
          title: "结束日期",
          key: "endTime",
          align: "center"
        },
        {
          title: "人数",
          key: "peopleNum",
          align: "center"
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
                    this.changePeopleNumTable(params.index)
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
                    this.removePeopleNumTable(params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      // 日期人数表数据
      peopleNumTableData: [],
      isSubmitloading: false, // 提交按钮loading动作
      isShowSettingProperity: false, // 是否显示修改属性的浮动层
      settingProperityTitle: "", // 修改属性的标题
      inputProperityName: "", // 修改属性的输入属性名称
      inputProperityEfficiency: 0, // 修改属性的浮动层的输入效率
      inputProperityId: "", // 修改属性的 id 值
      inputProperityIndex: 0, // 修改属性在数据表表中的 index 值
      isShowSettingWorkTime: false, // 是否显示修改工时的浮动层
      settingWorkTimeTitle: "", // 修改工时的浮动层的标题
      settingWorkTime: 0, // 修改工时的输入工时
      settingWorkTimeId: "", // 修改工时的 Id 值
      settingWorkTimeBtime: new Date(), // 修改工时的开始时间
      settingWorkTimeEtime: new Date(), // 修改工时的结束时间
      settingWorkTimeIndex: 0, // 修改工时在数据表表中的 index 值
      isShowSettingPeopleNum: false, // 是否显示修改人数的浮动层
      settingPeopleNumTitle: "", // 修改人数的标题
      settingPeopleNum: 0, // 修改人数的输入人数
      settingPeopleNumBtime: new Date(), // 修改人数的开始时间
      settingPeopleNumEtime: new Date(), // 修改人数的结束时间
      settingPeopleNumIndex: 0, // 修改人数在数据表表中的 index 值
      settingPeopleNumId: "", // 修改人数的 Id 值
      inputTableLoading: false, // loading
      isShowAddProductionLine: false, // 显示增加生产线窗口
      addProductionLineTitle: "新增生产线", // 增加生产线窗口名称
    }
  },
  methods: {
    // 刷新主档表格数据
    reloadMainTable: function() {
      var that = this;
      this.sumTableDataForResource = [];
      this.sumTableDataForShow = [];
      this.sumTableLoading = true;
      this.axios.get(this.seieiURL + '/productionline/getall').then((response) => {
        if (response.data.status) {
          that.$Message.error(response.data.msg);
          that.isInvaildSession(response.data.status);
          return;
        }
        response.data.data.forEach((item) => {
          var listItem = {};
          listItem.workgroup = item.workgroup;
          listItem.workshop = item.workshop
          listItem.lineCode = item.lineCode
          listItem.productionLine = item.line;
          listItem.workhours = item.workhours;
          listItem.peopleNum = item.peopleNum;
          listItem.id = item.id;
          listItem.defaultStyleName = item.defaultStyleName;
          that.sumTableDataForResource.push(listItem);
          that.sumTableDataForShow.push(listItem);
        });
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
    // 修改过滤条件
    filterSumTableData: function() {
      // 复制数组
      this.sumTableDataForShow = this.sumTableDataForResource.slice(0, this.sumTableDataForResource.length);
      // 修改组别
      if (this.filterGroup) {
        this.sumTableDataForShow = this.sumTableDataForShow.filter((item) => {
          return (item.workgroup == this.filterGroup);
        });
      }
      // 修改生产车间
      if (this.filterWorkShop) {
        this.sumTableDataForShow = this.sumTableDataForShow.filter((item) => {
          return (item.workshop == this.filterWorkShop);
        });
      }
      // 修改生产线
      if (this.filterProductionLine) {
        this.sumTableDataForShow = this.sumTableDataForShow.filter((item) => {
          return (item.lineCode == this.filterProductionLine);
        });
      }
    },
    // 点击主档表格
    clickSumTable: function(index) {
      var data = this.sumTableDataForShow[index];
      this.isShowSettingBlock = true;
      this.inputWorkGroup = data.workgroup;
      this.inputWorkShop = data.workshop;
      this.inputLineCode = data.lineCode;
      this.inputProductionLineId = data.id;
      this.inputPeopleNum = data.peopleNum;
      this.inputWorkHours = data.workhours;
      this.inputDefaultStyleName = data.defaultStyleName;
      this.inputTableLoading = true;
      var that = this;
      this.axios.get(this.seieiURL + "/productionline/getdetailbylineid", {
        params: {
          lineid: this.inputProductionLineId
        }
      }).then((response) => {
        if (response.data.status) {
          that.$Message.error(response.data.msg);
          that.isInvaildSession(response.data.status);
          return;
        }
        that.attributeTableData = response.data.data.efficiencyOfLineList;
        response.data.data.workhoursOfLineList.forEach((item) => {
          item.endTime = DateUtil.timeStampToDate(new Date(item.endTime));
          item.startTime = DateUtil.timeStampToDate(new Date(item.startTime));
        });
        that.workTimeTableData = response.data.data.workhoursOfLineList;
        response.data.data.peopleNumOfLineList.forEach((item) => {
          item.endTime = DateUtil.timeStampToDate(new Date(item.endTime));
          item.startTime = DateUtil.timeStampToDate(new Date(item.startTime));
        });
        that.peopleNumTableData = response.data.data.peopleNumOfLineList;
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
    // 删除主档信息
    removeProductLine: function(index) {
      var that = this;
      this.axios.get(this.seieiURL + "/productionline/delete", {
        params: {
          id: this.sumTableDataForShow[index].id
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.$Message.success(response.data.msg);
          that.reloadMainTable();
          that.filterSumTableData();
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
    // 点击新增主档信息按钮
    addSumTable: function() {
      this.isShowAddProductionLine = true;
      this.inputWorkGroup = "";
      this.inputWorkShop = "";
      this.inputLineCode = "";
      this.inputWorkHours = 0;
      this.inputPeopleNum = 0;
      this.inputDefaultStyleName = "";
    },
    // 点击属性从表中的修改按钮
    changeAttributeTable: function(index) {
      this.settingProperityTitle = "修改属性效率";
      this.inputProperityName = this.attributeTableData[index].styleName;
      this.inputProperityEfficiency = this.attributeTableData[index].efficiency;
      this.inputProperityId = this.attributeTableData[index].id;
      this.inputProperityIndex = index;
      this.isShowSettingProperity = true;
    },
    // 点击属性从表中的删除按钮
    removeAttributeTable: function(index) {
      var that = this;
      this.axios.get(this.seieiURL + '/productionline/deleteEfficiency', {
        params: {
          id: this.attributeTableData[index].id
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.attributeTableData.splice(index, 1);
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
    // 点击属性从表中的增加按钮
    addAttributeTable: function() {
      this.settingProperityTitle = "新增属性效率";
      this.inputProperityName = "";
      this.inputProperityEfficiency = 0;
      this.isShowSettingProperity = true;
    },
    // 点击属性浮动层的确定按钮
    settingProperityOk: function() {
      if (!this.inputProperityName) {
        this.$Message.error("属性值不能为空");
        return;
      }
      var that = this;
      if (this.settingProperityTitle == "修改属性效率") {
        this.axios.get(this.seieiURL + "/productionline/updateEfficiency", {
          params: {
            id: this.inputProperityId,
            styleName: this.inputProperityName,
            efficiency: this.inputProperityEfficiency
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.attributeTableData, [that.inputProperityIndex], {
              "styleName": that.inputProperityName,
              "efficiency": that.inputProperityEfficiency,
              "id": that.inputProperityId
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
      } else {
        this.axios.get(this.seieiURL + "/productionline/addEfficiency", {
          params: {
            productionLineId: this.inputProductionLineId,
            styleName: this.inputProperityName,
            efficiency: this.inputProperityEfficiency
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.attributeTableData, that.attributeTableData.length, {
              "styleName": this.inputProperityName,
              "efficiency": this.inputProperityEfficiency,
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
    // 点击属性浮动层的取消按钮
    settingProperityCancel: function() {
      this.isShowSettingProperity = false;
    },
    // 点击工时从表中的修改按钮
    changeWorkTimeTable: function(index) {
      this.settingWorkTimeTitle = "修改工时";
      this.settingWorkTimeBtime = new Date(this.workTimeTableData[index].startTime);
      this.settingWorkTimeEtime = new Date(this.workTimeTableData[index].endTime);
      this.settingWorkTime = this.workTimeTableData[index].workhours;
      this.settingWorkTimeId = this.workTimeTableData[index].id;
      this.settingWorkTimeIndex = index;
      this.isShowSettingWorkTime = true;
    },
    // 点击工时从表中的删除按钮
    removeWorkTimeTable: function(index) {
      var that = this;
      this.axios.get(this.seieiURL + '/productionline/deleteWorkhours', {
        params: {
          id: this.workTimeTableData[index].id
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.workTimeTableData.splice(index, 1);
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
    // 点击工时从表中的增加按钮
    addWorkTimeTable: function() {
      this.settingWorkTimeTitle = "增加日期工时";
      this.settingWorkTime = 0;
      this.settingWorkTimeEtime = new Date();
      this.settingWorkTimeBtime = new Date();
      this.isShowSettingWorkTime = true;
    },
    // 修改工时浮动层的开始时间
    changeSettingWorkTimeBtime: function(date) {
      this.settingWorkTimeBtime = new Date(date);
    },
    // 修改工时浮动层的结束时间
    changeSettingWorkTimeEtime: function(date) {
      this.settingWorkTimeEtime = new Date(date);
    },
    // 点击工时浮动层的确定按钮
    settingWorkTimeOk: function() {
      var that = this;
      if (that.settingWorkTimeBtime.getTime() > that.settingWorkTimeEtime.getTime()) {
        that.$Message.error("起始时间不能比结束时间后");
        return;
      }
      if (this.settingWorkTimeTitle == "修改工时") {
        this.axios.get(this.seieiURL + '/productionline/updateWorkhours', {
          params: {
            id: this.settingWorkTimeId,
            startTime: that.settingWorkTimeBtime.getTime(),
            endTime: that.settingWorkTimeEtime.getTime(),
            workhours: this.settingWorkTime
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.workTimeTableData, [that.settingWorkTimeIndex], {
              id: that.settingWorkTimeId,
              startTime: DateUtil.timeStampToDate(that.settingWorkTimeBtime),
              endTime: DateUtil.timeStampToDate(that.settingWorkTimeEtime),
              workhours: that.settingWorkTime
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
      } else {
        this.axios.get(this.seieiURL + "/productionline/addWorkhours", {
          params: {
            startTime: this.settingWorkTimeBtime.getTime(),
            endTime: this.settingWorkTimeEtime.getTime(),
            workhours: this.settingWorkTime,
            productionLineId: this.inputProductionLineId
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.workTimeTableData, that.workTimeTableData.length, {
              startTime: DateUtil.timeStampToDate(this.settingWorkTimeBtime),
              endTime: DateUtil.timeStampToDate(this.settingWorkTimeEtime),
              workhours: this.settingWorkTime,
              id: response.data.data
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
    // 点击工时浮动层的取消按钮
    settingWorkTimeCancel: function() {
      this.isShowSettingWorkTime = false;
    },
    // 点击人数从表的修改按钮
    changePeopleNumTable: function(index) {
      this.settingPeopleNumTitle = "修改人数";
      this.settingPeopleNumBtime = new Date(this.peopleNumTableData[index].startTime);
      this.settingPeopleNumEtime = new Date(this.peopleNumTableData[index].endTime);
      this.settingPeopleNum = this.peopleNumTableData[index].peopleNum;
      this.settingPeopleNumId = this.peopleNumTableData[index].id;
      this.settingPeopleNumIndex = index;
      this.isShowSettingPeopleNum = true;
    },
    // 点击人数从表的删除按钮
    removePeopleNumTable: function(index) {
      var that = this;
      this.axios.get(this.seieiURL + '/productionline/deletePeopleNum', {
        params: {
          id: this.peopleNumTableData[index].id
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.peopleNumTableData.splice(index, 1);
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
    // 点击人数从表的增加按钮
    addPeopleNumTable: function() {
      this.settingPeopleNumTitle = "增加日期人数";
      this.settingPeopleNum = 0;
      this.settingPeopleNumEtime = new Date();
      this.settingPeopleNumBtime = new Date();
      this.isShowSettingPeopleNum = true;
    },
    // 点击人数浮动层的确认按钮
    settingPeopleNumOk: function() {
      var that = this;
      if (that.settingPeopleNumBtime.getTime() > that.settingPeopleNumEtime.getTime()) {
        that.$Message.error("起始时间不能比结束时间后");
        return;
      }
      if (this.settingPeopleNumTitle == "修改人数") {
        this.axios.get(this.seieiURL + '/productionline/updatePeopleNum', {
          params: {
            id: this.settingPeopleNumId,
            startTime: this.settingPeopleNumBtime.getTime(),
            endTime: this.settingPeopleNumEtime.getTime(),
            peopleNum: this.settingPeopleNum
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.peopleNumTableData, [that.settingPeopleNumIndex], {
              id: that.settingPeopleNumId,
              startTime: DateUtil.timeStampToDate(that.settingPeopleNumBtime),
              endTime: DateUtil.timeStampToDate(that.settingPeopleNumEtime),
              peopleNum: that.settingPeopleNum
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
      } else {
        this.axios(this.seieiURL + "/productionline/addPeopleNum", {
          params: {
            productionLineId: this.inputProductionLineId,
            startTime: this.settingPeopleNumBtime.getTime(),
            endTime: this.settingPeopleNumEtime.getTime(),
            peopleNum: this.settingPeopleNum
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.peopleNumTableData, that.peopleNumTableData.length, {
              startTime: DateUtil.timeStampToDate(that.settingPeopleNumBtime),
              endTime: DateUtil.timeStampToDate(that.settingPeopleNumEtime),
              peopleNum: that.settingPeopleNum,
              id: response.data.data
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
    // 点击人数浮动层的取消按钮
    settingPeopleNumCancel: function() {
      this.isShowSettingPeopleNum = false;
    },
    // 修改人数浮动层的开始时间
    changeSettingPeopleNumBtime: function(date) {
      this.settingPeopleNumBtime = new Date(date);
    },
    // 修改人数浮动层的结束时间
    changeSettingPeopleNumEtime: function(date) {
      this.settingPeopleNumEtime = new Date(date);
    },
    // 点击提交主档按钮
    submit: function() {
      if (!this.inputWorkGroup || !this.inputWorkShop || !this.inputLineCode || !this.inputDefaultStyleName) {
        this.$Message.error("组别、车间、生产线及默认属性不能为空");
      } else {
        this.isSubmitloading = true;
        var that = this;
        // 更新生产线
        this.axios.get(this.seieiURL + "/productionline/update", {
          params: {
            id: this.inputProductionLineId,
            workgroup: this.inputWorkGroup,
            workshop: this.inputWorkShop,
            lineCode: this.inputLineCode,
            workhours: this.inputWorkHours,
            peopleNum: this.inputPeopleNum,
            defaultStyleName: this.inputDefaultStyleName
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$Message.success(response.data.msg);
            that.isSubmitloading = false;
          } else {
            that.$Message.error(response.data.msg);
            that.isSubmitloading = false;
            that.isInvaildSession(response.data.status);
          }
        }).catch((error) => {
          that.$Message.error({
            content: "服务器异常,请刷新！！",
            duration: 0,
            closable: true
          });
          that.isSubmitloading = false;
          console.log(error)
        });
      }
    },
    // 点击主档返回按钮
    getOut: function() {
      this.isShowSettingBlock = false;
      this.reloadMainTable();
      this.peopleNumTableData = [];
      this.workTimeTableData = [];
      this.attributeTableData = [];
      this.inputWorkGroup = "";
      this.inputWorkShop = "";
      this.inputLineCode = "";
    },
    // 确定添加生产线
    addProductionLine: function() {
      var that = this;
      this.axios.get(this.seieiURL + "/productionline/add", {
        params: {
          workgroup: this.inputWorkGroup,
          workshop: this.inputWorkShop,
          lineCode: this.inputLineCode,
          peopleNum: this.inputPeopleNum,
          workhours: this.inputWorkHours,
          defaultStyleName: this.inputDefaultStyleName
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.isShowAddProductionLine = false;
          that.inputProductionLineId = response.data.data;
          that.isShowSettingBlock = true;
          that.attributeTableData = [];
          that.workTimeTableData = [];
          that.peopleNumTableData = [];
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
    // 添加生产线窗口退出按钮 
    addProductionLineCancel: function() {
      this.isShowAddProductionLine = false;
      this.inputWorkGroup = "";
      this.inputWorkShop = "";
      this.inputLineCode = "";
    }
  },
  created: function() {
    var that = this;
    // 页面初始化设置高度
    this.$nextTick(() => {
      this.$refs["rightBlockTabpaneWrapper"].style.height = this.windowHeight - 40 - 49 + "px"
    });
    this.reloadMainTable();
    this.axios.get(this.seieiURL + "/productstyle/getall").then((response) => {
      if (response.data.status) {
        that.$Message.error(response.data.msg);
        that.isInvaildSession(response.data.status);
        return;
      }
      that.properityNameList = response.data.data;
    }).catch((error) => {
      that.$Message.error({
        content: "服务器异常,请刷新！！",
        duration: 0,
        closable: true
      });
      console.log(error)
    });
  }
}

</script>
<style scoped>
.productionSettingWrapper .filterBar,
.productionSettingWrapper .inputBar {
  margin-top: 20px;
  font-size: 0;
}

.productionSettingWrapper .filterBar .title,
.productionSettingWrapper .inputBar .title {
  display: inline-block;
  margin-left: 15px;
  line-height: 40px;
  font-size: 18px;
  vertical-align: top;
}

.productionSettingWrapper .filterBar .titleFirst,
.productionSettingWrapper .inputBar .titleFirst {
  margin-left: 5px;
}

.productionSettingWrapper .filterBar .inputWrapper,
.productionSettingWrapper .inputBar .inputWrapper {
  display: inline-block;
  margin-left: 5px;
  line-height: 35px;
  font-size: 12px;
  vertical-align: top;
}

.bottomBlock .addBlock {
  box-sizing: border-box;
  padding: 5px 30px 5px 0;
  text-align: right;
  border: 1px solid #ddd;
  border-top: none;
}

</style>
