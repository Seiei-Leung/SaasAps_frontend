// 时间工具
export default class DateUtil {
    constructor() {
    }

    // 一天的总时间戳
    static get timeStampOfOneDay() {
        return 24*60*60*1000;
    }

    // 月份或日期补零
    static zeroFillOfMonthOrDay(str) {
        return (str + "").length == 2 ? str : "0" + str; 
    }

    // 获取某年某月的总天数
    static getDayCountOfMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
    
    // 日期转时间戳
    // 形如 "2019-11-18"
    static strToTimeStamp(dateStr) {
        var dateStrList = dateStr.split("-");
        var year = dateStrList[0];
        var month = DateUtil.zeroFillOfMonthOrDay(dateStrList[1]);
        var day = DateUtil.zeroFillOfMonthOrDay(dateStrList[2]);
        return new Date(year + "/" + month + "/" + day + " 00:00:00").getTime();
    }

    // 时间戳转日期
    // 输出结果，格式形如 "2019-11-18"
    static timeStampToDate(timeStamp) {
        var time = new Date(timeStamp);
        return (time.getFullYear() + "-" + DateUtil.zeroFillOfMonthOrDay(time.getMonth() + 1) + "-" + DateUtil.zeroFillOfMonthOrDay(time.getDate()));
    }
}