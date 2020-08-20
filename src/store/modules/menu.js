export default {
	namespaced: true,
	state: {
		navBar: {
			activeIndex: "0",
			list: []
		}
	},
	getters: {},
	mutations: {
		//创建菜单
		createMenu(state, menus){
			let list = menus.map(item => {
				let asideList = item.child.map(v => {
					return {
						icon: v.icon,
						name: v.name,
						pathname: v.desc
					}
				})
				return {
					name: item.name,
					asideActiveIndex: "0",
					asideList: asideList
				}
			})
			state.navBar.list = list
			//将菜单数据储存
			window.sessionStorage.setItem('menus', JSON.stringify(state.navBar))
		}
	},
	actions: {}
}