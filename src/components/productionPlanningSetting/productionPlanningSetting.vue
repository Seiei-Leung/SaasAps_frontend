<template>
  <div id="productionPlanningSetting-component">
    <div class="productionPlanningSettingWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
      <transition name="fade">
        <div v-show="!isShowSettingBlock">
          <Table height="450" :loading="sumTableLoading" border :columns="sumTableTitle" :data="sumTableData" ></Table>
          <div style="margin-top: 10px;text-align: center;">
            <Page
              :total="totalOfPage"
              :page-size="pageSize"
              show-elevator
              show-total
              :current="currentPageIndex"
              @on-change="changePage" />
          </div>
          <div style="margin-top: 30px;text-align:center;">
              <Upload
                name="excelFile"
                :action="uploadUrl"
                :format="['xls','xlsx']"
                :on-format-error="handleFormatError"
                :on-success="uploadSuccess">
                <Button type="primary" icon="ios-cloud-upload-outline">上传走货一览表</Button>
              </Upload>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div v-show="isShowSettingBlock">
          <div class="inputBar" style="margin-bottom: 10px;">
            <div class="title">
              单号：
            </div>
            <div class="inputWrapper">
              <Input v-model="inputSummaryData.billno" style="width: 100px" disabled/>
            </div>
            <div class="title">
              客户：
            </div>
            <div class="inputWrapper">
              <Input v-model="inputClientOfSummaryData" style="width: 80px" />
            </div>
            <div class="title">
              季节：
            </div>
            <div class="inputWrapper">
              <Input v-model="inputSeasonOfSummaryData" style="width: 80px" />
            </div>
          </div>
          <Table height="450" :loading="detailTableLoading" border :columns="detailTitle" :data="detailTableData"></Table>
          <div style="margin-top:30px;text-align:center;">
            <Button type="success" style="width: 200px;" size="large" @click="saveSummary" :loading="isSubmitloading">
              保 存 设 置
            </Button>
            <Button type="text" style="margin-left: 30px;width: 200px;background-color:#ddd;" size="large" @click="getOut">
              退 出
            </Button>
          </div>
          <div>
            <!-- 修改属性浮层 -->
            <Modal class="modifyDetailModal" width="900" v-model="isShowModifyDetail" title="修改" @on-ok="modifyDetailOk" @on-cancel="modifyDetailCancel" ok-text="确认" cancel-text="取消">
              <div class="inputFlexWrapper">
                <div class="inputWrapper">
                  <div class="title">季节：</div>
                  <Input v-model="inputseason" style="width: 150px;"/>
                </div>
                <div class="inputWrapper">
                  <div class="title">客户：</div>
                  <Input v-model="inputclientname" style="width: 150px;"/>
                </div>
                <div class="inputWrapper">
                  <div class="title">客户款号：</div>
                  <Input v-model="inputclientstyleno" style="width: 150px;"/>
                </div>
              </div>
              <div class="inputFlexWrapper">
                <div class="inputWrapper">
                  <div class="title">制单号：</div>
                  <Input v-model="inputorderno"  style="width: 150px;"/>
                </div>
                <div class="inputWrapper">
                  <div class="title">制单数：</div>
                  <InputNumber :min="0" :step="1" v-model="inputordernum" style="width: 150px"></InputNumber>
                </div>
                <div class="inputWrapper">
                  <div class="title">品名/款式：</div>
                  <Input v-model="inputgoodname" style="width: 150px"/>
                </div>
              </div>
              <div class="inputFlexWrapper">
                <div class="inputWrapper">
                  <div class="title">合同交期：</div>
                  <DatePicker @@="changeinputdeliveryofcontractTime" type="date" :value="inputdeliveryofcontractTime" placeholder="选择日期" style="width: 150px" :clearable="false"></DatePicker>
                </div>
                <div class="inputWrapper">
                  <div class="title">工厂离厂期：</div>
                  <DatePicker @on-change="changeinputdeliveryoffactoryTime" type="date" :value="inputdeliveryoffactoryTime" placeholder="选择日期" style="width: 150px" :clearable="false"></DatePicker>
                </div>
                <div class="inputWrapper">
                  <div class="title">批办时间：</div>
                  <DatePicker @on-change="changeinputapproveTime" type="date" :value="inputapproveTime" placeholder="选择日期" style="width: 150px" :clearable="false"></DatePicker>
                </div>
              </div>
              <div class="inputFlexWrapper">
                <div class="inputWrapper">
                  <div class="title">到仓期：</div>
                  <DatePicker @on-change="changeinputarrivewarehouseTime" type="date" :value="inputarrivewarehouseTime" placeholder="选择日期" style="width: 150px" :clearable="false"></DatePicker>
                </div>
                <div class="inputWrapper">
                  <div class="title">车缝辅料期：</div>
                  <DatePicker @on-change="changeinputliningofstitchingTime" type="date" :value="inputliningofstitchingTime" placeholder="选择日期" style="width: 150px" :clearable="false"></DatePicker>
                </div>
                <div class="inputWrapper">
                  <div class="title">布期：</div>
                  <DatePicker @on-change="changeinputclothTime" type="date" :value="inputclothTime" placeholder="选择日期" style="width: 150px" :clearable="false"></DatePicker>
                </div>
              </div>
              <div class="inputFlexWrapper">
                <div class="inputWrapper">
                  <div class="title">车印花期：</div>
                  <DatePicker @on-change="changeinputembroiderTime" type="date" :value="inputembroiderTime" placeholder="选择日期" style="width: 150px" :clearable="false"></DatePicker>
                </div>
                <div class="inputWrapper">
                  <div class="title">分批走货数量：</div>
                  <InputNumber :min="0" :step="1" v-model="inputqtyofbatcheddelivery" style="width: 150px"></InputNumber>
                </div>
                <div class="inputWrapper">
                  <div class="title">品类：</div>
                  <Input v-model="inputstyle" style="width: 150px"/>
                </div>
              </div>
              <div class="inputFlexWrapper">
                <div class="inputWrapper">
                  <div class="title">SAM：</div>
                  <InputNumber :min="0" :step="0.01" v-model="inputsam" style="width: 150px"></InputNumber>
                </div>
                <div class="inputWrapper">
                  <div class="title">SAH：</div>
                  <InputNumber :min="0" :step="0.01" v-model="inputsah" style="width: 150px"></InputNumber>
                </div>
                <div class="inputWrapper">
                  <div class="title">本厂SAM：</div>
                  <InputNumber :min="0" :step="0.01" v-model="inputsamoflocal" style="width: 150px"></InputNumber>
                </div>
              </div>
              <div class="inputFlexWrapper">
                <div class="inputWrapper">
                  <div class="title">车印花天数：</div>
                  <InputNumber :min="0" :step="1" v-model="inputembroiderDaynum" style="width: 150px"></InputNumber>
                </div>
                <div class="inputWrapper">
                  <div class="title">订单类别：</div>
                  <Input v-model="inputorderkind" style="width: 150px"/>
                </div>
                <div class="inputWrapper">
                  <div class="title">后整天数：</div>
                  <InputNumber :min="0" :step="1" v-model="inputbackpartDaynum" style="width: 150px"></InputNumber>
                </div>
              </div>
              <div class="inputFlexWrapper">
                <div class="inputWrapper">
                  <div class="title">裁数：</div>
                  <Input v-model="inputcuttingqty" style="width: 150px"/>
                </div>
                <div class="inputWrapper">
                  <div class="title">结束裁剪：</div>
                  <Checkbox v-model="inputisFinishCutting"></Checkbox>
                </div>
                <div class="inputWrapper">
                  <div class="title">提前开裁天数：</div>
                  <InputNumber :min="0" :step="1" v-model="inputadvancecuttingDaynum" style="width: 150px"></InputNumber>
                </div>
              </div>
              <div class="inputWrapper">
                <div class="title">面料：</div>
                <Input v-model="inputlining"/>
              </div>
              <div class="inputWrapper">
                <div class="title">备注：</div>
                <Input v-model="inputmemo" />
              </div>
              <div class="inputWrapper">
                <div class="title">面料供应商：</div>
                <Input v-model="inputsuppliesoflining" />
              </div>
              <div class="inputWrapper">
                <div class="title">车花工厂：</div>
                <Input v-model="inputfactoryEmbroider" />
              </div>
              <div class="inputWrapper">
                <div class="title">车花工厂1：</div>
                <Input v-model="inputfactoryEmbroider2" />
              </div>
              <div class="inputWrapper">
                <div class="title">印花工厂1：</div>
                <Input v-model="inputfactoryPrint" />
              </div>
            </Modal>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import DateUtil from "../../util/DateUtil";

