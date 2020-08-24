export default {
	data(){
		return {
			axiosSign: '', //请求接口模块标识
			sign: '', //提示语标识
			checkedArr: [], //被选中的数据
			//分页
			page: {
				current: 1, //当前所在页数
				sizes: [5, 10, 20, 50],
				size: 5, //一页显示多少条
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
		__initUrl(){
			return `/admin/${this.axiosSign}/${this.page.current}?limit=${this.page.size}`
		},
		//处理返回的数据
		handleData(Data){
			this.tableData = Data.list
		},
		//获取列表数据
		__init(){
			if(this.axiosSign == '') return 
			this.layout.showLoading()
			let url = this.__initUrl()
			this.axios.get(url, { token: true })
			.then(res => {
				let Data = res.data.data
				this.layout.hideLoading()
				this.handleData(Data) //处理返回的数据
				this.page.total = Data.totalCount
			})
			.catch(err => this.layout.hideLoading())
		},
		//新增|删除
		addOrEdit(params, id){
			let url = id ? `/admin/${this.axiosSign}/${id}` : `/admin/${this.axiosSign}`
			this.axios.post(url, params, { token: true })
			.then(res => {
				this.__init()
			})
			this.closelModel()
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
			this.$confirm('是否删除该规格', '提示', {
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
			this.$confirm('是否删除选中的规格', '提示', {
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