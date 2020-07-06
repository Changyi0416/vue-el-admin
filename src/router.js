import Vue from 'vue'
import Router from 'vue-router'

import routes from './common/config/router'

//解决路由重复的报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);

export default new Router({
    routes
})

