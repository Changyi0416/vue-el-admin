<template>
	<div>
		<el-button class="py-2" type="primary" @click="create" size="mini">创建顶级分类</el-button>
		<el-tree ref="tree" :data="data" :props="defaultProps" 
		:default-expand-all="true"
		:expand-on-click-node="false"
		draggable
		@node-click="handleNodeClick"
		@node-drop="nodeDrop">
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<div>
					<el-input v-model="data.label" v-if="data.editStatus" size="mini" style="width: 200px;"></el-input>
					<span v-else>{{ data.label }}</span>
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
		data() {
			return {
				defaultId: 3,
				data: [{
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
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			};
		},
		methods: {
			handleNodeClick(data) {
				console.log(data);
			},
			//创建顶级分类
			create(){
				this.$prompt('请输入分类名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
					inputErrorMessage: '分类名称不可为空'
				})
				.then((val) => {
					console.log(val)
				})
			},
			//显示、隐藏
			isShow(data){
				data.status = data.status ? 0 : 1
			},
			//新增
			append(data){
				const newChildren = {
					id: this.defaultId++, 
					status: 1,
					editStatus: true,
					label: 'testText', 
					children: []
				}
				if(!data.children) this.$set(data, 'children', [])
				data.children.push(newChildren)
			},
			//删除
			remove(node, data){
				this.$confirm('是否删除该分类', '提示', {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
				.then(() => {
					let parent = node.parent
					let children = parent.data.children || parent.data
					let index = children.findIndex(v => v.id === data.id)
					children.splice(index, 1)
					this.$message({type: 'success', message: '删除成功'})
				})
			},
			//编辑/提交
			edit(data){
				data.editStatus = !data.editStatus
			},
			//拖拽
			nodeDrop(...options){
				// console.log(options);
				console.log(options[0].data); //被拖拽节点
				console.log(options[1].data); //被替换的节点
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
