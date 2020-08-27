<template>
  <div>
    <div class="mb-2">
      <el-button size="medium" type="success" @click="addType">添加类型</el-button>
      <el-button size="medium" type="danger" @click="deleteMore">批量删除</el-button>
    </div>
    <el-table :data="tableData" ref="table" style="width: 100%" border @selection-change="selectChange">
      <el-table-column type="selection" fixed="left" align="center"></el-table-column>
      <el-table-column label="类型名称" prop="name" align="center"></el-table-column>
      <el-table-column label="属性标签" align="center">
        <template slot-scope="scope">{{scope.row.goods_type_values | formatValue}}</template>
      </el-table-column>
      <el-table-column label="属性排序" prop="order" align="center"></el-table-column>
      <el-table-column label="状态" align="center" width="140">
        <template slot-scope="scope">
          <el-button class="mb-1" plain size="mini"
            :type="scope.row.status ? 'success' : 'danger'"
            @click="changeStatus(scope.row)"
          >{{scope.row.status ? '启用' : '禁用'}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="success" plain size="small"
              @click="editTypeItem(scope.row)"
            >编辑</el-button>
            <el-button type="danger" plain size="small"
              @click="deleteItem(scope.row)"
            >删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 60px;"></div>
		<el-footer
      class="px-0 d-flex align-items-center position-fixed bg-white"
      style="left:200px; right: 0; bottom: 0; z-index: 4;"
    >
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
    <el-dialog title="添加商品类型" :visible.sync="typeModel" top="3vh" width="80%"
		:before-close="closeModel">
      <el-form ref="typeForm" :model="typeForm" :rules="typeFormRule"
        size="medium" label-width="100px"
      >
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
            v-for="(item, i) in typeForm.skus" :key="i">
              <font>{{item.name}}</font>
              <i class="btn p-0 el-icon-circle-close position-absolute linkSkuIcon"
              @click="deleteSkuItem(i)"></i>
            </span>
            <span class="px-3 py-1 border rounded linkSkuText mr-2 mb-2" style="cursor: pointer;"
						@click="chooseSkus">
              <i class="el-icon-plus"></i>
            </span>
          </div>
        </el-form-item>
        <el-form-item label="属性列表">
          <el-table :data="typeForm.value_list" style="width: 100%" size="small">
            <el-table-column type="index" width="40"></el-table-column>
            <el-table-column prop="date" label="排序" width="150">
							<template slot-scope="scope">
								<el-input-number v-model="scope.row.order" :min="1" size="small" style="width: 130px;"></el-input-number>
							</template>
						</el-table-column>
            <el-table-column prop="name" label="属性名称" width="140">
							<template slot-scope="scope">
								<el-input v-model="scope.row.name" size="small" style="width: 130px;" 
								placeholder="请输入属性名称"></el-input>
							</template>
						</el-table-column>
            <el-table-column prop="type" label="所属类型">
              <template slot-scope="scope">
                <el-select placeholder="请选择所属类型" size="small" v-model="scope.row.type">
                  <el-option label="输入框" value="input"></el-option>
                  <el-option label="单选框" value="radio"></el-option>
                  <el-option label="多选框" value="checkbox"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="是否显示" width="90">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="属性值" width="150">
              <template slot-scope="scope">
                <!-- <div v-if="scope.row.type == 'input'"> -->
                  <span v-if="!scope.row.editValStatus">{{scope.row.default}}</span>
                  <el-input type="textarea" style="width: 130px;" placeholder="一行为一个属性值，多个属性值用换行输入"
                  size="small" :row="2" v-model="scope.row.default" v-else></el-input>
                <!-- </div>	 -->
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
								<el-link class="mr-2" type="primary" v-if="scope.row.type == 'input'" 
                @click="editInput(scope.row)">{{scope.row.editValStatus ? '完成' : '编辑属性值'}}</el-link>
								<el-link type="danger" @click="deleteValItem(scope.$index)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-link type="primary" :underline="false" @click="addAttr">
            <i class="el-icon-plus"></i>
            <span>添加一个属性</span>
          </el-link>
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
import common from '@/common/mixins/common.js';
export default {
	inject: ['layout', 'app'],
	mixins: [ common ],
  data() {
    return {
			axiosSign: 'goods_type',
			signText: '类型',
      tableData: [],
      //编辑商品类型
      // editTypeState: false,
      editTypeId: 0,
      //弹出层表单
      typeModel: false,
      typeForm: {
        name: "",
        order: 1,
        status: 1,
        skus: [],
				value_list: []
      },
      typeFormRule: {
        name: [{ required: true, message: "请输入规格名称", trigger: "blur" }],
      },
      //编辑属性值
      editValStatus: false,
      formValid: true, //表单验证是否通过
    };
  },
  filters: {
    formatValue(list) {
      let arr = list.map((v) => v.name);
      return arr.join(",");
    },
  },
	computed: {
		sku_ids() {
			if(!this.typeForm.skus.length) return []
			return this.typeForm.skus.map(item => item.id)
		}
	},
  methods: {
    //添加规格
    addType() {
      this.typeModel = true;
    },
    //取消弹框
    closeModel() {
      //表单初始化
      this.typeForm = {
        name: "",
        order: 1,
        status: 1,
        skus: [],
				value_list: []
      };
			//编辑id 初始化
			this.editTypeId = 0
      this.typeModel = false;
    },
    //确定 ，提交表单，添加商品类型
    submitModel() {
      this.$refs.typeForm.validate((valid) => {
        if (valid) {
          
          //判断属性列表完整性
          if(this.typeForm.value_list.length == 0) return this.notify(-1, '请添加属性')
          this.typeForm.value_list.forEach((item, i) => {
            if(!item.order || item.order == '') return this.notify(i, '排序')
            else if(item.name == '')  return this.notify(i, '属性名称')
            else if(item.type == '')  return this.notify(i, '所属类型')
            else if(item.type !== 'input' && item.default == '')  return this.notify(i, '属性值')
            else this.formValid = true
						
						if(item.default !== '') item.default = item.default.replace(/\n/g, ",")
          })

					if(this.formValid) {
						this.typeForm.skus = this.sku_ids
						this.addOrEdit(this.typeForm, this.editTypeId)
						this.editTypeId = 0 //编辑id 初始化
					}
        }
      });
    },
    //弹出层表单中属性列表信息错误提示
    notify(i, msg){
      let str = i < 0 ? msg : '属性列表第'+ (i + 1) +'行，【'+ msg +'】不能为空'
      this.formValid = false
        this.$notify.error({
          title: '错误',
          message: str
        });
    },
		//选择关联规格
		chooseSkus(){
			this.app.chooseSkuval(res => {
				let index = this.typeForm.skus.findIndex(item => {
					return item.id == res.id
				})
				if(index == -1) this.typeForm.skus.push(res)
				else this.$message.error('不可重复选择')
			})
		},
    //删除关联规格
    deleteSkuItem(i){
      this.typeForm.skus.splice(i, 1)
    },
    //添加一个属性
    addAttr(){
      this.typeForm.value_list.push({
					order: 0,
					name: "",
          type: "",
          editValStatus: true,
					default: "",
				})
    },
    //编辑属性值
    editInput(item){
      if(!item.editValStatus) item.default = item.default.replace(/,/g, "\n")
      else {
				if(item.default == '') return this.$message.error('请输入属性值')
				item.default = item.default.replace(/\n/g, ",")
			}
      item.editValStatus = !item.editValStatus
    },
    //删除属性值
    deleteValItem(i){
      this.$confirm("是否删除该属性值", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.typeForm.value_list.splice(i, 1)
        this.$message({ type: "success", message: "删除成功" });
      })
      .catch(() => {})
    },

    //编辑项
    editTypeItem(item) {
			console.log(item)
      this.editTypeId = item.id;
      this.typeForm = {
        name: item.name,
        order: item.order,
        status: item.status,
        skus: item.skus,
				value_list: item.goods_type_values
      };
      this.addType();
    },
  }, 
};
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
</style>
