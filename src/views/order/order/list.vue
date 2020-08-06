<template>
  <div class="position-absolute" style="top: 55px; bottom: 0; left: 20px; right: 20px;">
    <div>
      <el-tabs v-model="tabIndex" @tab-click="handleClick">
        <el-tab-pane :label="item.name" v-for="(item, i) in tabBar" :key="i">
          <!-- 操作按钮+搜索+高级搜索 -->
          <button-search ref="buttonSearch" placeholder="要搜索的订单编号" @search="search">
            <template #left>
              <el-button size="mini" type="success">导出数据</el-button>
              <el-button size="mini" type="danger">批量删除</el-button>
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
            <el-table-column label="商品信息" width="300">
              <template slot-scope="scope">
                <div class="d-flex mb-2">
                  <div class="flex-grow-1">订单编号：<br/><b>208109849283</b></div>
                  <div class="flex-grow-1 ml-2">下单时间：<br/><b>2020-08-06 12:00:00</b></div>
                </div>
                <div class="media">
                  <img :src="scope.row.cover"
                    class="mr-3" style="width: 60px; height: 60px;" alt="商品图片"
                  />
                  <div class="media-body">
                    <el-link type="primary" :underline="false"
                    style="font-size: 16px;">{{scope.row.title}}</el-link>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实付款" prop="type" align="center">
              <template>
                ￥10<br/>
                <span>（含运费：￥0.00）</span>
              </template>
            </el-table-column>
            <el-table-column label="买家" prop="sale_count" align="center">
              用户名<br>
              <span>（用户id：1231231）</span>
            </el-table-column>
            <el-table-column label="商品排序" prop="order" align="center"></el-table-column>
            <el-table-column label="商品状态" prop="status" align="center" width="120">
              <template>
							  <el-tag type="success">微信支付</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="配送方式" prop="stock" align="center"></el-table-column>
            <el-table-column label="交易状态）" align="center">
              <template>
                <div>付款状态：<el-tag type="success">已付款</el-tag></div>
                <div class="my-2">发货状态：<el-tag type="info">待发货</el-tag></div>
                <div>收货状态：<el-tag type="info">待收货</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
              <template>
                <el-button type="success" size="mini">订单详情</el-button>
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
						:page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="40">
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
        { name: "全部" },
        { name: "待付款" },
        { name: "待发货" },
        { name: "已发货" },
        { name: "已收货" },
        { name: "已完成" },
        { name: "已关闭" },
        { name: "退款中" },
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
      currentPage: 1
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
            title: "荣耀 V10全网通 标配版 4G+64GB 魅族红" + i + '_' + j,
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
