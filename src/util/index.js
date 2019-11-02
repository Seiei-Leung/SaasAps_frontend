// 注册自定义通用方法、通用参数

export default{
	install: function(Vue, opt) {
		Vue.mixin({
			data: function() {
				return {
					appName: "衣尚科技",
					seieiURL: "http://localhost:8080/api",
					// seieiURL: "http://www.etscn.com.cn:58080/SaasapsBackEnd/api/",
					windowWidth: "",
					windowHeight: ""
				}
			},
			methods: {
				// 用户 session 失效
				isInvaildSession: function(status) {
					if (status == 10) {
						sessionStorage.clear();
						this.$store.commit("setIsSignin", false);
						this.$store.commit("setUserRole", 0);
						window.location.reload();
					}
				}
			},
			created: function () {
				this.windowWidth = window.innerwidth;
				this.windowHeight = window.innerHeight;
    		}
		})
	}
}