<template>
  <div id="productionSetting-component">
    <div class="productionSettingWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
      <transition name="fade">
        <div v-show="!isShowSettingBlock">
          <!--           <div class="filterBar">
            <div class="title titleFirst">开始时间：</div>
            <div class="inputWrapper">
              <DatePicker type="date" @on-change="changeFilterBtime" :value="filterBtime" placeholder="选择日期" style="margin-left: 10px;width: 200px" :clearable="false"></DatePicker>
            </div>
            <div class="title">结束时间：</div>
            <div class="inputWrapper">
              <DatePicker type="date" @on-change="changeFilterEtime" :value="filterEtime" placeholder="选择日期" style="margin-left: 10px;width: 200px" :clearable="false"></DatePicker>
            </div>
          </div> -->
          <div class="filterBar" style="margin-bottom: 10px;">
            <div class="title titleFirst">筛选组别：</div>
            <div class="inputWrapper">
              <Input v-model="filterGroup" style="width: 50px" @on-change="filterSumTableData"></Input>
            </div>
            <div class="title">筛选车间：</div>
            <div class="inputWrapper">
              <Input v-model="filterWorkShop" style="width: 50px" @on-change="filterSumTableData"></Input>
            </div>
            <div class="title">筛选生产线：</div>
            <div class="inputWrapper">
              <Input v-model="filterProductionLine" style="width: 50px" @on-change="filterSumTableData"></Input>
            </div>
            <div class="title">筛选属性：</div>
            <div class="inputWrapper">
              <Input v-model="filterAttribute" style="width: 50px" @on-change="filterSumTableData"></Input>
            </div>
          </div>
          <Table height="450" :loading="sumTableLoading" border :columns="sumTableTitle" :data="sumTableDataForShow" @on-row-dblclick="clickSumTable"></Table>
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
                <Input v-model="inputGroup" style="width: 100px"></Input>
              </div>
              <div class="title">
                车间：
              </div>
              <div class="inputWrapper">
                <Input v-model="inputWorkShop" style="width: 100px"></Input>
              </div>
              <div class="title">
                生产线：
              </div>
              <div class="inputWrapper">
                <Input v-model="inputProductLine" style="width: 100px"></Input>
              </div>
            </div>
            <div class="inputBar">
              <div class="title">
                人数：
              </div>
              <div class="inputWrapper">
                <InputNumber :min="0" v-model="inputPeopleNum" style="width: 100px"></InputNumber>
              </div>
              <div class="title">
                工时：
              </div>
              <div class="inputWrapper">
                <InputNumber :min="0" v-model="inputWorkTime" style="width: 100px"></InputNumber>
              </div>
              <div class="title">
                &nbsp;&nbsp;&nbsp;&nbsp;属性：
              </div>
              <div class="inputWrapper">
                <Input v-model="inputAttribute" style="width: 100px"></Input>
              </div>
              <div class="title">
                隐藏：
              </div>
              <div class="inputWrapper">
                <Checkbox v-model="inputHidden"></Checkbox>
              </div>
            </div>
          </div>
          <div class="bottomBlock">
            <Divider class="headerDivider" style="font-weight:normal;">特 殊 日 期 设 置</Divider>
            <Tabs type="card">
              <TabPane label="属性效率设置">
                <Table height="300" border :columns="attributeTableTitle" :data="attributeTableData" :loading="inputTableLoading"></Table>
                <div class="addBlock">
                  <Button type="warning" @click="addAttributeTable" size="small">
                    新增属性效率
                  </Button>
                </div>
              </TabPane>
              <TabPane label="日期工时设置">
                <Table height="300" border :columns="workTimeTableTitle" :data="workTimeTableData"></Table>
                <div class="addBlock">
                  <Button type="warning" @click="addWorkTimeTable" size="small">
                    新增日期工时设置
                  </Button>
                </div>
              </TabPane>
              <TabPane label="日期人数设置">
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
              <div>属性：<Input v-model="inputProperityName" placeholder="输入属性名称" style="margin-left: 10px;width:100px" /></div>
              <div style="margin-top:20px;">效率：<InputNumber :min="0" :max="1" :step="0.1" v-model="inputProperityEfficiency" style="margin-left: 10px;width: 100px"></InputNumber>
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
            <Modal v-model="isShowSettingNumberofwork" v-bind:title="settingNumberofworkTitle" @on-ok="settingNumberofworkOk" @on-cancel="settingNumberofworkCancel" ok-text="确认" cancel-text="取消">
              <div>人数：<InputNumber :min="0" :step="1" v-model="settingNumberofwork" style="margin-left: 10px;width: 100px"></InputNumber>
              </div>
              <div style="margin-top:20px;">开始日期：<DatePicker type="date" @on-change="changeSettingNumberofworkBtime" :value="settingNumberofworkBtime" placeholder="选择日期" style="margin-left: 10px;width: 200px" :clearable="false"></DatePicker>
              </div>
              <div style="margin-top:20px;">结束日期：<DatePicker type="date" @on-change="changeSettingNumberofworkEtime" :value="settingNumberofworkEtime" placeholder="选择日期" style="margin-left: 10px;width: 200px" :clearable="false"></DatePicker>
              </div>
            </Modal>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      sumTableLoading: false,
      isShowSettingBlock: false,
      sumTableTitle: [{
          title: '组别',
          key: 'group',
          align: "center"
        },
        {
          title: '车间',
          key: 'workShop',
          align: "center"
        },
        {
          title: '生产线',
          key: 'productionLine',
          align: "center"
        },
        {
          title: '人数',
          key: 'peopleNum',
          align: "center"
        },
        {
          title: '工时',
          key: 'workTime',
          align: "center"
        },
        {
          title: '属性',
          key: 'attribute',
          align: "center"
        }
      ],
      sumTableDataForShow: [], // 主档表格显示数据
      sumTableDataForResource: [], // 主档表格源数据
      filterBtime: "", // 主档筛选开始时间
      filterEtime: "", // 主档筛选结束时间
      filterGroup: "", // 主档筛选组别
      filterWorkShop: "", // 主档筛选生产车间
      filterProductionLine: "", // 主档筛选生产线
      filterAttribute: "", // 主档筛选属性
      serialno: "",
      inputGroup: "", // 主档输入组别
      inputWorkShop: "", // 主档输入组别
      inputProductLine: "", // 主档输入组别
      inputPeopleNum: 0, // 主档输入人数
      inputWorkTime: 0, // 主档输入工时
      inputAttribute: "", // 主档输入属性
      inputHidden: false, // 主档输入隐藏
      // 属性效率表头
      attributeTableTitle: [{
          title: "属性",
          key: "styleattribute",
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
          key: "bdate",
          align: "center"
        },
        {
          title: "结束日期",
          key: "edate",
          align: "center"
        },
        {
          title: "工时",
          key: "workinghours",
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
          key: "bdate",
          align: "center"
        },
        {
          title: "结束日期",
          key: "edate",
          align: "center"
        },
        {
          title: "人数",
          key: "numberofwork",
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
      inputProperityGuid: "", // 修改属性的 guid 值
      inputProperityIndex: 0, // 修改属性在数据表表中的 index 值
      isShowSettingWorkTime: false, // 是否显示修改工时的浮动层
      settingWorkTimeTitle: "", // 修改工时的浮动层的标题
      settingWorkTime: 0, // 修改工时的输入工时
      settingWorkTimeGuid: "", // 修改工时的 guid 值
      settingWorkTimeBtime: new Date(), // 修改工时的开始时间
      settingWorkTimeEtime: new Date(), // 修改工时的结束时间
      settingWorkTimeIndex: 0, // 修改工时在数据表表中的 index 值
      isShowSettingNumberofwork: false, // 是否显示修改人数的浮动层
      settingNumberofworkTitle: "", // 修改人数的标题
      settingNumberofwork: 0, // 修改人数的输入人数
      settingNumberofworkBtime: new Date(), // 修改人数的开始时间
      settingNumberofworkEtime: new Date(), // 修改人数的结束时间
      settingNumberofworkIndex: 0, // 修改人数在数据表表中的 index 值
      settingNumberofworkGuid: "", // 修改人数的 guid 值
      isAddMainTable: false, // 是否新增主档信息
      inputTableLoading: false
    }
  },
  methods: {
    // 刷新主档表格数据
    reloadMainTable: function() {
      var that = this;
      this.sumTableLoading = true;
      this.axios.get(this.seieiURL + '/plandategroup/getMainTable').then((response) => {
        var list = [];
        response.data.forEach((item) => {
          var listItem = {};
          listItem.group = item.bnsgroup;
          listItem.workShop = item.workshop
          listItem.workTime = item.workinghours
          listItem.productionLine = item.line;
          listItem.peopleNum = item.numberofwork;
          listItem.attribute = item.trait;
          listItem.btime = item.btime;
          listItem.etime = item.etime;
          listItem.hided = item.hided;
          listItem.serialno = item.serialno;
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
    // 修改筛选开始时间
    changeFilterBtime: function(date) {
      this.filterBtime = new Date(date);
      this.filterSumTableData();
    },
    // 修改筛选结束时间
    changeFilterEtime: function(date) {
      this.filterBtime = new Date(date);
      this.filterSumTableData();
    },
    // 修改过滤条件
    filterSumTableData: function() {
      // 复制数组
      this.sumTableDataForShow = this.sumTableDataForResource.slice(0, this.sumTableDataForResource.length);
      // 修改开始时间
      if (this.filterBtime) {
        this.sumTableDataForShow = this.sumTableDataForShow.filter((item) => {
          return (item.btime > this.filterBtime.getTime());
        });
      }
      // 修改结束时间
      if (this.filterEtime) {
        this.sumTableDataForShow = this.sumTableDataForShow.filter((item) => {
          return (item.etime < this.filterEtime.getTime());
        });
      }
      // 修改组别
      if (this.filterGroup) {
        this.sumTableDataForShow = this.sumTableDataForShow.filter((item) => {
          return (item.group == this.filterGroup);
        });
      }
      // 修改生产车间
      if (this.filterWorkShop) {
        this.sumTableDataForShow = this.sumTableDataForShow.filter((item) => {
          return (item.workShop == this.filterWorkShop);
        });
      }
      // 修改生产线
      if (this.filterProductionLine) {
        this.sumTableDataForShow = this.sumTableDataForShow.filter((item) => {
          return (item.productionLine == this.filterProductionLine);
        });
      }
      // 修改生产属性
      if (this.filterAttribute) {
        this.sumTableDataForShow = this.sumTableDataForShow.filter((item) => {
          return (item.attribute == this.filterAttribute);
        });
      }
    },
    // 点击主档表格
    clickSumTable: function(data, index) {
      this.isAddMainTable = false;
      this.isShowSettingBlock = true;
      this.inputGroup = data.group;
      this.inputWorkShop = data.workShop;
      this.inputProductLine = data.productionLine;
      this.inputPeopleNum = data.inputPeopleNum;
      this.serialno = data.serialno;
      this.inputAttribute = data.attribute;
      this.inputWorkTime = data.workTime;
      this.inputHidden = data.hided == 0 ? false : true;
      this.inputTableLoading = true;
      var that = this;
      this.axios({
        method: 'post',
        url: this.seieiURL + "/plandategroup/getSettingTable",
        params: {
          serialno: this.serialno
        }
      }).then((response) => {
        that.attributeTableData = response.data.data.lineProperties;
        response.data.data.lineWorkinghours.sort((f, s) => {
          return Number(f.bdate) - Number(s.bdate);
        });
        response.data.data.lineWorkinghours.forEach((item) => {
          item.edate = timeStampToString(new Date(item.edate));
          item.bdate = timeStampToString(new Date(item.bdate));
        });
        that.workTimeTableData = response.data.data.lineWorkinghours;
        response.data.data.numberofwork.sort((f, s) => {
          return Number(f.bdate) - Number(s.bdate);
        });
        response.data.data.numberofwork.forEach((item) => {
          item.edate = timeStampToString(new Date(item.edate));
          item.bdate = timeStampToString(new Date(item.bdate));
        });
        that.peopleNumTableData = response.data.data.numberofwork;
        that.inputTableLoading = false;
      })
    },
    // 点击新增主档信息按钮
    addSumTable: function() {
      var that = this;
      this.axios.get(this.seieiURL + '/plandategroup/deleteLineProperties').then((response) => {
        that.serialno = response.data.data;
        that.isShowSettingBlock = true;
        that.isAddMainTable = true;
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
    // 点击属性从表中的修改按钮
    changeAttributeTable: function(index) {
      this.settingProperityTitle = "修改属性效率";
      this.inputProperityName = this.attributeTableData[index].styleattribute;
      this.inputProperityEfficiency = this.attributeTableData[index].efficiency;
      this.inputProperityGuid = this.attributeTableData[index].guid;
      this.inputProperityIndex = index;
      this.isShowSettingProperity = true;
    },
    // 点击属性从表中的删除按钮
    removeAttributeTable: function(index) {
      var that = this;
      this.axios.get(this.seieiURL + '/plandategroup/deleteLineProperties', {
        params: {
          guid: this.attributeTableData[index].guid
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.attributeTableData.splice(index, 1);
          that.$Message.success(response.data.msg);
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
        this.$set(this.attributeTableData, [this.inputProperityIndex], {
          "styleattribute": this.inputProperityName,
          "efficiency": this.inputProperityEfficiency
        });
        this.axios({
          method: 'post',
          url: this.seieiURL + "/plandategroup/updateLineProperties",
          params: {
            guid: this.inputProperityGuid,
            propertyName: this.inputProperityName,
            efficiency: this.inputProperityEfficiency
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$Message.success(response.data.msg);
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
      } else {
        this.axios({
          method: 'post',
          url: this.seieiURL + "/plandategroup/insertLineProperties",
          params: {
            serialno: this.serialno,
            styleattribute: this.inputProperityName,
            efficiency: this.inputProperityEfficiency
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.attributeTableData, that.attributeTableData.length, {
              propertyName: this.inputProperityName,
              efficiency: this.inputProperityEfficiency,
              guid: response.data.data
            });
            that.$Message.success(response.data.msg);
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
      }
    },
    // 点击属性浮动层的取消按钮
    settingProperityCancel: function() {
      this.isShowSettingProperity = false;
    },
    // 点击工时从表中的修改按钮
    changeWorkTimeTable: function(index) {
      this.settingWorkTimeTitle = "修改工时";
      this.settingWorkTimeBtime = new Date(this.workTimeTableData[index].bdate);
      this.settingWorkTimeEtime = new Date(this.workTimeTableData[index].edate);
      this.settingWorkTime = this.workTimeTableData[index].workinghours;
      this.settingWorkTimeGuid = this.workTimeTableData[index].guid;
      this.settingWorkTimeIndex = index;
      this.isShowSettingWorkTime = true;
    },
    // 点击工时从表中的删除按钮
    removeWorkTimeTable: function(index) {
      var that = this;
      this.axios.get(this.seieiURL + '/plandategroup/deleteWorkingTime', {
        params: {
          guid: this.workTimeTableData[index].guid
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.workTimeTableData.splice(index, 1);
          that.$Message.success(response.data.msg);
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
      if (this.settingWorkTimeTitle == "修改工时") {
        this.$set(this.workTimeTableData, [this.settingWorkTimeIndex], {
          bdate: timeStampToString(this.settingWorkTimeBtime),
          edate: timeStampToString(this.settingWorkTimeEtime),
          workinghours: this.settingWorkTime
        });
        this.axios.get(this.seieiURL + '/plandategroup/updateWorkingTime', {
          params: {
            guid: this.settingWorkTimeGuid,
            bdate: this.settingWorkTimeBtime.getTime(),
            edate: this.settingWorkTimeEtime.getTime(),
            workinghours: this.settingWorkTime
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$Message.success(response.data.msg);
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
      } else {
        this.axios({
          method: 'post',
          url: this.seieiURL + "/plandategroup/insertWorkingTime",
          params: {
            serialno: this.serialno,
            bdate: this.settingWorkTimeBtime.getTime(),
            edate: this.settingWorkTimeEtime.getTime(),
            workinghours: this.settingWorkTime
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.workTimeTableData, that.workTimeTableData.length, {
              bdate: timeStampToString(this.settingWorkTimeBtime),
              edate: timeStampToString(this.settingWorkTimeEtime),
              workinghours: this.settingWorkTime,
              guid: response.data.data
            });
            that.$Message.success(response.data.msg);
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
      }
    },
    // 点击工时浮动层的取消按钮
    settingWorkTimeCancel: function() {
      this.isShowSettingWorkTime = false;
    },
    // 点击人数从表的修改按钮
    changePeopleNumTable: function(index) {
      this.settingNumberofworkTitle = "修改人数";
      this.settingNumberofworkBtime = new Date(this.peopleNumTableData[index].bdate);
      this.settingNumberofworkEtime = new Date(this.peopleNumTableData[index].edate);
      this.settingNumberofwork = this.peopleNumTableData[index].numberofwork;
      this.settingNumberofworkGuid = this.peopleNumTableData[index].guid;
      this.settingNumberofworkIndex = index;
      this.isShowSettingNumberofwork = true;
    },
    // 点击人数从表的删除按钮
    removePeopleNumTable: function(index) {
      var that = this;
      this.axios.get(this.seieiURL + '/plandategroup/deleteNumberofwork', {
        params: {
          guid: this.peopleNumTableData[index].guid
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.peopleNumTableData.splice(index, 1);
          that.$Message.success(response.data.msg);
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
    // 点击人数从表的增加按钮
    addPeopleNumTable: function() {
      this.settingNumberofworkTitle = "增加日期人数";
      this.settingNumberofwork = 0;
      this.settingNumberofworkEtime = new Date();
      this.settingNumberofworkBtime = new Date();
      this.isShowSettingNumberofwork = true;
    },
    // 点击人数浮动层的确认按钮
    settingNumberofworkOk: function() {
      var that = this;
      if (this.settingNumberofworkTitle == "修改人数") {
        this.$set(this.peopleNumTableData, [this.settingNumberofworkIndex], {
          bdate: timeStampToString(this.settingNumberofworkBtime),
          edate: timeStampToString(this.settingNumberofworkEtime),
          numberofwork: this.settingNumberofwork
        });
        this.axios.get(this.seieiURL + '/plandategroup/updateNumberofwork', {
          params: {
            guid: this.settingNumberofworkGuid,
            bdate: this.settingNumberofworkBtime.getTime(),
            edate: this.settingNumberofworkEtime.getTime(),
            numberofwork: this.settingNumberofwork
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$Message.success(response.data.msg);
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
      } else {
        this.axios({
          method: 'post',
          url: this.seieiURL + "/plandategroup/insertNumberofwork",
          params: {
            serialno: this.serialno,
            bdate: this.settingNumberofworkBtime.getTime(),
            edate: this.settingNumberofworkEtime.getTime(),
            numberofwork: this.settingNumberofwork
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.peopleNumTableData, that.peopleNumTableData.length, {
              bdate: timeStampToString(this.settingNumberofworkBtime),
              edate: timeStampToString(this.settingNumberofworkEtime),
              numberofwork: this.settingNumberofwork,
              guid: response.data.data
            });
            that.$Message.success(response.data.msg);
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
      }
    },
    // 点击人数浮动层的取消按钮
    settingNumberofworkCancel: function() {
      this.isShowSettingNumberofwork = false;
    },
    // 修改人数浮动层的开始时间
    changeSettingNumberofworkBtime: function(date) {
      this.SettingNumberofworkBtime = new Date(date);
    },
    // 修改人数浮动层的结束时间
    changeSettingNumberofworkEtime: function(date) {
      this.SettingNumberofworkEtime = new Date(date);
    },
    // 点击提交主档按钮
    submit: function() {
      if (!this.inputGroup || !this.inputWorkShop || !this.inputProductLine || !this.inputAttribute) {
        this.$Message.error("组别、车间及生产线，属性不能为空");
      } else {
        this.isSubmitloading = true;
        var that = this;
        var args = {};
        args.bnsgroup = this.inputGroup;
        args.workshop = this.inputWorkShop;
        args.line = this.inputProductLine;
        args.numberofwork = this.inputPeopleNum;
        args.workinghours = this.inputWorkTime;
        args.Trait = this.inputAttribute;
        args.Hided = this.inputHidden ? 1 : 0;
        args.serialno = this.serialno;
        var url;
        if (!this.isAddMainTable) {
          url = this.seieiURL + "/plandategroup/updateMainTable";
        } else {
          url = this.seieiURL + "/plandategroup/insertMainTable";
        }
        this.axios.get(url, {
          params: args
        }).then((response) => {
          if (response.data.status == 0) {
            that.$Message.success(response.data.msg);
            that.isSubmitloading = false;
            that.isAddMainTable = false;
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
      }
    },
    // 点击主档返回按钮
    getOut: function() {
      this.isShowSettingBlock = false;
      this.isAddMainTable = false;
      this.reloadMainTable();
      this.peopleNumTableData = [];
      this.workTimeTableData = [];
      this.attributeTableData = [];
      this.inputGroup = "";
      this.inputWorkShop = "";
      this.inputProductLine = "";
      this.inputPeopleNum = 0;
      this.inputWorkTime = 0;
      this.inputAttribute = "";
      this.inputHidden = false;
    }
  },
  created: function() {
    // 页面初始化设置高度
    this.$nextTick(() => {
      this.$refs["rightBlockTabpaneWrapper"].style.height = this.windowHeight - 40 - 49 + "px"
    });
    this.reloadMainTable();
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