export default {
    data: function() {
        return {
            sumTableTitle: [{
                title: '单号',
                key: 'billno',
                align: "center"
              },
              {
                title: '客户',
                key: 'clientname',
                align: "center"
              },
              {
                title: '季节',
                key: 'season',
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
                          this.showDetailList(params.row, params.index)
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
                          this.showDeleteDetailList(params.row, params.index)
                        }
                      }
                    }, '删除')
                  ]);
                }
              }
            ],
            detailTitle: [{
                title: '季节',
                key: 'season',
                align: "center",
                width: 100,
              },
              {
                title: '客户',
                key: 'clientname',
                align: "center",
                width: 200,
                tooltip: true,
              },
              {
                title: '客户款号',
                key: 'clientstyleno',
                align: "center",
                width: 100,
              },
              {
                title: '制单号',
                key: 'orderno',
                align: "center",
                width: 200,
                tooltip: true,
              },
              {
                title: '款号',
                key: 'styleno',
                align: "center",
                width: 200,
                tooltip: true,
              },
              {
                title: '制单数',
                key: 'ordernum',
                align: "center",
                width: 100,
              },
              {
                title: '品名/款式',
                key: 'goodname',
                align: "center",
                width: 100,
              },
              {
                title: '合同交期',
                key: 'deliveryofcontractTime',
                align: "center",
                width: 150,
              },
              {
                title: '工厂离厂期',
                key: 'deliveryoffactoryTime',
                align: "center",
                width: 150,
              },
              {
                title: '到仓期',
                key: 'arrivewarehouseTime',
                align: "center",
                width: 150,
              },
              {
                title: '分批走货数量',
                key: 'qtyofbatcheddelivery',
                align: "center",
                width: 150,
              },
              {
                title: '面料',
                key: 'lining',
                align: "center",
                width: 500,
                tooltip: true,
              },
              {
                title: '车缝辅料期',
                key: 'liningofstitchingTime',
                align: "center",
                width: 150,
              },
              {
                title: '布期',
                key: 'clothTime',
                align: "center",
                width: 150,
              },
              {
                title: 'SAM',
                key: 'sam',
                align: "center",
                width: 100,
              },
              {
                title: 'SAH',
                key: 'sah',
                align: "center",
                width: 100,
              },
              {
                title: '批办时间',
                key: 'approveTime',
                align: "center",
                width: 150,
              },
              {
                title: '车印花天数',
                key: 'embroiderDaynum',
                align: "center",
                width: 100,
              },
              {
                title: '品类',
                key: 'style',
                align: "center",
                width: 100,
              },
              {
                title: '车印花期',
                key: 'embroiderTime',
                align: "center",
                width: 100,
              },
              {
                title: '车花工厂',
                key: 'factoryEmbroider',
                align: "center",
                width: 100,
              },
              {
                title: '后整天数',
                key: 'backpartDaynum',
                align: "center",
                width: 100,
              },
              {
                title: '备注',
                key: 'memo',
                align: "center",
                width: 500,
                tooltip: true,
              },
              {
                title: '已排产',
                key: 'isPlanning',
                align: "center",
                width: 100,
                render: (h, params) => {
                  const type = params.row.isPlanning ? "md-checkmark-circle" : "md-radio-button-off";
                  return h('Icon', {
                    props: {
                      type: type,
                      color: "#2d8cf0"
                    }
                  });
                }
              },
              {
                title: '裁数',
                key: 'cuttingqty',
                align: "center",
                width: 100,
              },
              {
                title: '结束裁剪',
                key: 'isFinishCutting',
                align: "center",
                width: 100,
                render: (h, params) => {
                  const type = params.row.isFinishCutting ? "md-checkmark-circle" : "md-radio-button-off";
                  return h('Icon', {
                    props: {
                      type: type,
                      color: "#2d8cf0"
                    }
                  });
                }
              },
              {
                title: '提前开裁天数',
                key: 'advancecuttingDaynum',
                align: "center",
                width: 100,
              },
              {
                title: '订单类别',
                key: 'orderkind',
                align: "center",
                width: 100,
              },
              {
                title: '面料供应商',
                key: 'suppliesoflining',
                align: "center",
                width: 100,
              },
              {
                title: '本厂SAM',
                key: 'samoflocal',
                align: "center",
                width: 100,
              },
              {
                title: '车花工厂1',
                key: 'factoryEmbroider2',
                align: "center",
                width: 100,
              },
              {
                title: '印花工厂1',
                key: 'factoryPrint',
                align: "center",
                width: 100,
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
                          this.showModifyDetail(params.row, params.index)
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
                          this.showDeleteDetail(params.row, params.index)
                        }
                      }
                    }, '删除')
                  ]);
                }
              }
            ],
            sumTableData: [], // 主表数据
            sumTableLoading: true, // 主表 Loading
            detailTableData: [], // 副表数据
            detailTableLoading: true, // 副表 Loading
            uploadUrl: '', // 上传Excel地址
            totalOfPage: 0, // 显示的总条数
            pageSize: 10, // 一页显示的条数
            currentPageIndex: 1, // 当前页码
            isShowSettingBlock: false, // 是否显示详情表
            inputSummaryData: {}, // 激活主表信息
            inputSeasonOfSummaryData: "", // 激活主表季节
            inputClientOfSummaryData: "", // 激活主表客户
            isSubmitloading: false, // 保存 summary 按钮 Loading
            // 副表输入
            inputseason: "",
            inputclientname: "",
            inputclientstyleno: "",
            inputstyleno: "",
            inputorderno: "",
            inputordernum: "",
            inputgoodname: "",
            inputdeliveryofcontractTime: "",
            inputdeliveryoffactoryTime: "",
            inputarrivewarehouseTime: "",
            inputqtyofbatcheddelivery: "",
            inputlining: "",
            inputliningofstitchingTime: "",
            inputclothTime: "",
            inputsam: "",
            inputsah: "",
            inputapproveTime: "",
            inputembroiderDaynum: "",
            inputstyle: "",
            inputembroiderTime: "",
            inputfactoryEmbroider: "",
            inputbackpartDaynum: "",
            inputmemo: "",
            inputcuttingqty: "",
            inputisFinishCutting: "",
            inputadvancecuttingDaynum: "",
            inputorderkind: "",
            inputsuppliesoflining: "",
            inputsamoflocal: "",
            inputfactoryEmbroider2: "",
            inputfactoryPrint: "",
            
            isShowModifyDetail: false, // 是否显示修改详情窗口
            inputDetailId: "", // 修改详情 Id
        }
    },
    methods: {
        // DatePicker 修改事件
        changeinputdeliveryofcontractTime: function(data) {
          this.inputdeliveryofcontractTime = new Date(data);
        },
        changeinputdeliveryoffactoryTime: function(data) {
          this.inputdeliveryoffactoryTime = new Date(data);
        },
        changeinputapproveTime: function(data) {
          this.inputapproveTime = new Date(data);
        },
        changeinputarrivewarehouseTime: function(data) {
          this.inputarrivewarehouseTime = new Date(data);
        },
        changeinputliningofstitchingTime: function(data) {
          this.inputliningofstitchingTime = new Date(data);
        },
        changeinputclothTime: function(data) {
          this.inputclothTime = new Date(data);
        },
        changeinputembroiderTime: function(data) {
          this.inputembroiderTime = new Date(data);
        },
        // 上传文件格式错误
        handleFormatError (file) {
            this.$Notice.warning({
                title: '上传失败',
                desc: '上传文件必须为 xls 或 xlsx 格式'
            });
        },
        // Excel 文件上传成功
        uploadSuccess: function(res, file) {
          if (res.status) {
            this.$Message.error(res.msg);
          } else {
            this.showDetailList(res.data, null);
          }
        },
        // 点击页码
        changePage: function(pageIndex) {
          this.currentPageIndex = pageIndex;
          this.reloadMainTable();
        },
        // 刷新主表数据
        reloadMainTable: function() {
          var that = this;
          this.sumTableLoading = true;
          this.axios.get(this.seieiURL + "/summaryOfProductionPlanning/getAll?pageIndex=" + this.currentPageIndex + "&pageSize=" + this.pageSize).then((response) => {
            
            if (response.data.status) {
              that.$Message.error(response.data.msg);
              that.isInvaildSession(response.data.status);
              return;
            }
            that.currentPageIndex = response.data.data.pageNum;
            that.totalOfPage = response.data.data.total;
            that.sumTableData = response.data.data.list;
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
        // 主表修改按钮
        showDetailList: function(data, index) {
          var that = this;
          that.detailTableLoading = true;
          this.axios.get(this.seieiURL + "/productionplanningdetail/getDetailBySummaryId", {
            params: {
              id: data.id
            }
          }).then((response) => {
            if (response.data.status) {
              that.$Message.error(response.data.msg);
              that.isInvaildSession(response.data.status);
            } else {
              that.inputSummaryData = data;
              that.inputSeasonOfSummaryData = data.season;
              that.inputClientOfSummaryData = data.clientname;
              var detailTableData = response.data.data;
              detailTableData.forEach((item) => {
                if (item.approveTime != null) {
                  item.approveTime = DateUtil.timeStampToDate(item.approveTime);
                }
                if (item.arrivewarehouseTime != null) {
                  item.arrivewarehouseTime = DateUtil.timeStampToDate(item.arrivewarehouseTime);
                }
                if (item.deliveryofcontractTime != null) {
                  item.deliveryofcontractTime = DateUtil.timeStampToDate(item.deliveryofcontractTime);
                }
                if (item.deliveryoffactoryTime != null) {
                  item.deliveryoffactoryTime = DateUtil.timeStampToDate(item.deliveryoffactoryTime);
                }
                if (item.embroiderTime != null) {
                  item.embroiderTime = DateUtil.timeStampToDate(item.embroiderTime);
                }
                if (item.liningofstitchingTime != null) {
                  item.liningofstitchingTime = DateUtil.timeStampToDate(item.liningofstitchingTime);
                }
                if (item.clothTime != null) {
                  item.clothTime = DateUtil.timeStampToDate(item.clothTime);
                }
              });
              that.detailTableData = detailTableData;
              that.isShowSettingBlock = true;
              that.detailTableLoading = false;
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
        // 主表删除按钮
        showDeleteDetailList: function(data, index) {
          var that = this;
          this.axios.get(this.seieiURL + "/summaryOfProductionPlanning/delete", {
            params: {
              id: data.id
            }
          }).then((response) => {
            if (response.data.status) {
              that.$Message.error(response.data.msg);
              that.isInvaildSession(response.data.status);
            } else {
              that.$Message.success(response.data.msg);
              that.reloadMainTable();
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
        // 副表修改按钮
        showModifyDetail: function(data, index) {
          this.inputseason =  data.season;
          this.inputclientname =  data.clientname;
          this.inputclientstyleno =  data.clientstyleno;
          this.inputorderno =  data.orderno;
          this.inputstyleno =  data.styleno;
          this.inputordernum =  data.ordernum;
          this.inputgoodname =  data.goodname;
          this.inputdeliveryofcontractTime =  data.deliveryofcontractTime ? new Date(data.deliveryofcontractTime) : null;
          this.inputdeliveryoffactoryTime =  data.deliveryoffactoryTime ? new Date(data.deliveryoffactoryTime) : null;
          this.inputarrivewarehouseTime =  data.arrivewarehouseTime ? new Date(data.arrivewarehouseTime) : null;
          this.inputqtyofbatcheddelivery =  data.qtyofbatcheddelivery;
          this.inputlining =  data.lining;
          this.inputliningofstitchingTime = data.liningofstitchingTime ? new Date(data.liningofstitchingTime) : null;
          this.inputclothTime = data.clothTime ? new Date(data.clothTime) : null;
          this.inputsam = data.sam;
          this.inputsah = data.sah;
          this.inputapproveTime = data.approveTime ? new Date(data.approveTime) : data.approveTime;
          this.inputembroiderDaynum = data.embroiderDaynum;
          this.inputstyle =  data.style;
          this.inputembroiderTime = data.embroiderTime ? new Date(data.embroiderTime) : null;
          this.inputfactoryEmbroider =  data.factoryEmbroider;
          this.inputbackpartDaynum =  data.backpartDaynum;
          this.inputmemo =  data.memo;
          this.inputcuttingqty =  data.cuttingqty;
          this.inputisFinishCutting =  data.isFinishCutting;
          this.inputadvancecuttingDaynum =  data.advancecuttingDaynum;
          this.inputorderkind =  data.orderkind;
          this.inputsuppliesoflining =  data.suppliesoflining;
          this.inputsamoflocal =  data.samoflocal;
          this.inputfactoryEmbroider2 =  data.factoryEmbroider2;
          this.inputfactoryPrint =  data.factoryPrint;
          this.inputDetailId = data.id;
          this.isShowModifyDetail = true;
        },
        // 保存详情修改
        modifyDetailOk: function() {
          var that = this;
          var args = {};
          args.season = this.inputseason;
          args.clientname = this.inputclientname;
          args.clientstyleno = this.inputclientstyleno;
          args.orderno = this.inputorderno;
          args.styleno = this.inputstyleno;
          args.ordernum = this.inputordernum;
          args.goodname = this.inputgoodname;
          args.deliveryofcontractTime = this.inputdeliveryofcontractTime ? this.inputdeliveryofcontractTime.getTime() : null;
          args.deliveryoffactoryTime = this.inputdeliveryoffactoryTime ? this.inputdeliveryoffactoryTime.getTime() : null;
          args.arrivewarehouseTime = this.inputarrivewarehouseTime ? this.inputarrivewarehouseTime.getTime() : null;
          args.qtyofbatcheddelivery = this.inputqtyofbatcheddelivery;
          args.lining = this.inputlining;
          args.liningofstitchingTime = this.inputliningofstitchingTime ? this.inputliningofstitchingTime.getTime() : null;
          args.clothTime = this.inputclothTime ? this.inputclothTime.getTime() : null;
          args.approveTime = this.inputapproveTime ? this.inputapproveTime.getTime() : null;
          args.sam = this.inputsam;
          args.sah = this.inputsah;
          args.embroiderDaynum = this.inputembroiderDaynum;
          args.style = this.inputstyle;
          args.embroiderTime = this.inputembroiderTime ? this.inputembroiderTime.getTime() : null;
          args.factoryEmbroider = this.inputfactoryEmbroider;
          args.backpartDaynum = this.inputbackpartDaynum;
          args.memo = this.inputmemo;
          args.cuttingqty = this.inputcuttingqty;
          args.isFinishCutting = this.inputisFinishCutting;
          args.advancecuttingDaynum = this.inputadvancecuttingDaynum;
          args.orderkind = this.inputorderkind;
          args.suppliesoflining = this.inputsuppliesoflining;
          args.samoflocal = this.inputsamoflocal;
          args.factoryEmbroider2 = this.inputfactoryEmbroider2;
          args.factoryPrint = this.inputfactoryPrint;
          args.id = this.inputDetailId;
          that.detailTableLoading = true;
          this.axios.post(this.seieiURL + "/productionplanningdetail/updateDetail", args).then((response) => {
            if (response.data.status) {
              that.$Message.error(response.data.msg);
              that.isInvaildSession(response.data.status);
            } else {
              that.$Message.success(response.data.msg);
              that.isShowModifyDetail = false;
              that.showDetailList(that.inputSummaryData, null);
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
        // 修改详情表取消按钮
        modifyDetailCancel: function() {
          this.isShowModifyDetail = false;
        },
        // 副表删除按钮
        showDeleteDetail: function(data, index) {
          var that = this;
          this.axios.get(this.seieiURL + "/productionplanningdetail/deleteDetail", {
            params: {
              id: data.id
            }
          }).then((response) => {
            if (response.data.status) {
              that.$Message.error(response.data.msg);
              that.isInvaildSession(response.data.status);
            } else {
              that.$Message.success(response.data.msg);
              that.showDetailList(that.inputSummaryData, null);
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
        // 保存 summary 按钮
        saveSummary: function() {
          var args = {};
          var that = this;
          args.id = this.inputSummaryData.id;
          args.clientname = this.inputClientOfSummaryData;
          args.season = this.inputSeasonOfSummaryData;
          this.axios.get(this.seieiURL + "/summaryOfProductionPlanning/update", {
            params: args
          }).then((response) => {
            if (response.data.status) {
              that.$Message.error(response.data.msg);
              that.isInvaildSession(response.data.status);
            } else {
              that.isShowSettingBlock = false;
              that.$Message.success(response.data.msg);
              that.reloadMainTable();
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
        // 退出详情按钮
        getOut: function() {
          this.isShowSettingBlock = false;
          this.reloadMainTable();
        },
    },
    created: function() {
      var that = this;
      this.uploadUrl = this.seieiURL + "/productionplanningdetail/uploadExcel";
      this.reloadMainTable();
    }
}
</script>
<style scoped>
.productionPlanningSettingWrapper .inputBar {
  margin-top: 20px;
  font-size: 0;
}

.productionPlanningSettingWrapper .inputBar .title {
  display: inline-block;
  margin-left: 15px;
  line-height: 40px;
  font-size: 18px;
  vertical-align: top
}

.productionPlanningSettingWrapper .inputBar .inputWrapper {
  display: inline-block;
  margin-left: 5px;
  line-height: 35px;
  font-size: 12px;
  vertical-align: top;
}
.modifyDetailModal .inputFlexWrapper{
  display: flex;
  justify-content: space-around;
}
.modifyDetailModal .inputFlexWrapper .inputWrapper{
  text-align: right;
}
.modifyDetailModal .inputWrapper {
  margin-top: 20px;
  min-width: 240px;
  line-height: 32px;
}
.modifyDetailModal .inputWrapper .title {
  display: inline-block;
}
</style>