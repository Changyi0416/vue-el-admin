<template>
  <div>
    <el-container
      style="position: absolute; left: 0; right: 0; top: 0; bottom: 0px; overflow: hidden;"
    >
      <el-header class="d-flex align-items-center" style="background: rgb(84, 92, 100);">
        <a class="text-light h5 mb-0 mr-auto" style="cursor: pointer;">
					{{$conf.logo}}
				</a>
        <el-menu
          :default-active="navBar.activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="topSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item
            :index="i|numToString"
            v-for="(item, i) in navBar.list"
            :key="i"
          >{{item.name}}</el-menu-item>
          <el-submenu index="6">
            <template slot="title">
              <el-avatar
                size="small"
                class="mr-1"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              ></el-avatar>
							<span v-if="user.username">{{user.username}}</span>
            </template>
            <el-menu-item index="6-1">修改</el-menu-item>
            <el-menu-item index="6-2">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-container style="height: 100%;">
        <el-aside width="180px">
          <el-menu
            style="height: 100%;"
            :default-active="asideActiveIndex"
            class="el-menu-vertical-demo"
            @select="asideSelect"
          >
            <el-menu-item :index="i|numToString" v-for="(item, i) in asideMenus" :key="i">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="position-relative" style="padding-bottom: 80px;"
				v-loading="loading">
          <!-- 内容-面包屑 -->
          <div
            class="border-bottom bg-white mb-2"
            style="padding: 20px; margin: -20px;"
            v-if="breadcrumb.length > 0"
          >
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item
                :to="{ path: item.path }"
                v-for="(item, i) in breadcrumb"
                :key="i"
              >{{item.title}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <!-- 主内容 -->
          <router-view></router-view>
          <!-- 回到顶部 -->
          <el-backtop target=".el-main"></el-backtop>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import common from "@/common/mixins/common.js";
import { mapState } from 'vuex'
export default {
	provide(){
		return {
			layout: this
		}
	},
  mixins: [common],
  data() {
    return {
			loading: false,
			user: { username: '' },
			flag: true, //控制退出登录按钮的开关
      breadcrumb: []
    };
  },
  created() {
		//获取用户信息
		let user = window.sessionStorage.getItem('user');
		if(user) {
			this.user = JSON.parse(user)
			//菜单
			let menus = this.user.tree;
			this.$store.commit('menu/createMenu', menus)
		}
		else {
			this.$message.error('请登录')
			this.$router.push({name: 'login'})
		}
    //获取面包屑导航
    this.getRouterBran();
    //刷新页面时，主、侧导航位置依然在原位
    this.__initNavBarActive()
  },
  watch: {
    //解决路由变化，面包屑导航数据不自动变更的问题
		// '$route'(to, from){},
    $route() {
      //监听路由变化，执行面包屑函数
      this.getRouterBran()
      //存储主、侧导航的Index
      localStorage.setItem(
        "navBarActive",
        JSON.stringify({
          top: this.navBar.activeIndex,
          left: this.asideActiveIndex
        })
      );
    }
  },
  computed: {
		...mapState('menu', ['navBar']),
    asideActiveIndex: {
      get() {
        return (
          this.navBar.list[this.navBar.activeIndex].asideActiveIndex || "0"
        );
      },
      set(val) {
        this.navBar.list[this.navBar.activeIndex].asideActiveIndex = val
      }
    },
    asideMenus() {
      return this.navBar.list[this.navBar.activeIndex].asideList || []
    }
  },
  methods: {
		//显示内容区域加载
		showLoading(){
			this.loading = true
		},
		hideLoading(){
			this.loading = false
		},
    //刷新页面时，主、侧导航位置依然在原位
    __initNavBarActive() {
      let l = localStorage.getItem("navBarActive");
      if (l) l = JSON.parse(l);
      this.navBar.activeIndex = l.top
      this.asideActiveIndex = l.left
    },
    //获取面包屑导航
    getRouterBran() {
      //过滤掉没有name值得
      let a = this.$route.matched.filter(b => b.name);
      let arr = [];
      a.forEach((item) => {
        //首页不需要面包屑
        if (item.name === "index" || item.name === "layout") return;
        arr.push({
          title: item.meta.title,
          name: item.name,
          path: item.path
        });
      });
      if (arr.length > 0)
        arr.unshift({ name: "index", path: "/index", title: "后台首页" })
      this.breadcrumb = arr
      // console.log(arr)
    },
    //头部导航栏点击
    topSelect(key) {
      if(key === '6-1') {
        console.log('修改资料')
        return
      }
      else if(key === '6-2') {
				if(this.flag) {
					this.flag = false
					this.loginOut()
				}
				return 
      }
      this.navBar.activeIndex = key
      //默认跳转到当前激活
      if (this.asideMenus.length == 0) return
      this.$router.push({
        name: this.asideMenus[+this.asideActiveIndex].pathname
      });
    },
    //侧边栏导航点击
    asideSelect(key) {
      this.asideActiveIndex = key
      //跳转到当前页面
      this.$router.push({ name: this.asideMenus[+key].pathname })
    },
		//退出登录
		loginOut(){
			this.axios.post('/admin/logout', {}, {
				token: true,
				loading: true
			})
			.then(res => {
				this.$message({type: 'success', message: '退出成功'})
				this.flag = true
				this.$store.commit('user/loginOut')
				this.$router.push({name: 'login'})
			})
			.catch(err => {
				this.flag = true
				//清除登录状态
				this.$store.commit('user/loginOut')
				this.$router.push({name: 'login'})
			})
		}
  }
};
</script>

<style scoped>
</style>