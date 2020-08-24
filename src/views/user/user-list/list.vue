<template>
	<div>
    <button-search placeholder="手机号/邮箱/会员昵称">
      <template #left>
	      <el-button size="medium" type="success" @click="addUser">添加会员</el-button>
      </template>
      <template #form>
        <el-form ref="searchForm" :model="searchForm" label-width="80px" size="small">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="搜索内容">
                <el-input v-model="searchForm.keyword" placeholder="手机号/邮箱/会员昵称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="会员等级">
                <el-select v-model="searchForm.group" placeholder="请选择">
                  <!-- <el-option label="0" value="0"></el-option> -->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发布时间">
                <el-date-picker v-model="searchForm.time" type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-button size="mini" type="info" @click="search">搜索</el-button>
          <el-button size="mini" type="reset" @click="searchReset">清空筛选条件</el-button>
        </el-form>
      </template>
    </button-search>
		<el-table :data="tableData" style="width: 100%" border>
		  <el-table-column label="会员" prop="name">
        <template slot-scope="scope">
          <div class="d-flex align-items-center">
            <img :src="scope.row.avatar" alt="" style="width: 50px; height: 50px;" class="mr-2 rounded-circle">
            <div class="flex-grow-1">
              <p class="font-weight-bold">{{scope.row.username}}</p>
              <span>用户名id：{{scope.row.userid}}</span>
            </div>
            <el-link type="primary" :underline="false" class="ml-2">详情</el-link>
          </div>
        </template>
      </el-table-column>
		  <el-table-column label="会员等级" align="center">
        <template slot-scope="scope">
          {{['', '普通会员', '黄金会员'][scope.row.level]}}
        </template>
      </el-table-column>
		  <el-table-column label="注册/登录" align="center">
        <template slot-scope="scope">
          <span>注册时间：{{scope.row.create_time}}</span><br>
          <span>最后登录：{{scope.row.update_time}}</span>
        </template>
      </el-table-column>
		  <el-table-column label="状态" align="center" width="140">
		    <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
		    </template>
		  </el-table-column>
		  <el-table-column label="操作" width="160">
		    <template slot-scope="scope">
		      <el-button-group>
            <el-link type="primary" :underline="false" @click="editItem(scope.row, scope.$index)">修改</el-link>
            <el-link type="primary" :underline="false" @click="resetPass(scope.row, scope.$index)" class="mx-2">重置密码</el-link>
            <el-link type="danger" :underline="false" @click="deleteItem(scope.row, scope.$index)">删除</el-link>
		      </el-button-group>
		    </template>
		  </el-table-column>
		</el-table>
		<el-footer class="px-0 d-flex align-items-center position-fixed bg-white" 
		style="left:200px; right: 0; bottom: 0; z-index: 4;">
		  <div class="flex-grow-1 px-2 h-100 d-flex align-items-center">
		    <el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="currentPage"
		      :page-sizes="[10, 20, 30, 40]"
		      :page-size="10"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="40">
		    </el-pagination>
		  </div>
		</el-footer>
		<el-dialog title="添加会员" :visible.sync="userModel" top="3vh">
			<el-form ref="form" :model="form" :rules="formRule" size="medium" label-width="80px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="form.username" style="width: 80%;" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="form.password" style="width: 80%;" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="form.nickname" style="width: 80%;" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="头像">
          <div class="rounded d-flex align-items-center justify-content-center mr-3 mb-3 shopPic"
					:class="{'border': !hasAvatar}"
					@click="chooseImage">
						<img :src="form.avatar" v-if="hasAvatar" class="w-100 h-100" alt="">
						<i class="el-icon-plus" v-else style="font-size: 30px; color: rgb(207, 209, 212);"></i>
					</div>
				</el-form-item>
				<el-form-item label="等级" prop="level">
					<el-select v-model="form.level" placeholder="请选择">
            <el-option label="普通会员" :value="1"></el-option>
            <el-option label="黄金会员" :value="2"></el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="手机" prop="phone">
          <el-input type="number" v-model="form.phone" :maxlength="11" style="width: 80%;" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" style="width: 80%;" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex" size="medium">
            <el-radio-button :label="1">保密</el-radio-button>
            <el-radio-button :label="2">男</el-radio-button>
            <el-radio-button :label="3">女</el-radio-button>
          </el-radio-group>
				</el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closelModel">取 消</el-button>
				<el-button type="primary" @click="submitModel">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import buttonSearch from "@/components/common/button-search.vue";
	export default {
		inject: ['app'],
    components: {
      buttonSearch
		},
		computed: {
			hasAvatar() {
				return this.form.avatar !== ''
			}
		},
		data(){
			return {
        //高级搜索表单
        searchForm: {
          keyword: "",
          group: '',
          time: ''
        },
				tableData: [
					{
						id: 1,
            username: '用户名',
            userid: 546456547556,
            avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            level: 1,
            create_time: '2019-07-24 13:00:00',
            update_time: '2019-07-24 13:00:00',
						status: 1
					},
				],
				checkedSku: [],
				//编辑
				editSkuState: false,
				editSkuI: -1,
				//弹出层
				userModel: false,
				//弹出层form
				form: {
					username: '',
					password: '',
					nickname: '',
					avatar: '',
					level: '',
					phone: '',
					email: '',
					sex: 1,
					status: 1
				},
				formRule: {
					name: [
						{ required: true, message: '请输入规格名称', trigger: 'blur' }
					],
					value: [
						{ required: true, message: '请输入规格值', trigger: 'blur' }
					],
				},
				//分页
				currentPage: 1
			}
		},
		methods: {
      search(){},
      searchReset(){},
			//添加规格
			addUser(){
				this.userModel = true
			},
			//添加图片
			chooseImage(){
				this.app.chooseImage(res => {
					this.form.avatar = res[0].img
				}, 1)
			},
			//取消弹框
			closelModel(){
				//表单初始化
				this.form = {
					username: '',
					password: '',
					nickname: '',
					avatar: '',
					level: '',
					phone: '',
					email: '',
					sex: 1,
					status: 1
				}
				this.userModel = false
			},
			//确定 ，提交表单，添加规格
			submitModel(){
				this.$refs.form.validate((valid) => {
					if (valid) {
						//编辑
						if(this.editSkuState) {
							let item = this.tableData[this.editSkuI]
							item.username = this.form.username
							item.password = this.form.password
							item.nickname = this.form.nickname
							item.avatar = this.form.avatar
							item.level = this.form.level
							item.phone = this.form.phone
							item.email = this.form.email
							item.sex = this.form.sex
							item.status = this.form.status
							//重置
							this.editSkuState = false
							this.editSkuI = -1
						}else {
							//新增
							this.tableData.unshift(this.form) 
						}
						this.closelModel()
						this.$message({ type: 'success', message: '操作成功' })
					}
				});
			},
			//修改启用、禁用状态
			changeStatus(row){
				row.status = row.status ? 0 : 1
				let str = row.status ? '启用' : '禁用'
				this.$message({type: 'success', message: `${str}成功`})
			},
			//编辑项
			editItem(item, i){
				this.editSkuState = true
				this.editSkuI = i
				//编辑-给form表单复制
				this.form = {
					username: item.username,
					password: item.password,
					nickname: item.nickname,
					avatar: item.avatar,
					level: item.level,
					phone: item.phone,
					email: item.email,
					sex: item.sex,
					status: item.status,
				} 
				this.addUser()
      },
      //重置密码
      resetPass(){},
			//删除项
			deleteItem(i){
				this.$confirm('是否删除该规格', '提示', {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
				.then(() => {
					this.tableData.splice(i, 1)
					this.$message({type: 'success', message: '删除成功'})
				})
				.catch(() => {})
			},
			//分页
			handleSizeChange(val) {
			  console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
			  console.log(`当前页: ${val}`);
			},
		}
	}
</script>

<style scoped>
.el-dialog__body {
	padding: 10px 20px !important;
}
.el-dialog__body .el-form-item {
	margin-bottom: 16px;
}
.el-radio {
	margin-right: 14px;
}

/* 头像 */
.shopPic {
	width: 120px; 
	height: 120px; 
	cursor: pointer; 
}
</style>
