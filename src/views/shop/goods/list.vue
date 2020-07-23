<template>
  <div class="position-absolute" style="top: 55px; bottom: 0; left: 20px; right: 20px;">
    <div>
      <el-tabs v-model="tabIndex" @tab-click="handleClick">
        <el-tab-pane :label="item.name" v-for="(item, i) in tabBar" :key="i">
          <!-- 操作按钮+搜索+高级搜索 -->
          <button-search ref="buttonSearch" placeholder="请输入商品名称" @search="search">
            <template #left>
              <router-link :to="{name: 'shop_goods_create'}" class="mr-2">
                <el-button size="mini" type="success">发布商品</el-button>
              </router-link>
              <el-button size="mini" type="danger">批量删除</el-button>
              <el-button size="mini">下架</el-button>
              <el-button size="mini">推荐</el-button>
            </template>
            <template #form>
              <el-form ref="form" :model="form" label-width="80px">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-form-item label="商品名称">
                      <el-input v-model="form.name" size="mini" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="商品编码">
                      <el-input v-model="form.code" size="mini" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="商品类型">
                      <el-select v-model="form.type" size="mini" placeholder="请选择">
                        <el-option label="区域一" value="1"></el-option>
                        <el-option label="区域二" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="商品分类">
                      <el-select v-model="form.category" size="mini" placeholder="请选择">
                        <el-option label="区域一" value="1"></el-option>
                        <el-option label="区域二" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-button size="mini" type="info" @click="search">搜索</el-button>
                <el-button size="mini" type="reset" @click="searchReset">清空筛选条件</el-button>
              </el-form>
            </template>
          </button-search>
          <el-table :data="tableData[i].list" style="width: 100%" border @selection-change="selectChange">
            <el-table-column type="selection" fixed="left" align="center"></el-table-column>
            <el-table-column label="商品信息" width="280">
              <template slot-scope="scope">
                <div class="media">
                  <img
                    :src="scope.row.cover"
                    class="mr-3"
                    style="width: 60px; height: 60px;"
                    alt="商品图片"
                  />
                  <div class="media-body">
                    <p class="font-weight-bold mb-1">{{scope.row.title}}</p>
                    <p class="mb-1">分类：{{scope.row.category}}</p>
                    <p class="mb-0">时间：{{scope.row.create_time}}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品类型" prop="type" align="center"></el-table-column>
            <el-table-column label="实际销量" prop="sale_count" align="center"></el-table-column>
            <el-table-column label="商品排序" prop="order" align="center"></el-table-column>
            <el-table-column label="商品状态" prop="status" align="center" width="120">
              <template slot-scope="scope">
								<!-- <el-button :type="scope.row.status == 1 ? 'success' : 'danger'" size="mini" plain
								@click="statusChange(scope.row)">{{scope.row.status == 1 ? '上架' : '下架'}}</el-button> -->
                <el-button type="success" plain size="mini" class="mb-1"
								@click="scope.row.isCheck = 1">审核通过</el-button>
								<br>
                <el-button type="danger" plain size="mini"
								@click="scope.row.isCheck = 2">审核拒绝</el-button>
              </template>
            </el-table-column>
            <el-table-column label="总库存" prop="stock" align="center"></el-table-column>
            <el-table-column label="价格（元）" prop="pprice" align="center"></el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button type="success" plain size="mini">编辑</el-button>
                  <el-button type="danger" plain size="mini" @click="deleteItem(scope.$index)">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
			<div style="height: 60px;"></div>	
			<el-footer class="px-0 d-flex align-items-center position-fixed bg-white" style="left:200px; right: 0; bottom: 0; z-index: 4;">
        <div class="flex-grow-1 px-2 h-100 d-flex align-items-center">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </div>
      </el-footer>
    </div>
  </div>
</template>

<script>
import buttonSearch from "@/components/common/button-search.vue";
export default {
  components: { buttonSearch },
  data() {
    return {
      tabBar: [
        {
          name: "审核中"
        },
        {
          name: "出售中"
        },
        {
          name: "已下架"
        },
        {
          name: "库存预警"
        },
        {
          name: "回收站"
        }
      ],
      tabIndex: 0,
      form: {
        name: "",
        code: "",
        type: "",
        category: ""
      },
      tableData: [],
      multipleSelect: [],
      //分页
      currentPage: 4
    };
  },
  created() {
		//生成模拟table数据
		this.__getData();
	},
  methods: {
		//生成模拟table数据
    __getData() {
      for (let i = 0; i < this.tabBar.length; i++) {
        this.tableData.push({
          currentaPage: i+1,
          list: []
        });
        for (let j = 0; j < 20; j++) {
          this.tableData[i].list.push({
            id: j,
            title: "荣耀 V10全网通 标配版" + i + '_' + j,
            cover: "http://static.yoshop.xany6.com/2018071718294208f086786.jpg",
            create_time: "2019-07-17 18:34:14",
            category: "手机",
            type: "普通商品",
            sale_count: 20,
            order: 100,
            status: 1, //1下架  0下架
            stock: 200,
            pprice: 1000,
            ischeck: 1 // 0未审核，1通过，2不通过
          });
        }
			}
    },
		handleClick(tab, event) {
      console.log(tab);
    },
		//搜索
    search(val) {
      if (typeof val === "string") {
        console.log("简单搜索", val);
        return;
      }
      console.log("高级搜索");
		},
		//重置搜索条件
    searchReset() {
      this.form = {
        name: "",
        code: "",
        type: "",
        category: ""
      };
      //调用子组件函数
      this.$refs.buttonSearch[this.tabIndex].searchSeniorClose();
    },
    //多选
    selectChange(val) {
      this.multipleSelect = val;
      console.log(this.multipleSelect);
		},
		//table->删除某一项
		deleteItem(index){
			this.$confirm('确定删除该数据', '提示', {
				confirmButtonText: '确定',
				cancelButtnText: '取消',
				type: 'warning'
			})
			.then(() => {
				this.tableData[this.tabIndex].list.splice(index, 1);
			})
			.catch(()=>{})
		},
		//上架  下架
		statusChange(item){
			this.$confirm('是否' + (item.status == 1 ? '上架' : '下架') + '该商品', '提示', {
				confirmButtonText: '确定',
				cancelButtnText: '取消',
				type: 'warning'	
			})
			.then(() => {
				item.status = item.status == 1 ? 0 : 1;
			})
			.catch(()=>{})
		},
		//分页
		handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
