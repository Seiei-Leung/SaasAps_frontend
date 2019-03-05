<template>
  <div id="productionClass-component">
    <div class="productionClassWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
      <transition name="fade">
        <div v-show="!isShowSettingBlock">
          <Table height="450" :loading="sumTableLoading" border :columns="sumTableTitle" :data="sumTableData"></Table>
          <div style="margin-top: 30px;text-align:center;">
            <Button type="primary" @click="addSumTable">新 增 排 产 品 类</Button>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div v-show="isShowSettingBlock">
          <div class="topBlock">
            <Divider class="headerDivider">主 要 信 息</Divider>
            <div class="inputBar">
              <div class="title">
                产品分类代码：
              </div>
              <div class="inputWrapper">
                <Input v-model="inputCno" style="width: 80px"></Input>
              </div>
              <div class="title">
                款式分类：
              </div>
              <div class="inputWrapper">
                <Input v-model="inputCname" style="width: 80px"></Input>
              </div>
              <div class="title">
                默认效率：
              </div>
              <div class="inputWrapper">
                <InputNumber :min="0" :max="1" :step="0.1" v-model="inputEfficiency" style="width: 80px"></InputNumber>
              </div>
              <div class="title">
                前三天效率：
              </div>
              <div class="inputWrapper">
                <InputNumber :min="0" :max="1" :step="0.1" v-model="inputEfficiencystart" style="width: 80px"></InputNumber>
              </div>
              <div class="title">
                裁床sam：
              </div>
              <div class="inputWrapper">
                <InputNumber :min="0" :step="0.1" v-model="inputCuttingsam" style="width: 80px"></InputNumber>
              </div>
            </div>
          </div>
          <div class="bottomBlock">
            <Divider class="headerDivider" style="font-weight:normal;">明 细 记 录</Divider>
            <div>
              <Table :loading="inputTableLoading" border :columns="inputTableTitle" :data="inputTableData"></Table>
              <div class="addBlock">
                <Button type="warning" @click="addinputTable" size="small">
                  新增明细记录
                </Button>
              </div>
            </div>
            <div style="margin-top:30px;text-align:center;">
              <Button type="success" style="width: 200px;" size="large" @click="submit" :loading="isSubmitloading">
                保 存 设 置
              </Button>
              <Button type="text" style="margin-left: 30px;width: 200px;background-color:#ddd;" size="large" @click="getOut">
                退 出
              </Button>
            </div>
            <div>
              <!-- 修改属性浮层 -->
              <Modal v-model="isShowSettingPCCategorydl" v-bind:title="settingPCCategorydlTitle" @on-ok="settingPCCategorydlOk" @on-cancel="settingPCCategorydlCancel" ok-text="确认" cancel-text="取消">
                <div>开始计件数：<InputNumber :min="0" :step="1" v-model="inputSQuantity" style="margin-left: 10px;width: 100px"></InputNumber>
                </div>
                <div style="margin-top:20px;">结束计件数：<InputNumber :min="0" :step="1" v-model="inputEQuantity" style="margin-left: 10px;width: 100px"></InputNumber>
                </div>
                <div style="margin-top:20px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;效率：<InputNumber :min="0" :step="0.01" v-model="inputEfficiency" style="margin-left: 10px;width: 100px"></InputNumber>
                </div>
              </Modal>
              <!-- 删除排产品类 -->
              <Modal v-model="isShowDeleteBlock" v-bind:title="deleteBlockTitle" @on-ok="deleteBlockOk" @on-cancel="deleteBlockCancel" ok-text="确认" cancel-text="取消">
                <div>{{deleteBlockText}}</div>
              </Modal>
            </div>
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
      isShowSettingBlock: false,
      sumTableLoading: true,
      sumTableTitle: [{
          title: '产品分类代码',
          key: 'cno',
          align: "center"
        },
        {
          title: '款式分类',
          key: 'cname',
          align: "center"
        },
        {
          title: '默认效率',
          key: 'efficiency',
          align: "center"
        },
        {
          title: '前三天效率',
          key: 'efficiencystart',
          align: "center"
        },
        {
          title: '裁床sam',
          key: 'cuttingsam',
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
                    this.clickSumTable(params.row, params.index)
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
      sumTableData: [],
      inputCno: "",
      inputCname: "",
      inputEfficiency: 0,
      inputEfficiencystart: 0,
      inputCuttingsam: 0,
      inputTableLoading: true,
      inputTableTitle: [{
          title: '开始计件数',
          key: 'squantity',
          align: "center",
          sortType: "asc"
        },
        {
          title: '结束计件数',
          key: 'equantity',
          align: "center"
        },
        {
          title: '效率',
          key: 'efficiency',
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
                    this.changePCCategorydl(params.index)
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
                    this.removePCCategorydl(params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      inputTableData: [],
      isShowSettingPCCategorydl: false,
      settingPCCategorydlTitle: "",
      inputSQuantity: 0,
      inputEQuantity: 0,
      inputEfficiency: 0,
      isSubmitloading: false,
      inputIndex: 0,
      inputGuid: "",
      isAddMainTable: false,
      isShowDeleteBlock: false,
      deleteBlockText: "是否删除该产品类",
      deleteBlockTitle: "删除产品类"
    }
  },
  methods: {
    // 刷新主档表格数据
    reloadMainTable: function() {
      var that = this;
      this.sumTableLoading = true;
      this.axios.get(this.seieiURL + '/productionclass/getMainTable').then((response) => {
        that.sumTableData = response.data.data;
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
    clickSumTable: function(data, index) {
      this.isShowSettingBlock = true;
      this.inputCno = data.cno;
      this.inputCname = data.cname;
      this.inputEfficiencystart = data.efficiencystart;
      this.inputEfficiency = data.efficiency;
      this.inputCuttingsam = data.cuttingsam;
      this.serialno = data.serialno;
      this.inputTableLoading = true;
      var that = this;
      this.axios.get(this.seieiURL + "/productionclass/getSettingTable", {
        params: {
          serialno: this.serialno
        }
      }).then((response) => {
        that.inputTableData = response.data.data;
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
    changePCCategorydl: function(index) {
      this.settingPCCategorydlTitle = "修改明细记录";
      this.isShowSettingPCCategorydl = true;
      this.inputEQuantity = this.inputTableData[index].equantity;
      this.inputSQuantity = this.inputTableData[index].squantity;
      this.inputEfficiency = this.inputTableData[index].efficiency;
      this.inputIndex = index;
      this.inputGuid = this.inputTableData[index].guid;
    },
    removePCCategorydl: function(index) {
      var that = this;
      this.axios.get(this.seieiURL + '/productionclass/deletePCCategorydl', {
        params: {
          guid: this.inputTableData[index].guid
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.inputTableData.splice(index, 1);
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
    settingPCCategorydlOk: function() {
      var that = this;
      if (this.inputTableTitle == "修改明细记录") {
        this.$set(this.inputTableData, [this.inputIndex], {
          equantity: this.inputEQuantity,
          squantity: this.inputSQuantity,
          efficiency: this.inputEfficiency,
          guid: this.inputGuid
        });
        this.axios.get(this.seieiURL + '/productionclass/updatePCCategorydl', {
          params: {
            guid: this.inputGuid,
            equantity: this.inputEQuantity,
            squantity: this.inputSQuantity,
            efficiency: this.inputEfficiency
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
        this.axios.get(this.seieiURL + '/productionclass/insertPCCategorydl', {
          params: {
            serialno: this.serialno,
            equantity: this.inputEQuantity,
            squantity: this.inputSQuantity,
            efficiency: this.inputEfficiency,
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.inputTableData, that.inputTableData.length, {
              equantity: this.inputEQuantity,
              squantity: this.inputSQuantity,
              efficiency: this.inputEfficiency,
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
    settingPCCategorydlCancel: function() {
      this.isShowSettingPCCategorydl = false;
    },
    addinputTable: function() {
      this.settingPCCategorydlTitle = "新增明细记录";
      this.isShowSettingPCCategorydl = true;
      this.inputEQuantity = 0;
      this.inputSQuantity = 0;
      this.inputEfficiency = 0;
    },
    addSumTable: function() {
      var that = this;
      this.axios.get(this.seieiURL + '/productionclass/getSerialno').then((response) => {
        that.isAddMainTable = true;
        that.isShowSettingBlock = true;
        that.inputTableLoading = false;
        that.serialno = response.data.data;
      }).catch((error) => {
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    submit: function() {
      if (!this.inputCno || !this.inputCname) {
        this.$Message.error("产品分类代码及款式分类不能为空");
      } else {
        var args = {},
          that = this,
          url;
        args.cname = this.inputCname;
        args.cno = this.inputCno;
        args.efficiencystart = this.inputEfficiencystart;
        args.efficiency = this.inputEfficiency;
        args.cuttingsam = this.inputCuttingsam;
        args.serialno = this.serialno;
        this.isSubmitloading = true;
        if (!this.isAddMainTable) {
          url = this.seieiURL + "/productionclass/updatePCCategory"
        } else {
          url = this.seieiURL + "/productionclass/insertPCCategory"
        }
        this.axios.get(url, {
          params: args
        }).then((response) => {
          if (response.data.status == 0) {
            that.isAddMainTable = false;
            that.isSubmitloading = false;
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
    getOut: function() {
      this.isShowSettingBlock = false;
      this.isAddMainTable = false;
      this.reloadMainTable();
      this.inputTableData = [];
      this.inputCno = "";
      this.inputCname = "";
      this.inputEfficiency = 0;
      this.inputEfficiencystart = 0;
      this.inputCuttingsam = 0;
    },
    deleteSumTable: function(data, id) {
      this.isShowDeleteBlock = true;
      this.serialno = data.serialno;
    },
    deleteBlockOk: function() {
      var that = this;
      this.axios.get(this.seieiURL + "/productionclass/deleteMainTable", {
        params: {
          serialno: this.serialno
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.$Message.success(response.data.msg);
          that.reloadMainTable();
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
.productionClassWrapper .filterBar,
.productionClassWrapper .inputBar {
  margin-top: 20px;
  font-size: 0;
}

.productionClassWrapper .filterBar .title,
.productionClassWrapper .inputBar .title {
  display: inline-block;
  margin-left: 15px;
  line-height: 40px;
  font-size: 18px;
  vertical-align: top;
}

.productionClassWrapper .filterBar .titleFirst,
.productionClassWrapper .inputBar .titleFirst {
  margin-left: 5px;
}

.productionClassWrapper .filterBar .inputWrapper,
.productionClassWrapper .inputBar .inputWrapper {
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
