<template>
  <div id="productionClass-component">
    <div class="productionClassWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
      <transition name="fade">
        <div v-show="!isShowSettingBlock">
          <Table height="450" :loading="sumTableLoading" border :columns="sumTableTitle" :data="sumTableData"></Table>
          <div style="margin-top: 30px;text-align:center;">
            <Button type="primary" @click="showAddProductClass">新 增 排 产 品 类</Button>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div v-show="isShowSettingBlock">
          <div class="topBlock">
            <Divider class="headerDivider">主 要 信 息</Divider>
            <div class="inputBar">
              <div class="title">
                排产品类名称：
              </div>
              <div class="inputWrapper">
                <Input v-model="inputProductClassName" style="width: 80px" />
              </div>
              <div class="title">
                款式分类：
              </div>
              <div class="inputWrapper">
                <Select v-model="inputProperityName" style="margin-left: 7px;width: 100px">
                  <Option v-for="item in properityNameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
              </div>
              <div class="title">
                默认效率：
              </div>
              <div class="inputWrapper">
                <InputNumber :min="0" :step="0.01" v-model="inputDefaultEffiency" style="width: 80px"></InputNumber>
              </div>
            </div>
          </div>
          <div class="bottomBlock">
            <Divider class="headerDivider" style="font-weight:normal;">明 细 记 录</Divider>
            <div>
              <Table :loading="inputTableLoading" border :columns="inputTableTitle" :data="detailData"></Table>
              <div class="addBlock">
                <Button type="warning" @click="showAddDetail" size="small">
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
              <Modal v-model="isShowInputDetail" v-bind:title="settingDetailTitle" @on-ok="modifyDetail" @on-cancel="modifyDetailCancel" ok-text="确认" cancel-text="取消">
                <div>开始计件数：<InputNumber :min="0" :step="1" v-model="inputStartQuantity" style="margin-left: 10px;width: 100px"></InputNumber>
                </div>
                <div style="margin-top:20px;">结束计件数：<InputNumber :min="0" :step="1" v-model="inputEndQuantity" style="margin-left: 10px;width: 100px"></InputNumber>
                </div>
                <div style="margin-top:20px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;效率：<InputNumber :min="0" :step="0.01" v-model="inputEfficiency" style="margin-left: 10px;width: 100px"></InputNumber>
                </div>
              </Modal>
              <!-- 删除排产品类 -->
              <Modal v-model="isShowDeleteProductClass" v-bind:title="deleteBlockTitle" @on-ok="deleteProductClass" @on-cancel="deleteBlockCancel" ok-text="确认" cancel-text="取消">
                <div>{{deleteBlockText}}</div>
              </Modal>
              <!-- 新增生产线 -->
              <Modal v-model="isShowAddProductClass" v-bind:title="addProductClassTitle" @on-ok="addProductClass" @on-cancel="addProductClassCancel" ok-text="确认" cancel-text="取消">
                <div style="margin-left: 12px;">
                  排产品类名称：<Input v-model="inputProductClassName" style="margin-left: 10px;width: 100px" />
                </div>
                <div style="margin-top:20px;margin-left: 12px;">款式属性：
                  <Select v-model="inputProperityName" style="margin-left: 31px;width: 100px">
                    <Option v-for="item in properityNameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                  </Select>
                </div>
                <div style="margin-top:20px;margin-left: 12px;">默认效率：
                  <InputNumber :min="0" :step="0.01" v-model="inputDefaultEffiency" style="margin-left: 31px;width: 100px"></InputNumber>
                </div>
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
      sumTableLoading: true,
      sumTableTitle: [{
          title: '产品分类代码',
          key: 'name',
          align: "center"
        },
        {
          title: '款式分类',
          key: 'productStyleName',
          align: "center"
        },
        {
          title: '默认效率',
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
                    this.showModifyProductClass(params.row, params.index)
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
                    this.showDeleteProductClass(params.row, params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      sumTableData: [],
      inputTableLoading: true,
      inputTableTitle: [{
          title: '开始计件数',
          key: 'startQuantity',
          align: "center",
          sortType: "asc"
        },
        {
          title: '结束计件数',
          key: 'endQuantity',
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
                    this.showModifyDetail(params.index)
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
                    this.deleteDetail(params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      isShowDeleteProductClass: false,
      deleteBlockText: "是否删除该产品类",
      deleteBlockTitle: "删除产品类",
      properityNameList: [],
      isShowAddProductClass: false, // 是否显示产品类输入框
      inputDefaultEffiency: 0, // 产品类默认效率
      inputProductClassName: "", // 产品类名称
      inputProperityName: "", // 产品类属性
      inputIdOfProductClass: "", // 产品类id
      isShowSettingBlock: false, // 是否显示详情模块
      isSubmitloading: false, // 保存设置按钮的 loading 动画
      isShowInputDetail: false, // 新增或修改详情输入框
      settingDetailTitle: "", // 新增或修改详情输入框的标题
      detailData: [], // 详情列表
      inputStartQuantity: 0, // 开始计件数
      inputEndQuantity: 0, // 结束计件数
      inputEfficiency: 0, // 详情效率
      inputDetailIndex: 0, // 详情的索引
      inputIdOfDetail: "", // 详情 ID
    }
  },
  methods: {
    // 刷新主档表格数据
    reloadMainTable: function() {
      var that = this;
      this.sumTableLoading = true;
      this.axios.get(this.seieiURL + '/productclass/getAllProductClass').then((response) => {
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
    // 显示添加产品类输入框
    showAddProductClass: function() {
      this.isShowAddProductClass = true;
    },
    // 新增产品类
    addProductClass: function() {
      var that= this;
      if (!this.inputProductClassName || !this.inputProperityName) {
        this.$Message.error("排产品类名称及款式属性不能为空");
        return;
      }
      this.axios.get(this.seieiURL + "/productclass/insertProductClass", {
        params: {
          name: this.inputProductClassName,
          productStyleName: this.inputProperityName,
          efficiency: this.inputDefaultEffiency
        }
      }).then((response) => {
        if (response.data.status) {
          that.$Message.error(response.data.msg);
        } else {
          that.isShowAddProductClass = false;
          that.inputIdOfProductClass = response.data.data;
          that.isShowSettingBlock = true;
          that.inputTableLoading = false;
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
    // 保存设置按钮
    submit: function() {
      if (!this.inputProductClassName || !this.inputProperityName) {
        this.$Message.error("产品分类代码及款式分类不能为空");
      } else {
        var that = this;
        this.isSubmitloading = true;
        this.axios.get(this.seieiURL + "/productclass/updateProductClass", {
          params: {
            id: this.inputIdOfProductClass,
            name: this.inputProductClassName,
            productStyleName: this.inputProperityName,
            efficiency: this.inputDefaultEffiency
          }
        }).then((response) => {
          if (response.data.status == 0) {
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
    // 显示修改详情输入框
    showModifyDetail: function(index) {
      this.settingDetailTitle = "修改明细记录";
      this.isShowInputDetail = true;
      this.inputEndQuantity = this.detailData[index].endQuantity;
      this.inputStartQuantity = this.detailData[index].startQuantity;
      this.inputEfficiency = this.detailData[index].efficiency;
      this.inputDetailIndex = index;
      this.inputIdOfDetail = this.detailData[index].id;
    },
    // 显示新增详情按钮
    showAddDetail: function() {
      this.settingDetailTitle = "新增明细记录";
      this.isShowInputDetail = true;
      this.inputEndQuantity = 0;
      this.inputStartQuantity = 0;
      this.inputEfficiency = 0;
    },
    // 修改或新增详情确定按钮
    modifyDetail: function() {
      var that = this;
      if ((this.inputEfficiency + "") == "" || (this.inputEndQuantity + "") == "" || (this.inputStartQuantity + "") == "") {
        this.$Message.error("输入不能为空");
        return;
      }
      if (this.inputEndQuantity <= this.inputStartQuantity) {
        this.$Message.error("开始计件数不能高于或等于结束计件数");
        return;
      }
      if (this.settingDetailTitle == "修改明细记录") {
        this.axios.get(this.seieiURL + '/productclass/updateDetail', {
          params: {
            id: this.inputIdOfDetail,
            endQuantity: this.inputEndQuantity,
            startQuantity: this.inputStartQuantity,
            efficiency: this.inputEfficiency
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.detailData, [that.inputDetailIndex], {
              endQuantity: that.inputEndQuantity,
              startQuantity: that.inputStartQuantity,
              efficiency: that.inputEfficiency,
              id: that.inputIdOfDetail
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
      } else {
        this.axios.get(this.seieiURL + '/productclass/insertDetail', {
          params: {
            productClassId: this.inputIdOfProductClass,
            endQuantity: this.inputEndQuantity,
            startQuantity: this.inputStartQuantity,
            efficiency: this.inputEfficiency,
          }
        }).then((response) => {
          if (response.data.status == 0) {
            that.$set(that.detailData, that.detailData.length, {
              endQuantity: that.inputEndQuantity,
              startQuantity: that.inputStartQuantity,
              efficiency: that.inputEfficiency,
              id: response.data.data
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
    // 修改或新增详情取消按钮
    modifyDetailCancel: function() {
      this.isShowInputDetail = false;
    },
    // 删除详情
    deleteDetail: function(index) {
      var that = this;
      this.axios.get(this.seieiURL + '/productclass/deleteDetail', {
        params: {
          id: this.detailData[index].id
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.detailData.splice(index, 1);
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
    // 显示修改产品类输入框
    showModifyProductClass: function(data, index) {
      this.isShowSettingBlock = true;
      this.inputProductClassName = data.name;
      this.inputProperityName = data.productStyleName;
      this.inputDefaultEffiency = data.efficiency;
      this.inputIdOfProductClass = data.id;
      this.inputTableLoading = true;
      var that = this;
      this.axios.get(this.seieiURL + "/productclass/getDetailById", {
        params: {
          productClassId: this.inputIdOfProductClass
        }
      }).then((response) => {
        that.detailData = response.data.data;
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
    // 退出按钮
    getOut: function() {
      this.isShowSettingBlock = false;
      this.reloadMainTable();
      this.detailData = [];
      this.inputProductClassName = "";
      this.inputProperityName = "";
      this.inputEfficiency = 0;
      this.inputEfficiencystart = 0;
      this.inputDefaultEffiency = 0;
    },
    // 显示删除产品类窗口
    showDeleteProductClass: function(data, id) {
      this.isShowDeleteProductClass = true;
      this.inputIdOfProductClass = data.id;
    },
    // 删除产品类
    deleteProductClass: function() {
      var that = this;
      this.axios.get(this.seieiURL + "/productclass/deleteProductClass", {
        params: {
          id: this.inputIdOfProductClass
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
      this.isShowDeleteProductClass = false;
    }
  },
  created: function() {
    var that = this;
    this.axios.get(this.seieiURL + "/productstyle/getall").then((response) => {
      that.properityNameList = response.data.data;
    }).catch((error) => {
      that.$Message.error({
        content: "服务器异常,请刷新！！",
        duration: 0,
        closable: true
      });
      console.log(error)
    });
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
