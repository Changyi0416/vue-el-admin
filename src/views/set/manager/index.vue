<template>
  <div>
    <el-tabs v-model="axiosSign" >
      <el-tab-pane label="管理员列表" name="manager">
        <div class="d-flex align-items-center mb-2">
          <el-button class="mb-2" type="primary" @click="addModel" size="medium" v-auth="'添加用户'">添加管理员</el-button>
          <div class="d-flex ml-auto">
            <el-input class="mr-2" v-model="key" placeholder="请输入" size="medium"></el-input>
            <el-button type="info" @click="search" size="medium">搜索</el-button>
          </div>
        </div>
        <el-table :data="tableData" border>
          <el-table-column label="用户头像" prop="name" width="120px" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" alt="" style="width: 60px; height: 60px; border-radius: 50%;">
            </template>
          </el-table-column>
          <el-table-column label="登录账号">
            <template slot-scope="scope">
              {{ scope.row.username }}  
            </template>  
          </el-table-column>
          <el-table-column label="手机号" prop="phone"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="所属用户组">
            <template slot-scope="scope">
              <!-- {{scope.row.group.name}} -->
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template>
              <el-link type="primary" :underline="false" class="mr-2" @click="editItem(scope.row, scope.$index)">修改</el-link>
              <el-link type="primary" :underline="false" class="mr-2" @click="resetPassItem(scope.row, scope.$index)">重置密码</el-link>
              <el-link type="danger" :underline="false" @click="deleteItem(scope.row, scope.$index)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="角色列表" name="role">
        <el-button class="mb-2" type="primary" @click="addModel" size="medium" v-auth="'添加角色'">添加角色</el-button>
        <el-table :data="groupData" border stripe>
          <el-table-column label="角色名称" prop="name" align="center"></el-table-column>
          <el-table-column label="添加时间" prop="time" align="center"></el-table-column>
          <el-table-column label="状态" width="150px">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template>
              <el-link type="primary" :underline="false" class="mr-2" @click="groupEdit(scope.row, scope.$index)">修改</el-link>
              <el-link type="primary" :underline="false" class="mr-2" @click="groupConfig(scope.row, scope.$index)">配置权限</el-link>
              <el-link type="danger" :underline="false" @click="groupDelete(scope.row, scope.$index)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="权限列表" name="rule">
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
      </el-tab-pane>
    </el-tabs>
    <el-footer class="px-0 d-flex align-items-center position-fixed bg-white"
    style="left:200px; right: 0; bottom: 0; z-index: 4;">
      <div class="flex-grow-1 px-2 h-100 d-flex align-items-center">
        <el-pagination v-if="axiosSign != 'rule'"
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange"
          :current-page="page.current"
          :page-sizes="page.sizes"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </div>
    </el-footer>
  </div>
</template>

<script>
	import common from '@/common/mixins/common.js';
  export default {
		mixins: [ common ],
		inject: [ 'layout', 'app' ],
    data() {
      return {
				axiosSign: 'manager', //请求接口模块标识
				signText: '管理员', //提示语标识
        key: '',
        tableData: [],
        groupData: [{
          name: '超级管理员',
          time: '2020-08-17 00:00:00', 
          status: 0, //启用
        }],

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
      }
    },
    methods: {
      search(){},
      addModel(){},
      editItem(){},
      resetPassItem(){},
      deleteItem(){},
      groupEdit(){},
      groupConfig(){},
      groupDelete(){},
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
			},
      onSubmit(){},
    },
  }
</script>

<style scoped>

</style>