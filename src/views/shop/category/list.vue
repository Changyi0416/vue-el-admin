<template>
	<div>
		<el-button class="py-2 mb-2" type="primary" @click="create" size="medium">创建顶级分类</el-button>
		<el-tree ref="tree" :data="data" :props="defaultProps" 
		:default-expand-all="true"
		:expand-on-click-node="false"
		draggable
		@node-click="handleNodeClick"
		@node-drag-end="nodeDragEnd"
		@node-drop="nodeDrop">
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<div>
					<el-input v-model="data.name" :autofocus="false" v-if="data.editStatus" size="mini" style="width: 200px;"></el-input>
					<span v-else>{{ data.name }}</span>
				</div>
				<span>
					<el-button plain size="mini" :type="data.status ? 'success' : 'warning'"
					@click.stop="isShow(data)">{{ data.status ? '显示' : '隐藏' }}</el-button>
					<el-button type="success" size="mini" 
					@click.stop="append(data)">增加</el-button>
					<el-button :type="data.editStatus ? '' : 'warning'" size="mini" 
					@click.stop="edit(data)">
						{{data.editStatus ? '完成' : '修改'}}
					</el-button>
					<el-button type="danger" size="mini" 
					@click.stop="remove(node, data)">删除</el-button>
				</span>
			</span>
		</el-tree>
	</div>
</template>

<script>
	export default {
		inject: ['layout'],
		data() {
			return {
				defaultId: 3,
				data: [],
				/* data: [{
					id: 1,
					status: 1,
					editStatus: false,
					label: '一级 1',
					children: [{
						id: 12,
						status: 1,
						editStatus: false,
						label: '二级 1-1',
						children: [{
							id: 13,
							status: 1,
							editStatus: false,
							label: '三级 1-1-1'
						}]
					}]
				}, {
					id: 2,
					status: 1,
					editStatus: false,
					label: '一级 2',
					children: [{
						id: 21,
						status: 1,
						editStatus: false,
						label: '二级 2-1',
						children: [{
							id: 211,
							status: 1,
							editStatus: false,
							label: '三级 2-1-1'
						}]
					}, {
						id: 22,
						status: 1,
						editStatus: false,
						label: '二级 2-2',
						children: [{
							id: 221,
							status: 1,
							editStatus: false,
							label: '三级 2-2-1'
						}]
					}]
				}], */
				defaultProps: {
					children: 'child',
					label: 'name'
				},
				//分支里新增分支
				isAdd: false,
				//新增分支的基本值
				addChildren: {
					category_id: 0,
					status: 0,
					name: '', 
					editStatus: true
				}
			};
		},
		created(){
			this.__init()
		},
		computed: {
			drapSort(){
				let newData = []
				let sortData = function(arr){
					arr.forEach(item => {
						newData.push(item)
						if(item.child && item.child.length){
							sortData(item.child)
						}
					})
				}
				sortData(this.data)
				newData = newData.map((item, i) => {
					return {
						name: item.name,
						id: item.id,
						order: i,
						category_id: item.category_id
					}
				})
				return newData
			}
		},
		methods: {
			//初始化获取树状分类
			__init(){
				this.layout.showLoading()
				this.axios.get('/admin/category', { token: true })
				.then(res => {
					let data = res.data.data
					let addEditStatus = function(arr){
						arr.forEach(item => {
							item.editStatus = false
							if(item.child.length){
								addEditStatus(item.child)
							}
						})
					}
					addEditStatus(data)
					this.data = data
					this.layout.hideLoading()
				})
				.catch(err => this.layout.hideLoading())
			},
			handleNodeClick(data) {
				console.log(data);
			},
			//创建顶级分类
			create(){
				this.$prompt('请输入顶级分类名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
					inputErrorMessage: '顶级分类名称不可为空'
				})
				.then((val) => {
					let newChildren = {
						category_id: 0,
						status: 0,
						name: val.value, 
						editStatus: true
					}
					this.axios.post('/admin/category', newChildren, { token: true })
					.then(res => {
						this.$message({type: 'success', message: '创建成功'})
						this.__init()
					})
				})
				.catch(() => {})
			},
			//显示、隐藏
			isShow(data){
				this.layout.showLoading()
				let status = data.status ? 0 : 1
				let msg = status ? '显示' : '隐藏'
				this.axios.post(`/admin/category/${data.id}/update_status`, { status: data.status ? 0 : 1 }, { token: true })
				.then(res => {
					data.status = status
					this.$message({
						message: msg + '成功',
						type: 'success'
					});
					this.layout.hideLoading()
				})
				.catch(err => this.layout.hideLoading())
			},
			//新增
			append(data){
				console.log(data)
				this.addChildren.category_id = data.id
				this.addChildren.name = ''
				this.isAdd = true
				if(!data.child) this.$set(data, 'child', [])
				data.child.push(this.addChildren) 
			},
			//删除
			remove(node, data){
				this.$confirm('是否删除该分类', '提示', {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
				.then(() => {
					this.axios.delete(`/admin/category/${data.id}`, { token: true })
					.then(res => {
						console.log(res)
						this.$message({type: 'success', message: '删除成功'})
						this.__init()
					})
				})
				.catch(() => {})
			},
			//编辑/完成
			edit(data){
				if(data.editStatus){
					if(this.isAdd){
						//新建完成事件
						this.axios.post('/admin/category', this.addChildren, { token: true })
						.then(res => {
							console.log(res)
							this.isAdd = false 
							this.__init()
						})
						return
					}
					//编辑完成事件
					let params = {
						status: data.status,
						name: data.name,
						category_id: data.category_id
					}
					this.axios.post(`/admin/category/${data.id}`, params, { token: true })
					.then(res => {
						data.editStatus = false
						this.__init()
					})
				}else data.editStatus = true
			},
			//拖拽结束
			nodeDragEnd(...options){
				let item = options[0].data //被拖拽的节点数据
				let obj = options[1].data //结束拖拽时最后进入的节点数据
				if(obj){
					if(options[2] == 'before' || options[2] == 'after'){
						item.category_id = obj.category_id
					}else item.category_id = obj.id //options[2] == 'inner'
				}
			},
			//拖拽
			nodeDrop(...options){
				console.log(this.drapSort);
				this.axios.post('/admin/category/sort', {
					sortdata: JSON.stringify(this.drapSort)
				}, { token: true })
				.then(res => {
					console.log(res)
					this.$message({type: 'success', message: '排序成功'})
					this.__init()
				})
			}
		}
	}
</script>

<style>
.custom-tree-node {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 8px;
}
.el-tree-node__content {
	height: 40px;
	padding: 10px 0;
	border-bottom: 1px #efefef solid;
}
</style>