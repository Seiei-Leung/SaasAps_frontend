const cssData = {
	pageHeaderHeight: 40,
	containerPageTabHeight: 49,
	topWrapperTitleHeight: 30, // 权限设置页面中左侧小栏目的标题高度
	topWrapperTitleMarginTop: 5, // 权限设置页面中左侧小栏目的margin-top
	rightBlockTabpaneWrapperPaddingBottom: 30,
	borderHeight: 1
}

const CONST = {
	"IS_ONLINE": "isOnline",
	"CURRENT_USER_MSG": "currentUserMsg",
	"ISADMIN": 1
}


// 时间戳转化为字符串
function timeStampToString(timeStamp) {
	var
		year = timeStamp.getFullYear();
		month = timeStamp.getMonth() + 1;
		date = timeStamp.getDate();
	return year + "-" + month + "-" + date;
}