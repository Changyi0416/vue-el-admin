<template>
	<div>
    <button-search>
      <template #left>
	      <el-button size="medium" type="success" @click="addLevel">添加会员等级</el-button>
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
		  <el-table-column label="折扣率（%）" prop="discont" align="center"></el-table-column>
		  <el-table-column label="等级序号" prop="level" align="center"></el-table-column>
		  <el-table-column label="状态" align="center" width="140">
		    <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
		    </template>
		  </el-table-column>
		  <el-table-column label="操作" width="160">
		    <template slot-scope="scope">
					<el-link type="primary" :underline="false" class="mr-2" @click="editItem(scope.row, scope.$index)">修改</el-link>
					<el-link type="danger" :underline="false" @click="deleteItem(scope.row, scope.$index)">删除</el-link>
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
		<el-dialog title="添加会员等级" :visible.sync="userModel" top="3vh">
			<el-form ref="form" :model="form" :rules="formRule" size="medium" label-width="100px">
				<el-form-item label="等级名称" prop="name">
					<el-input v-model="form.name" style="width: 40%;" placeholder="请输入"></el-input>
					<small class="ml-3 text-secondary">设置会员等级名称</small>
				</el-form-item>
				<el-form-item label="登记权重" prop="level">
					<el-input-number v-model="form.level" :min="1" label=""></el-input-number>
					<br><small class="text-secondary">设置会员等级排序（此参数决定等级的高低，排序越大等级越高，请慎重选择）</small>
				</el-form-item>
				<el-form-item label="是否启用" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="升级条件">
					<el-form-item label="累积消费满" prop="consume">
						<el-input type="number" v-model="form.consume" placeholder="请输入" style="width: 180px;">
							<template slot="append">元</template>
						</el-input>
						<small class="ml-3 text-secondary">设置会员等级所需要的累积消费必须大于等于0，单位：元</small>
					</el-form-item>
					<el-form-item label="累积次数满" prop="times">
						<el-input type="number" v-model="form.times" placeholder="请输入" style="width: 180px;">
							<template slot="append">笔</template>
						</el-input>
						<small class="ml-3 text-secondary">设置会员等级所需要的购买量必须大于等于0，单位：笔</small>
					</el-form-item>
				</el-form-item>
				<el-form-item label="折扣率" prop="discont">
          <el-input type="number" v-model="form.discont" style="width: 180px;" placeholder="请输入">
						<template slot="append">%</template>
					</el-input>
					<br><small class="text-secondary">折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买</small>
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
				level: 0,
				tableData: [
					{
						name: '普通会员',
						consume: 100,
						times: 10,
						discont: 10,
						level: 1,
						status: 1, //启用
						create_time: ''
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
					name: '',
					consume: '',
					times: '',
					discont: '',
					level: 1,
					status: 1
				},
				formRule: {
					name: [{ required: true, message: '请输入规格名称', trigger: 'blur' }]
				},
				//分页
				currentPage: 1
			}
		},
		computed: {
			getLevel(){
				let arr = [
					{ name: '累计消费', value: 'consume', unit: '元' },
					{ name: '累计次数', value: 'times', unit: '笔' }
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
			closelModel(){
				this.userModel = false
				//表单初始化
				this.form = {
					name: '',
					consume: '',
					times: '',
					discont: '',
					level: 1,
					status: 1
				}
			},
			//确定 ，提交表单，添加规格
			submitModel(){
				this.$refs.form.validate((valid) => {
					if (valid) {
						//编辑
						if(this.editSkuState) {
							let item = this.tableData[this.editSkuI]
							item.name = this.form.name
							item.consume = this.form.consume
							item.times = this.form.times
							item.discont = this.form.discont
							item.level = this.form.level
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
					name: item.name,
					consume: item.consume,
					times: item.times,
					discont: item.discont,
					level: item.level,
					status: item.status
				} 
				this.addLevel()
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
				.catch(e => e)
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
