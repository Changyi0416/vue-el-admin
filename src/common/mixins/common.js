export default {
	data(){
		return {
			axiosSign: '', //请求接口模块标识
			signText: '项', //提示语标识
			isLoading: true,
			checkedArr: [], //被选中的数据
			//分页
			page: {
				current: 1, //当前所在页数
				sizes: [5, 10, 20, 50],
				size: 10, //一页显示多少条
				total: 0, //总数量
			}
		}
	},
  filters: {
    numToString: function (num) {
      return num.toString();
    }
  },
	created(){
		this.__init()
	},
	methods: {
		//默认请求列表接口url
		__initUrl(searchParams){
			let url = `/admin/${this.axiosSign}/${this.page.current}?limit=${this.page.size}`
			if(searchParams) url = url + searchParams
			return url
		},
		//处理返回的数据
		handleData(Data){
			this.tableData = Data.list
			/* if(this.axiosSign == 'goods_comment'){
				this.tableData.forEach(item => {
					if(!item.goods_item){
						item.goods_item = {
							title: '商品名称',
							cover: 'http://static.yoshop.xany6.com/2018071718294208f086786.jpg'
						}
						item.user.avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
					}
				})
			} */
		},
		//获取列表数据
		__init(searchParams){
			if(this.axiosSign == '') return 
			if(this.isLoading) this.layout.showLoading()
			let url = this.__initUrl(searchParams)
			this.axios.get(url, { token: true })
			.then(res => {
				let Data = res.data.data
				console.log(Data)
				if(this.isLoading) this.layout.hideLoading()
				this.handleData(Data) //处理返回的数据
				this.page.total = Data.totalCount
			})
			.catch(err => this.layout.hideLoading())
		},
		//新增|编辑
		addOrEdit(params, id){
			let url = id > 0 ? `/admin/${this.axiosSign}/${id}` : `/admin/${this.axiosSign}`
			this.axios.post(url, params, { token: true })
			.then(res => {
				this.__init()
			})
			this.closeModel()
			this.$message({ type: 'success', message: '操作成功' })
		},
		//修改启用、禁用状态
		changeStatus(row){
			let status = row.status ? 0 : 1
			let str = status ? '启用' : '禁用'
			this.axios.post(`/admin/${this.axiosSign}/${row.id}/update_status`, 
			{ status: status }, { token: true })
			.then(res => {
				row.status = status
				this.$message({type: 'success', message: `${str}成功`})
			})
		},
		//删除项
		deleteItem(item){
			this.$confirm(`是否删除该${this.signText}`, '提示', {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
			.then(() => {
				this.axios.post(`/admin/${this.axiosSign}/${item.id}/delete`, {}, { token: true })
				.then(res => {
					this.$message({type: 'success', message: '删除成功'})
					this.__init()
				})
				.catch(() => {});
			})
			.catch(() => {});
		},
		//多选
		selectChange(val) {
		  this.checkedArr = val;
		},
		//批量删除
		deleteMore(){
			if(!this.checkedArr.length) {
				this.$message.error('请先选择需要删除的信息')
				return
			}
			this.$confirm(`是否删除选中的${this.signText}`, '提示', {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
			.then(() => {
				let ids = this.checkedArr.map(item => {
					return item.id
				})
				this.axios.post(`/admin/${this.axiosSign}/delete_all`, { ids }, { token: true })
				.then(res => {
					this.__init()
				})
				.catch(() => {
					this.$refs.table.clearSelection()
				})
			})
			.catch(() => {
				this.$refs.table.clearSelection()
			})
		},
		//分页(每页几条)
		pageSizeChange(val) {
			this.page.size = val
			this.__init()
		},
		//页码切换
		pageCurrentChange(val) {
			this.page.current = val
			this.__init()
		},
	}
}