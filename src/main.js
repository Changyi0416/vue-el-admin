import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import router from './router.js'
//引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
//引入拖拽排序
import VueDND from 'awe-dnd'
Vue.use(VueDND)
//引入Vuex的store库
import store from './store'
//防多次点击，重复提交
import preventReClick from './common/preventReClick.js' 

//引入logo等项目信息的配置文件
import $conf from './common/config/config.js'

import { Message } from 'element-ui'

//全局自定义变量（auth）权限验证
Vue.directive('auth', {
	inserted(el, binding, vnode, oldVnode){
		//获取用户权限
		let user = window.sessionStorage.getItem('user')
		user = user ? JSON.parse(user) : {}
		//如果不是管理员(user.super == 1为超级管理员)，将进行权限验证
		//用法(<el-button v-auth="'添加用户'">添加用户</el-button>)
		if(!user.super){ 
			let ruleNames = user.ruleNames ? user.ruleNames : []
			let index = ruleNames.findIndex(name => {
				return name == binding.value
			})
			if(index == -1) vnode.elm.hidden = true
		}
	}
})

function showLoading(){
	Message({type: 'warning', message: '加载中...'})
}
function hideLoading(){
	Message.close()
}
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
	if(config.token){
		config.headers['token'] = window.sessionStorage.getItem('token');
	}
	if(config.loading){
		showLoading();
	}
	return config;
}, function (error) {
	hideLoading()
	return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use((res) => {
	hideLoading()
	if(res.data.msg != 'ok') return Message.error('请求异常');
	return res;
}, function (err) {
	//失败处理（提示）
	let fail = err.response
	if(fail && fail.data && fail.data.errorCode){
		Message.error(fail.data.msg);
	} 
	hideLoading()
	return Promise.reject(err);
});

Vue.prototype.$conf = $conf;

Vue.config.productionTip = false

new Vue({
  router,
  store, 
  render: h => h(App),
}).$mount('#app')
