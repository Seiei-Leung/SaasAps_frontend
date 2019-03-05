import Vue from 'vue';
import Vuex from 'vuex';

// 全局使用vuex
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		// 用户登陆信息
		isSignin: false,
		// 用户是否为管理员
		userRole: 0
	},
	mutations: {
		// 改变是否登陆布尔值
		setIsSignin(state, isSignin) {
			state.isSignin = isSignin;
		},
		setUserRole(state, userRole) {
			state.userRole = userRole;
		}
	}
})