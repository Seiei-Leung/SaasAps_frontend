export default class Const {
    
    constructor() {
    }

    // 用户信息枚举
    static get CONSTOFUSER() {
        return {
	        "IS_ONLINE": "isOnline",
            "CURRENT_USER_MSG": "currentUserMsg",
        }
    }

    // 用户级别
    static get RANKOFUSER() {
        return {
            "ISADMIN": 1
        }
    }

    // css 样式信息
    static get cssData() {
        return {
            pageHeaderHeight: 40,
            containerPageTabHeight: 49,
            topWrapperTitleHeight: 30, // 权限设置页面中左侧小栏目的标题高度
            topWrapperTitleMarginTop: 5, // 权限设置页面中左侧小栏目的margin-top
            rightBlockTabpaneWrapperPaddingBottom: 30,
            borderHeight: 1
        }
    }
}