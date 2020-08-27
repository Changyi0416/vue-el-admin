<template>
	<div>
    <button-search>
      <template #left>
	      <el-button size="small" type="success" @click="addLevel">添加会员等级</el-button>
      </template>
      <template #right>
        <span class="mr-1" style="font-size: 14px;">选择升级标准：</span>
        <el-radio-group v-model="level" size="small">
          <el-radio-button :label="0">累计消费</el-radio-button>
          <el-radio-button :label="1">累计次数</el-radio-button>
        </el-radio-group>
      </template>
    </button-search>
		<el-table :data="tableData" style="width: 100%" border>
		  <el-table-column label="等级名称" prop="name"></el-table-column>
		  <el-table-column label="升级条件" align="center">
        <template slot-scope="scope">
          {{ getLevel.name + '：' + scope.row[getLevel.value] + getLevel.unit }}
        </template>
      </el-table-column>
		  <el-table-column label="折扣率（%）" prop="discount" align="center"></el-table-column>
		  <el-table-column label="等级序号" prop="level" align="center"></el-table-column>
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
					<el-link type="primary" :underline="false" class="mr-2" @click="editItem(scope.row)">修改</el-link>
					<el-link type="danger" :underline="false" @click="deleteItem(scope.row)">删除</el-link>
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
		<el-dialog title="添加会员等级" :visible.sync="userModel" top="3vh"
		:before-close="closeModel">
			<el-form ref="form" :model="form" :rules="formRule" size="medium" label-width="100px">
				<el-form-item label="等级名称" prop="name">
					<el-input v-model="form.name" style="width: 40%;" placeholder="请输入"></el-input>
					<small class="ml-3 text-secondary">设置会员等级名称</small>
				</el-form-item>
				<el-form-item label="等级序号" prop="level">
					<el-input-number v-model="form.level" :min="1" label=""></el-input-number>
					<br><small class="text-secondary">设置会员等级排序（此参数决定等级的高低，排序越大等级越高，请慎重选择）</small>
				</el-form-item>
				<el-form-item label="是否启用" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="升级条件">
					<el-form-item label="累积消费满" prop="max_price">
						<el-input type="number" v-model="form.max_price" placeholder="请输入" style="width: 180px;">
							<template slot="append">元</template>
						</el-input>
						<br><small class="text-secondary">设置会员等级所需要的累积消费必须大于等于0，单位：元</small>
					</el-form-item>
					<el-form-item label="累积次数满" prop="max_times">
						<el-input type="number" v-model="form.max_times" placeholder="请输入" style="width: 180px;">
							<template slot="append">笔</template>
						</el-input>
						<br><small class="text-secondary">设置会员等级所需要的购买量必须大于等于0，单位：笔</small>
					</el-form-item>
				</el-form-item>
				<el-form-item label="折扣率" prop="discount">
          <el-input type="number" v-model="form.discount" style="width: 180px;" placeholder="请输入">
						<template slot="append">%</template>
					</el-input>
					<br><small class="text-secondary">折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买</small>
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
				axiosSign: 'user_level',
				signText: '会员等级',
				level: 0,
				tableData: [],
				//编辑
				editId: 0,
				//弹出层
				userModel: false,
				//弹出层form
				form: {
					name: '',
					max_price: '',
					max_times: '',
					discount: '',
					level: 1,
					status: 1
				},
				formRule: {
					name: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
					level: [{ required: true, message: '请输入等级序号', trigger: 'blur' }],
					max_price: [{ required: true, message: '请输入累积消费', trigger: 'blur' }],
					max_times: [{ required: true, message: '请输入累积次数', trigger: 'blur' }],
					discount: [{ required: true, message: '请输入折扣率', trigger: 'blur' }],
					status: [{ required: true }]
				},
			}
		},
		computed: {
			getLevel(){
				let arr = [
					{ name: '累计消费', value: 'max_price', unit: '元' },
					{ name: '累计次数', value: 'max_times', unit: '笔' }
				]
				return arr[this.level]
			}
		},
		methods: {
			//添加规格
			addLevel(){
				this.userModel = true
			},
			//取消弹框
			closeModel(){
				this.userModel = false
				//表单初始化
				this.form = {
					name: '',
					max_price: '',
					max_times: '',
					discount: '',
					level: 1,
					status: 1
				}
			},
			//确定 ，提交表单，添加规格
			submitModel(){
				this.$refs.form.validate((valid) => {
					if (valid) {
						console.log(this.form)
						this.addOrEdit(this.form, this.editId)
					}
				});
			},
			//编辑项
			editItem(item){
				this.editId = item.id
				//编辑-给form表单赋值
				this.form = {
					name: item.name,
					max_price: item.max_price,
					max_times: item.max_times,
					discount: item.discount,
					level: item.level,
					status: item.status
				} 
				this.addLevel()
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
