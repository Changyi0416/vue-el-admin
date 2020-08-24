<template>
	<div>
		<div class="mb-2">
			<el-button size="medium" type="success" @click="addSku">添加规格</el-button>
			<el-button size="medium" type="danger" @click="deleteMore">批量删除</el-button>
		</div>
		<el-table ref="table" :data="tableData" style="width: 100%" border @selection-change="selectChange"
		size="medium">
		  <el-table-column type="selection" fixed="left" align="center"></el-table-column>
		  <el-table-column label="规格名称" prop="name" align="center"></el-table-column>
		  <el-table-column label="规格值" prop="default" align="center"></el-table-column>
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
		        <el-button type="success" plain size="small"
						@click="edit(scope.row)">编辑</el-button>
		        <el-button type="danger" plain size="small" 
						@click="deleteItem(scope.row)">删除</el-button>
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
					<el-radio v-model="skuForm.type" :label="0" border>文字</el-radio>
					<el-radio v-model="skuForm.type" :label="1" border>颜色</el-radio>
					<el-radio v-model="skuForm.type" :label="2" border>图片</el-radio>
				</el-form-item>
				<el-form-item label="规格值" prop="default">
					<el-input type="textarea" v-model="skuForm.default" style="width: 60%;" placeholder="一行为一个属性值，多个属性值用换行输入" :rows="3"></el-input>
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
	import common from '@/common/mixins/common.js';
	export default {
		inject: ['layout'],
		mixins: [ common ],
		data(){
			return {
				axiosSign: 'skus',
				tableData: [],
				//编辑
				editSkuId: 0,
				//弹出层
				skuModel: false,
				skuForm: {
					name: '',
					default: '',
					order: 1,
					status: 1,
					type: 0
				},
				skuFormRule: {
					name: [
						{ required: true, message: '请输入规格名称', trigger: 'blur' }
					],
					default: [
						{ required: true, message: '请输入规格值', trigger: 'blur' }
					],
				},
			}
		},
		created(){
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
					default: '',
					order: 1,
					status: 1,
					type: 0
				}
				this.skuModel = false
			},
			//确定 ，提交表单，添加规格
			submitModel(){
				this.$refs.skuForm.validate((valid) => {
					if (valid) {
						this.skuForm.default = 	this.skuForm.default.replace(/\n/g, ',')
						this.addOrEdit(this.skuForm, this.editSkuId)
					}
				});
			},
			//编辑项
			edit(item){
				this.editSkuId = item.id
				this.skuForm = {
					name: item.name,
					default: item.default.replace(/,/g, '\n'),
					order: item.order,
					status: item.status,
					type: item.type
				}
				this.addSku()
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
