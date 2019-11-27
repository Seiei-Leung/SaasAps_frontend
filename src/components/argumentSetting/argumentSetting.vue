/* 参数设置 */
<template>
    <div class="argumentSetting-component">
        <div class="aboutMinusAndChangeEfficiency" style="padding-left: 30px;">
            <Divider class="headerDivider">减 数 及 修 改 效 率 设 置</Divider>
            <div class="item">
                <div class="title">
                    减数及修改效率后自动消除时间空隙：
                </div>
                <dvi class="content">
                    <i-switch v-model="afterMinusorchangeefficiencyHasremovegapmodel">
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </i-switch>
                </dvi>
            </div>
        </div>
        <div class="btnWrapper">
          <Button type="success" style="width: 200px;" size="large" @click="submit" :loading="isSubmitloading">
            保 存 设 置
          </Button>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            inputId: null, // 参数设置主键
            afterMinusorchangeefficiencyHasremovegapmodel: false, // 减数，修改效率之后是否自动消除时间空隙
            isSubmitloading: false, // 提交 loading
        }
    },
    methods: {
        // 重载数据
        reload: function() {
            var that = this;
            this.axios.get(this.seieiURL + "/argumentSetting/getAll").then((response) => {
                if (response.data.status == 0) {
                    that.afterMinusorchangeefficiencyHasremovegapmodel = response.data.data.afterMinusorchangeefficiencyHasremovegapmodel;
                    that.inputId = response.data.data.id;
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
        // 提交数据
        submit: function() {
            var that = this;
            this.isSubmitloading = true;
            var obj = {};
            obj.id = this.inputId
            obj.afterMinusorchangeefficiencyHasremovegapmodel = this.afterMinusorchangeefficiencyHasremovegapmodel;
            this.axios.post(this.seieiURL + "/argumentSetting/update", obj).then((response) => {
                if (response.data.status == 0) {
                    that.$Message.success({
                        content: response.data.msg
                    })
                    that.reload();
                } else {
                    that.$Message.error(response.data.msg);
                    that.isInvaildSession(response.data.status);
                }
                that.isSubmitloading = false;
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
    created: function() {
        this.reload();
    }
}
</script>

<style scoped>
.argumentSetting-component .item {
    line-height: 50px;
}
.argumentSetting-component .item .title {
    display: inline-block;
    width: 250px;
    vertical-align: top;
}
.argumentSetting-component .item .pickerWrapper {
    display: inline-block;
    margin-left: 10px;
    vertical-align: top;
}
.btnWrapper {
    margin-top: 30px;
    text-align: center;
}
</style>