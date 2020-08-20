export default {
	namespaced: true,
	state: {
		user: {},
		token: false
	},
	getters: {
	},
	mutations: {
		//初始化用户信息
		initUser(state){
			let user = window.sessionStorage.getItem('user');
			if(user) {
				state.user = JSON.parse(user)
				state.token = state.user.token
			}
		},
		//登录
		login(state, user){
			console.log('执行了vuex中的login()')
			//存储到vuex
			state.user = user
			state.token = user.token
			//本地存储
			window.sessionStorage.setItem('user', JSON.stringify(state.user))
			window.sessionStorage.setItem('token', state.token)
		},
		//退出登录
		loginOut(state){
			//清空vuex-user中的数据
			state.user = {}
			state.token = false
			//清楚session存储
			window.sessionStorage.clear()
		}
	},
	actions: {}
}