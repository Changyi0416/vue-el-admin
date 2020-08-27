<template>
  <div>
    <div class="d-flex justify-content-end mb-2">
      <el-date-picker v-model="time" type="monthrange"
        range-separator="至"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        size="medium" style="width: 400px;">
      </el-date-picker>
      <el-input v-model="code" placeholder="请输入订单编号" size="medium" 
      class="mx-2" style="width: 180px;"></el-input>
      <el-button type="info" size="medium" @click="search">搜索</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="selection" fixed="left" align="center"></el-table-column>
      <el-table-column label="订单编号" prop="name" align="center"></el-table-column>
      <el-table-column label="用户名" prop="" align="center"></el-table-column>
      <el-table-column label="开票金额" prop="" align="center"></el-table-column>
      <el-table-column label="抬头" prop="" align="center"></el-table-column>
      <el-table-column label="发票内容" prop="" align="center"></el-table-column>
      <el-table-column label="缴纳人识别号" prop="" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="" align="center"></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="success" plain size="medium"
              @click="editItem(scope.row, scope.$index)"
            >编辑</el-button>
            <el-button type="danger" plain size="medium"
              @click="deleteItem(scope.$index)"
            >删除</el-button>
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        time:'',
        code: '',
        tableData: [],
        //分页
				currentPage: 1
      }
    },
    methods: {
      search(){},
      editItem(){},
      deleteItem(){},
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
</style>