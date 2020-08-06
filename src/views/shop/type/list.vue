<template>
  <div>
    <div class="mb-2">
      <el-button size="medium" type="success" @click="addType">添加类型</el-button>
      <el-button size="medium" type="danger" @click="deleteMore">批量删除</el-button>
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
          <el-button class="mb-1" plain size="mini"
            :type="scope.row.status ? 'success' : 'danger'"
            @click="changeStatus(scope.row)"
          >{{scope.row.status ? '启用' : '禁用'}}</el-button>
          <br />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="success" plain size="medium"
              @click="editTypeItem(scope.row, scope.$index)"
            >编辑</el-button>
            <el-button type="danger" plain size="medium"
              @click="deleteTypeItem(scope.$index)"
            >删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-footer
      class="px-0 d-flex align-items-center position-fixed bg-white"
      style="left:200px; right: 0; bottom: 0; z-index: 4;"
    >
      <div class="flex-grow-1 px-2 h-100 d-flex align-items-center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="40"
        ></el-pagination>
      </div>
    </el-footer>
    <el-dialog title="添加商品类型" :visible.sync="typeModel" top="3vh" width="75%">
      <el-form ref="typeForm" :model="typeForm" :rules="typeFormRule"
        size="medium" label-width="80px"
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
            v-for="(item, i) in typeForm.sku_list" :key="i">
              <font>{{item.name}}</font>
              <i class="btn p-0 el-icon-circle-close position-absolute linkSkuIcon"
              @click="deleteSkuItem(i)"></i>
            </span>
            <span class="px-3 py-1 border rounded linkSkuText mr-2 mb-2" style="cursor: pointer;">
              <i class="el-icon-plus"></i>
            </span>
          </div>
        </el-form-item>
        <el-form-item label="属性列表">
          <el-table :data="value_list" style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="date" label="排序" width="180">
							<template slot-scope="scope">
								<el-input-number v-model="scope.row.order" :min="1" size="medium" style="width: 150px;"></el-input-number>
							</template>
						</el-table-column>
            <el-table-column prop="name" label="属性名称" width="180">
							<template slot-scope="scope">
								<el-input v-model="scope.row.name" size="medium" placeholder="请输入属性名称"></el-input>
							</template>
						</el-table-column>
            <el-table-column prop="type" label="所属类型">
              <template slot-scope="scope">
                <el-select placeholder="请选择所属类型" v-model="scope.row.type">
                  <el-option label="输入框" value="input"></el-option>
                  <el-option label="单选框" value="radio"></el-option>
                  <el-option label="多选框" value="checkbox"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="是否显示" width="120">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"
                :active-value="1" :inactive-value="0"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="属性值">
              <template slot-scope="scope">
                <div v-if="scope.row.type == 'input'">
                  <span v-if="!scope.row.editValStatus">{{scope.row.value}}</span>
                  <el-input type="textarea" placeholder="一行为一个属性值，多个属性值用换行输入"
                  :row="2" v-model="scope.row.value" v-else></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
								<el-link class="mr-2" type="primary" v-if="scope.row.type == 'input'" 
                @click="editInput(scope.row)">{{scope.row.editValStatus ? '完成' : '编辑属性值'}}</el-link>
								<el-link type="danger" @click="deleteValItem(scope.$index)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-link type="primary" :underline="false" @click="addValue">
            <i class="el-icon-plus"></i>
            <span>添加一个属性</span>
          </el-link>
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
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: "鞋子",
          order: 50,
          status: 1,
          sku_list: [
            { id: 1, name: "颜色" },
            { id: 2, name: "尺寸" },
          ],
          value_list: [
            {
              order: 50,
              name: "特性",
              type: "input",
              editValStatus: false,
              value: "特性1,特性2,特性3",
            },
            {
              order: 50,
              name: "前置摄像机",
              type: "input",
              editValStatus: false,
              value: "前置摄像机1,摄像头2",
            },
          ],
        },
      ],
      //多选
      checkedType: [],
      //编辑商品类型
      editTypeState: false,
      editTypeI: -1,
      //弹出层表单
      typeModel: false,
      typeForm: {
        name: "",
        order: 1,
        status: 1,
        sku_list: [],
      },
			//弹出层-属性列表
			value_list: [
				/* {
					order: 50,
					name: "属性名称",
          type: "input",
          editValStatus: false,
					value: "属性值",
				}, */ 
      ],
      typeFormRule: {
        name: [{ required: true, message: "请输入规格名称", trigger: "blur" }],
      },
      //编辑属性值
      editValStatus: false,
      formValid: true, //表单验证是否通过
      //分页
      currentPage: 1,
    };
  },
  filters: {
    formatValue(list) {
      let arr = list.map((v) => v.name);
      return arr.join("，");
    },
  },
  methods: {
    //添加规格
    addType() {
      this.typeModel = true;
    },
    //取消弹框
    closelModel() {
      //表单初始化
      this.typeForm = {
        name: "",
        order: 1,
        status: 1,
        sku_list: [],
      };
      this.value_list = []
      this.typeModel = false;
    },
    //确定 ，提交表单，添加商品类型
    submitModel() {
      this.$refs.typeForm.validate((valid) => {
        if (valid) {
          // this.typeForm.value = this.typeForm.value.replace(/\n/g, ",");
          
          //判断属性列表完整性
          if(this.value_list.length == 0) return this.notify(-1, '请添加属性')
          this.value_list.forEach((item, i) => {
            if(!item.order || item.order == '') return this.notify(i, '排序')
            else if(item.name == '')  return this.notify(i, '属性名称')
            else if(item.type == '')  return this.notify(i, '所属类型')
            else if(item.value == '')  return this.notify(i, '属性值')
            else this.formValid = true
          })

          //编辑
          if (this.editTypeState) {
            let item = this.tableData[this.editTypeI];
            item.name = this.typeForm.name;
            // item.value = this.typeForm.value;
            item.order = this.typeForm.order;
            item.status = this.typeForm.status;
            item.type = this.typeForm.type;
            //重置
            this.editTypeState = false;
            this.editTypeI = -1;
          } else {
            if(this.formValid) {
              //新增
              this.tableData.unshift({
                ...this.typeForm,
                value_list: [...this.value_list]
              });
            }
          }
          if(this.formValid) {
            this.closelModel();
            this.$message({ type: "success", message: "操作成功" });
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
    //删除关联规格
    deleteSkuItem(i){
      this.typeForm.sku_list.splice(i, 1)
    },
    //添加一个属性
    addValue(){
      this.value_list.push({
					order: 0,
					name: "",
          type: "",
          editValStatus: true,
					value: "",
				})
    },
    //编辑属性值
    editInput(item){
      item.editValStatus = !item.editValStatus
      if(item.editValStatus) item.value = item.value.replace(/,/g, "\n")
      else item.value = item.value.replace(/\n/g, ",")
    },
    //删除属性值
    deleteValItem(i){
      this.$confirm("是否删除该属性值", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.value_list.splice(i, 1)
        this.$message({ type: "success", message: "删除成功" });
      })
      .catch((e) => e);
    },

    //商品类型表格操作
    //多选
    selectChange(val) {
      this.checkedType = val;
      console.log(this.checkedType);
    },
    //批量删除
    deleteMore() {
      this.checkedType.forEach((item) => {
        let i = this.tableData.findIndex((v) => item.id == v.id);
        this.tableData.splice(i, 1);
      });
    },
    //修改启用、禁用状态
    changeStatus(row) {
      row.status = row.status ? 0 : 1;
      let str = row.status ? "启用" : "禁用";
      this.$message({ type: "success", message: `${str}成功` });
    },
    //编辑项
    editTypeItem(item, i) {
      this.editTypeState = true;
      this.editTypeI = i;
      this.typeForm = {
        name: item.name,
        order: item.order,
        status: item.status,
        sku_list: item.sku_list,
      };
      this.value_list = item.value_list
      this.addType();
    },
    //删除项
    deleteTypeItem(i) {
      this.$confirm("是否删除该类型", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.splice(i, 1);
          this.$message({ type: "success", message: "删除成功" });
        })
        .catch((e) => e);
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
