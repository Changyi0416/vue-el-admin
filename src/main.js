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

//引入logo等项目信息的配置文件
import $conf from './common/config/config.js'

import { Message } from 'element-ui'
// 添加响应拦截器
axios.interceptors.response.use((res) => {
	// 对响应数据做点什么
	return res;
}, function (err) {
	//失败处理（提示）
	let fail = err.response
	if(fail && fail.data && fail.data.errorCode){
		Message.error(fail.data.msg);
	} 
	return Promise.reject(err);
});

Vue.prototype.$conf = $conf;

Vue.config.productionTip = false

new Vue({
  router,
  store, 
  render: h => h(App),
}).$mount('#app')
