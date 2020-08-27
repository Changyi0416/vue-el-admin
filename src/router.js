import Vue from 'vue'
import Router from 'vue-router'

import routes from './common/config/router'

//解决路由重复的报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);

const router = new Router({ routes })
//全局配置路由前置守卫
router.beforeEach((to, from, next) => {
	let user = window.sessionStorage.getItem('user')
	let token = window.sessionStorage.getItem('token')
	if(token) {//已登录
		//防止重复登录
		if(to.path == '/login') {
			Vue.prototype.$message.error('请勿重复登录')
			next({name: from.name ? from.name : 'index'})
			return
		}
		//...其他验证
		if(to.name !== 'error_404'){
			//超级管理员跳过验证
			user = user ? JSON.parse(user) : {}
			let userRole = user.super ? user.super : 0
			if(userRole) return next()
			//权限验证
			let rules = window.sessionStorage.getItem('rules');
			rules = rules ? JSON.parse(rules) : []
			let index = rules.findIndex(item => {
				return item.rule_id && item.desc == to.name
			})
			if(index == -1){
				Vue.prototype.$message.error('没有权限')
				return next({name: from.name ? from.name : 'error_404'})
			}
		}
		
		next()
	}else {
		//跳过登录页验证
		if(to.path == '/login') return next()
		//未登录
		Vue.prototype.$message.error('请先登录')
		next({path: '/login'})
	}
})

export default router


