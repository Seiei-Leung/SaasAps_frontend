// 注册自定义通用方法、通用参数

export default{
	install: function(Vue, opt) {
		Vue.mixin({
			data: function() {
				return {
					appName: "衣尚科技",
					seieiURL: "http://localhost:8080/api",
					windowWidth: "",
					windowHeight: ""
				}
			},
			methods: {
				
			},
			created: function () {
				this.windowWidth = window.innerwidth;
				this.windowHeight = window.innerHeight;
    		}
		})
	}
}