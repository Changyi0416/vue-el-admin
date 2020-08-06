<template>
	<div>
		<div class="mb-2">
			<el-button size="medium" type="success" @click="addSku">添加规格</el-button>
			<el-button size="medium" type="danger" @click="deleteMore">批量删除</el-button>
		</div>
		<el-table :data="tableData" style="width: 100%" border @selection-change="selectChange">
		  <el-table-column type="selection" fixed="left" align="center"></el-table-column>
		  <el-table-column label="规格名称" prop="name" align="center"></el-table-column>
		  <el-table-column label="规格值" prop="value" align="center"></el-table-column>
		  <el-table-column label="商品排序" prop="order" align="center"></el-table-column>
		  <el-table-column label="状态" align="center" width="140">
		    <template slot-scope="scope">
		      <el-button class="mb-1" plain size="mini"
					:type="scope.row.status ? 'success' : 'danger'"
					@click="changeStatus(scope.row)">
						{{scope.row.status ? '启用' : '禁用'}}
					</el-button>
					<br>
		    </template>
		  </el-table-column>
		  <el-table-column label="操作" width="160">
		    <template slot-scope="scope">
		      <el-button-group>
		        <el-button type="success" plain size="medium"
						@click="edit(scope.row, scope.$index)">编辑</el-button>
		        <el-button type="danger" plain size="medium" 
						@click="deleteItem(scope.$index)">删除</el-button>
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
		<el-dialog title="添加商品规格" :visible.sync="skuModel" top="3vh">
			<el-form ref="skuForm" :model="skuForm" :rules="skuFormRule" size="medium" label-width="80px">
				<el-form-item label="规格名称" prop="name">
					<el-input v-model="skuForm.name" style="width: 40%;" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="商品排序" prop="order">
					<el-input-number v-model="skuForm.order" :min="1"></el-input-number>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio v-model="skuForm.status" :label="1" border>启用</el-radio>
					<el-radio v-model="skuForm.status" :label="0" border>禁用</el-radio>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-radio v-model="skuForm.type" :label="1" border>文字</el-radio>
					<el-radio v-model="skuForm.type" :label="2" border>颜色</el-radio>
					<el-radio v-model="skuForm.type" :label="3" border>图片</el-radio>
				</el-form-item>
				<el-form-item label="规格值" prop="value">
					<el-input type="textarea" v-model="skuForm.value" style="width: 60%;" placeholder="请输入" :rows="3"></el-input>
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
	export default {
		data(){
			return {
				tableData: [
					{
						id: 1,
						name: '名称',
						value: '值',
						order: 1,
						status: 1,
						type: 1
					},
					{
						id: 2,
						name: '名称2',
						value: '值2',
						order: 2,
						status: 0,
						type: 2
					},
				],
				checkedSku: [],
				//编辑
				editSkuState: false,
				editSkuI: -1,
				//弹出层
				skuModel: false,
				skuForm: {
					name: '',
					value: '',
					order: 50,
					status: 1,
					type: 1
				},
				skuFormRule: {
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
			//添加规格
			addSku(){
				this.skuModel = true
			},
			//取消弹框
			closelModel(){
				//表单初始化
				this.skuForm = {
					name: '',
					value: '',
					order: 50,
					status: 1,
					type: 1
				}
				this.skuModel = false
			},
			//确定 ，提交表单，添加规格
			submitModel(){
				this.$refs.skuForm.validate((valid) => {
					if (valid) {
						this.skuForm.value = 	this.skuForm.value.replace(/\n/g, ',')
						//编辑
						if(this.editSkuState) {
							let item = this.tableData[this.editSkuI]
							item.name = this.skuForm.name
							item.value = this.skuForm.value
							item.order = this.skuForm.order
							item.status = this.skuForm.status
							item.type = this.skuForm.type
							//重置
							this.editSkuState = false
							this.editSkuI = -1
						}else {
							//新增
							this.tableData.unshift(this.skuForm) 
						}
						this.closelModel()
						this.$message({ type: 'success', message: '操作成功' })
					}
				});
			},
			//多选
			selectChange(val) {
			  this.checkedSku = val;
			  console.log(this.checkedSku);
			},
			//批量删除
			deleteMore(){
				this.checkedSku.forEach(item => {
					let i = this.tableData.findIndex(v => item.id == v.id)
					this.tableData.splice(i, 1)
				})
			},
			//修改启用、禁用状态
			changeStatus(row){
				row.status = row.status ? 0 : 1
				let str = row.status ? '启用' : '禁用'
				this.$message({type: 'success', message: `${str}成功`})
			},
			//编辑项
			edit(item, i){
				this.editSkuState = true
				this.editSkuI = i
				this.skuForm = {
					name: item.name,
					value: item.value.replace(/,/g, '\n'),
					order: item.order,
					status: item.status,
					type: item.type
				}
				this.addSku()
			},
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
</style>
