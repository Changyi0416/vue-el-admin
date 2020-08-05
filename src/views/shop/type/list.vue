<template>
	<div>
		<div class="mb-2">
			<el-button class="btn" size="medium" type="success" @click="addType">添加类型</el-button>
			<el-button class="btn" size="medium" type="danger" @click="deleteMore">批量删除</el-button>
		</div>
		<el-table :data="tableData" style="width: 100%" border @selection-change="selectChange">
		  <el-table-column type="selection" fixed="left" align="center"></el-table-column>
		  <el-table-column label="类型名称" prop="name" align="center"></el-table-column>
		  <el-table-column label="属性标签" align="center">
				<template slot-scope="scope">{{scope.row.value_list | formatValue}}</template>
			</el-table-column>
		  <el-table-column label="属性排序" prop="order" align="center"></el-table-column>
		  <el-table-column label="状态" align="center" width="140">
		    <template slot-scope="scope">
		      <el-button class="btn mb-1" plain size="mini"
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
		        <el-button class="btn" type="success" plain size="medium"
						@click="edit(scope.row, scope.$index)">编辑</el-button>
		        <el-button class="btn" type="danger" plain size="medium" 
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
		<el-dialog title="添加商品类型" :visible.sync="typeModel" top="3vh" width="75%">
			<el-form ref="typeForm" :model="typeForm" :rules="typeFormRule" size="medium" label-width="80px">
				<el-form-item label="规格名称" prop="name">
					<el-input v-model="typeForm.name" style="width: 40%;" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="商品排序" prop="order">
					<el-input-number v-model="typeForm.order" :min="1"></el-input-number>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio v-model="typeForm.status" :label="1" border>启用</el-radio>
					<el-radio v-model="typeForm.status" :label="0" border>禁用</el-radio>
				</el-form-item>
				<el-form-item label="关联规格" class="mb-1">
					<div class="d-flex flex-wrap pt-1">
						<span class="px-3 py-1 border rounded linkSkuText mr-2 mb-2 position-relative"
						v-for="i in 10">
							<font>颜色</font>
							<i class="btn p-0 el-icon-circle-close position-absolute linkSkuIcon"></i>
						</span>
						<span class="px-3 py-1 border rounded linkSkuText mr-2 mb-2" style="cursor: pointer;"><i class="el-icon-plus"></i></span>
					</div>
				</el-form-item>
				<el-form-item label="属性列表">
					属性列表
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
				tableData: [{
					id:1,
					name:"鞋子",
					order:50,
					status:1,
					sku_list:[
						{ id:1, name:"颜色" },
						{ id:2, name:"尺寸" }
					],
					value_list:[{
						order:50,
						name:"特性",
						type:'input',		
						value:""
					},{
						order:50,
						name:"前置摄像机",
						type:'input',		
						value:""
					}]
				}],
				checkedType: [],
				//编辑
				editTypeState: false,
				editTypeI: -1,
				//弹出层
				typeModel: true,
				typeForm: {
					name: '',
					value: '',
					order: 50,
					status: 1,
					type: 1
				},
				typeFormRule: {
					name: [
						{ required: true, message: '请输入规格名称', trigger: 'blur' }
					],
				},
				//分页
				currentPage: 1
			}
		},
		filters: {
			formatValue(list){
				let arr = list.map(v => v.name)
				return arr.join('，')
			}
		},
		methods: {
			//添加规格
			addType(){
				this.typeModel = true
			},
			//取消弹框
			closelModel(){
				//表单初始化
				this.typeForm = {
					name: '',
					value: '',
					order: 50,
					status: 1,
					type: 1
				}
				this.typeModel = false
			},
			//确定 ，提交表单，添加规格
			submitModel(){
				this.$refs.typeForm.validate((valid) => {
					if (valid) {
						this.typeForm.value = 	this.typeForm.value.replace(/\n/g, ',')
						//编辑
						if(this.editTypeState) {
							let item = this.tableData[this.editTypeI]
							item.name = this.typeForm.name
							item.value = this.typeForm.value
							item.order = this.typeForm.order
							item.status = this.typeForm.status
							item.type = this.typeForm.type
							//重置
							this.editTypeState = false
							this.editTypeI = -1
						}else {
							//新增
							this.tableData.unshift(this.typeForm) 
						}
						this.closelModel()
						this.$message({ type: 'success', message: '操作成功' })
					}
				});
			},
			//多选
			selectChange(val) {
			  this.checkedType = val;
			  console.log(this.checkedType);
			},
			//批量删除
			deleteMore(){
				this.checkedType.forEach(item => {
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
				this.editTypeState = true
				this.editTypeI = i
				this.typeForm = {
					name: item.name,
					value: item.value.replace(/,/g, '\n'),
					order: item.order,
					status: item.status,
					type: item.type
				}
				this.addType()
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

.linkSkuText {
	line-height: 24px;
}
.linkSkuIcon {
	top: -8px; 
	right: -6px; 
	color: #ff2828ed;
	background-color: white;
}
/* .linkSkuText i {
	display: none;
}
.linkSkuText:hover {
	background-color: #f4f4f4;
}
.linkSkuText:hover font {
	display: none;
}
.linkSkuText:hover i {
	display: inline-block;
} */
</style>
