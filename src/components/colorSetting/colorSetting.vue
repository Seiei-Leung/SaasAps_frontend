<template>
    <div class="colorSetting-component">
        <div class="colorSettingWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
            <Divider class="headerDivider">计 划 颜 色 设 置</Divider>
            <div style="padding-left: 30px;">
                <div class="item">
                    <div class="title">
                        默认颜色：
                    </div>
                    <div class="pickerWrapper">
                        <ColorPicker v-model="defaultColor" />
                    </div>
                </div>
                <div class="item">
                    <div class="title">
                        推迟默认颜色：
                    </div>
                    <div class="pickerWrapper">
                        <ColorPicker v-model="defaultDelayColor" />
                    </div>
                </div>
                <div class="item">
                    <div class="title">
                        提前默认颜色：
                    </div>
                    <div class="pickerWrapper">
                        <ColorPicker v-model="defaultAdvanceColor" />
                    </div>
                </div>
                <div class="item">
                    <div class="title">
                        提前 <InputNumber style="width: 55px;" :step="1" :min="0" v-model="advanceDaynum"></InputNumber> 天数时的颜色：
                    </div>
                    <div class="pickerWrapper">
                        <ColorPicker v-model="advanceColor" />
                    </div>
                </div>
                <div class="item">
                    <div class="title">
                        推迟 <InputNumber style="width: 55px;" :step="1" :min="0" v-model="delayDaynum"></InputNumber> 天数时的颜色：
                    </div>
                    <div class="pickerWrapper">
                        <ColorPicker v-model="delayColor" />
                    </div>
                </div>
                <div class="item">
                    <div class="title">
                        计划解锁时边框的颜色：
                    </div>
                    <div class="pickerWrapper">
                        <ColorPicker v-model="unLockColor" />
                    </div>
                </div>
            </div>
            <div class="btnWrapper">
              <Button type="success" style="width: 200px;" size="large" @click="submit" :loading="isSubmitloading">
                保 存 设 置
              </Button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            defaultColor: "#fff", // 默认颜色
            defaultDelayColor: "#fff", // 默认推迟颜色
            defaultAdvanceColor: "#fff", // 默认提前颜色
            advanceColor: "#fff", // 提前颜色
            delayColor: "#fff", // 推迟颜色
            unLockColor: "#fff", // 计划解锁时的边框颜色
            advanceDaynum: 0, // 提前天数
            delayDaynum: 0, // 推迟天数
            isSubmitloading: false, // 按钮 loding
        }
    },
    created: function() {
        var that = this;
        // 页面初始化设置高度
        this.$nextTick(() => {
            this.$refs["rightBlockTabpaneWrapper"].style.height = this.windowHeight - 40 - 49 + "px";
        });
        this.axios.get(this.seieiURL + "/colorSetting/getByUserId").then((response) => {
            if (response.data.status == 0) {
                that.defaultColor = response.data.data.defaultColor; // 默认颜色
                that.defaultDelayColor = response.data.data.defaultDelayColor; // 默认推迟颜色
                that.defaultAdvanceColor = response.data.data.defaultAdvanceColor; // 默认提前颜色
                that.advanceColor = response.data.data.advanceColor; // 提前颜色
                that.delayColor = response.data.data.delayColor; // 推迟颜色
                that.advanceDaynum = response.data.data.advanceDaynum; // 提前天数
                that.delayDaynum = response.data.data.delayDaynum; // 推迟天数
                that.unLockColor = response.data.data.unlockColor; // 推迟天数
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
    methods: {
        // 提交设置
        submit: function() {
            var that = this;
            this.isSubmitloading = true;
            var obj = {};
            obj.defaultColor = this.defaultColor; // 默认颜色
            obj.defaultDelayColor = this.defaultDelayColor; // 默认推迟颜色
            obj.defaultAdvanceColor = this.defaultAdvanceColor; // 默认提前颜色
            obj.advanceColor = this.advanceColor; // 提前颜色
            obj.delayColor = this.delayColor; // 推迟颜色
            obj.advanceDaynum = this.advanceDaynum; // 提前天数
            obj.delayDaynum = this.delayDaynum; // 推迟天数
            obj.unLockColor = this.unLockColor; // 解锁颜色
            this.axios.post(this.seieiURL + "/colorSetting/update", obj).then((response) => {
                if (response.data.status == 0) {
                    that.$Message.success(response.data.msg);
                } else {
                    that.$Message.error(response.data.msg);
                    that.isInvaildSession(response.data.status);
                }
                that.isSubmitloading = false;
            }).catch((error) => {
                that.isSubmitloading = false;
                that.$Message.error({
                    content: "服务器异常,请刷新！！",
                    duration: 0,
                    closable: true
                });
                console.log(error)
            });
        }
    }
}
</script>

<style scoped>
.colorSetting-component .item {
    line-height: 50px;
}
.colorSetting-component .item .title {
    display: inline-block;
    width: 200px;
    vertical-align: top;

}
.colorSetting-component .item .pickerWrapper {
    display: inline-block;
    margin-left: 10px;
    vertical-align: top;
}
.btnWrapper {
    margin-top: 30px;
    text-align: center;
}
</style>