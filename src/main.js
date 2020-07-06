import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//引入logo等项目信息的配置文件
import $conf from './common/config/config.js'

Vue.use(ElementUI)
Vue.prototype.$conf = $conf;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
