<template>
	<div>
    <button-search placeholder="手机号/邮箱/会员昵称" hasSearchSenior @search="search">
      <template #left>
	      <el-button size="small" type="success" @click="addUser">添加会员</el-button>
      </template>
      <template #form>
        <el-form ref="searchForm" :model="searchForm" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="搜索内容">
                <el-input v-model="searchForm.keyword" placeholder="手机号/邮箱/会员昵称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="会员等级">
                <el-select v-model="searchForm.user_level_id" placeholder="请选择">
                  <el-option v-for="(item, i) in userLevel" :key="i" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="发布时间">
                <el-date-picker v-model="searchForm.time" type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col> -->
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
            <div class="mr-2 rounded-circle" style="width: 60px; height: 60px; border: 1px #f1f1f1 dashed;">
							<img :src="scope.row.avatar" alt="" class="w-100 h-100 rounded-circle">
						</div>
            <div class="flex-grow-1">
              <p class="font-weight-bold">{{scope.row.username}}</p>
              <span>用户名id：{{scope.row.id}}</span>
            </div>
            <el-link type="primary" :underline="false" class="ml-2">详情</el-link>
          </div>
        </template>
      </el-table-column>
		  <el-table-column label="会员等级" align="center">
        <template slot-scope="scope">
					{{scope.row.user_level.name}}
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
					<el-button class="mb-1" plain size="mini"
						:type="scope.row.status ? 'success' : 'danger'"
						@click="changeStatus(scope.row)"
					>{{scope.row.status ? '启用' : '禁用'}}</el-button>
		    </template>
		  </el-table-column>
		  <el-table-column label="操作" width="140" align="center">
		    <template slot-scope="scope">
		      <el-button-group>
            <el-link type="primary" :underline="false" @click="editItem(scope.row)" class="mr-2">修改</el-link>
            <el-link type="danger" :underline="false" @click="deleteItem(scope.row)">删除</el-link>
		      </el-button-group>
		    </template>
		  </el-table-column>
		</el-table>
		<div style="height: 60px;"></div>
		<el-footer class="px-0 d-flex align-items-center position-fixed bg-white" 
		style="left:200px; right: 0; bottom: 0; z-index: 4;">
		  <div class="flex-grow-1 px-2 h-100 d-flex align-items-center">
		    <el-pagination
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
		<el-dialog title="添加会员" :visible.sync="userModel" top="3vh"
		:before-close="closeModel">
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
				<el-form-item label="头像" prop="avatar">
          <div class="rounded d-flex align-items-center justify-content-center mr-3 mb-3 shopPic"
					:class="{'border': !hasAvatar}"
					@click="chooseImage">
						<img :src="form.avatar" v-if="hasAvatar" class="w-100 h-100" alt="">
						<i class="el-icon-plus" v-else style="font-size: 30px; color: rgb(207, 209, 212);"></i>
					</div>
				</el-form-item>
				<el-form-item label="等级" prop="user_level_id">
					<el-select v-model="form.user_level_id" placeholder="请选择">
						<el-option v-for="(item, i) in userLevel" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="手机" prop="phone">
          <el-input type="number" v-model="form.phone" :maxlength="11" style="width: 80%;" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" style="width: 80%;" placeholder="请输入"></el-input>
				</el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeModel">取 消</el-button>
				<el-button type="primary" @click="submitModel">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import buttonSearch from "@/components/common/button-search.vue";
	import common from '@/common/mixins/common.js';
	export default {
		inject: ['app', 'layout'],
		mixins: [ common ],
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
				axiosSign: 'user',
				signText: '会员',
        //高级搜索表单
        searchForm: {
          keyword: "",
          user_level_id: '',
        },
				tableData: [],
				userLevel: [],
				//编辑
				editId: 0,
				//弹出层
				userModel: false,
				//弹出层form
				form: {
					username: '',
					password: '',
					nickname: '',
					avatar: '',
					user_level_id: '',
					phone: '',
					email: '',
					status: 1,
				},
				formRule: {
					username: [{required: true, message: '请输入用户名', trigger: 'blur'},
						{pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: '用户名至少4个字符，支持字母，数字，下划线，减号', trigger: 'blur'}
					],
					password: [{required: true, message: '请输入密码', trigger: 'blur', trigger: 'blur'},
						{
							pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,12}$/, 
							message: '密码至少8-16个字符，至少包含1个大写字母，1个小写字母和1个数字', 
							trigger: 'blur'
						}
					],
					nickname: [{required: true, message: '请输入昵称', trigger: 'blur'},
						{pattern: /^/, message: '', trigger: 'blur'}
					],
					avatar: [{required: true, message: '请选择用户头像', trigger: 'blur'}],
					user_level_id: [{required: true, message: '请选择会员等级', trigger: 'blur'}],
					phone: [{required: true, message: '请输入手机号', trigger: 'blur'},
						{pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/, message: '手机号错误', trigger: 'blur'}
					],
					email: [{required: true, message: '请输入邮箱', trigger: 'blur'},
						{pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, message: '邮箱格式错误', trigger: 'blur'}
					],
					status: [{required: true}],
				},
			}
		},
		methods: {
			//赋值数据
			handleData(Data){
				this.tableData = Data.list
				this.userLevel = Data.user_level
			},
			//搜索
      search(keyword){
				if(typeof keyword !== 'string') {
					keyword = this.searchForm.keyword
				}
				this.__init(`&keyword=${keyword}&user_level_id=${this.searchForm.user_level_id}`)
			},
			//清空筛选条件
      searchReset(){
				this.searchForm = {
				  keyword: "",
				  user_level_id: '',
				}
			},
			//添加规格
			addUser(){
				this.userModel = true
			},
			//添加图片
			chooseImage(){
				this.app.chooseImage(res => {
					console.log(res)
					this.form.avatar = res[0].url
				}, 1)
			},
			//取消弹框
			closeModel(){
				//表单初始化
				this.form = {
					username: '',
					password: '',
					nickname: '',
					avatar: '',
					user_level_id: '',
					phone: '',
					email: '',
					status: 1
				}
				this.userModel = false
			},
			//确定 ，提交表单，添加规格
			submitModel(){
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.addOrEdit(this.form, this.editId)
						this.editId = 0 //编辑id 初始化
					}
				});
			},
			//编辑项
			editItem(item){
				this.editId = item.id
				//编辑-给form表单赋值
				this.form = {
					username: item.username,
					password: "",
					nickname: item.nickname,
					avatar: item.avatar,
					user_level_id: item.user_level_id,
					phone: item.phone,
					email: item.email,
					status: item.status,
				} 
				this.addUser()
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
/* 时间控件 */
.el-range-editor--medium.el-input__inner {
	width: 100%;
}
/* 头像 */
.shopPic {
	width: 120px; 
	height: 120px; 
	cursor: pointer; 
}
</style>
