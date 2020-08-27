<template>
  <div class="position-absolute" style="top: 55px; bottom: 0; left: 20px; right: 20px;">
    <div>
      <el-tabs v-model="tabVal" @tab-click="handleClick">
        <el-tab-pane :label="item.label" :name="item.value" v-for="(item, i) in tabBar" :key="i">
        </el-tab-pane>
      </el-tabs>
			<!-- 操作按钮+搜索+高级搜索 -->
			<button-search ref="buttonSearch" placeholder="要搜索的订单编号" hasSearchSenior @search="search">
			  <template #left>
			    <el-button size="mini" type="success">导出数据</el-button>
			    <el-button size="mini" type="danger">批量删除</el-button>
			  </template>
			  <template #form>
			    <el-form ref="form" :model="form" label-width="80px" size="small">
			      <el-row :gutter="20">
			        <el-col :span="8">
			          <el-form-item label="订单编号">
			            <el-input v-model="form.no" placeholder="请输入订单编号"></el-input>
			          </el-form-item>
			        </el-col>
							<el-col :span="16">
			          <el-form-item label="下单时间">
									<el-date-picker size="small"
										v-model="form.time"
										type="daterange"
										value-format="yyyy-MM-dd"
										range-separator="至"
										start-placeholder="开始日期"
										end-placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
			      </el-row>
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="收货人">
									<el-input v-model="form.name" placeholder="请输入收货人"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="手机号">
									<el-input type="number" v-model="form.phone" placeholder="请输入手机号"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8" align="right">
								<el-button size="small" type="info" @click="search">搜索</el-button>
								<el-button size="small" type="reset" @click="searchReset">清空筛选条件</el-button>
							</el-col>
						</el-row>
			    </el-form>
			  </template>
			</button-search>
			<el-table :data="tableData" style="width: 100%" border @selection-change="selectChange">
			  <el-table-column type="selection" fixed="left" align="center"></el-table-column>
			  <el-table-column label="商品信息" width="250">
			    <template slot-scope="scope">
			      <div class="mb-2">
			        <div>订单编号：<br/><b>{{scope.row.no}}</b></div>
			        <div>下单时间：<br/><b>{{scope.row.create_time}}</b></div>
			      </div>
			      <div class="media border-bottom py-1" v-for="(item, i) in scope.row.order_items">
			        <img :src="item.goods_item.cover" class="mr-3" style="width: 60px; height: 60px;" alt="商品图片"/>
			        <div class="media-body">
			          <el-link type="primary" :underline="false">
									{{item.goods_item.title}}
								</el-link>
			        </div>
			      </div>
			    </template>
			  </el-table-column>
			  <el-table-column label="实付款" prop="type" align="center">
			    <template slot-scope="scope">
			      ￥{{scope.row.total_price}}<br/>
			      <span>（含运费：￥0.00）</span>
			    </template>
			  </el-table-column>
			  <el-table-column label="买家" prop="sale_count" align="center">
			    <template slot-scope="scope">
						{{scope.row.user.username}}
					</template>
			  </el-table-column>
			  <el-table-column label="商品状态" prop="status" align="center" width="120">
			    <template slot-scope="scope">
					  <el-tag type="success" v-if="scope.row.payment_method == 'wechat'">微信支付</el-tag>
					  <el-tag v-else-if="scope.row.payment_method == 'alipay'">支付宝支付</el-tag>
					  <el-tag type="warning" v-else>未支付</el-tag>
			    </template>
			  </el-table-column>
			  <el-table-column label="配送方式" align="center">
					<template slot-scope="scope">
						<div v-if="scope.row.ship_data">
							<p>{{scope.row.ship_data.express_company}}</p>
							<p>{{scope.row.ship_data.express_no}}</p>
						</div>
						<span v-else>未发货</span>
					</template>
				</el-table-column>
			  <el-table-column label="交易状态" align="center" width="180px">
			    <template slot-scope="scope">
			      <div>付款状态：
							<el-tag :type="scope.row.payment_method ? 'success' : 'info'">
								{{scope.row.payment_method ? '已付款' : '未付款'}}
							</el-tag>
						</div>
			      <div class="my-2">发货状态：
							<el-tag :type="scope.row.ship_data ? 'success' : 'info'">
								{{scope.row.ship_data ? '已发货' : '待发货'}}
							</el-tag>
						</div>
			      <div>收货状态：
							<el-tag :type="scope.row.ship_status == 'received' ? 'success' : 'info'">
								{{scope.row.ship_status == 'received' ? '已收货' : '未收货'}}
							</el-tag>
						</div>
			    </template>
			  </el-table-column>
			  <el-table-column label="操作" width="120" align="center">
			    <template>
			      <el-button type="success" size="small">订单详情</el-button>
			    </template>
			  </el-table-column>
			</el-table>
			<div style="height: 60px;"></div>	
			<el-footer class="px-0 d-flex align-items-center position-fixed bg-white" style="left:200px; right: 0; bottom: 0; z-index: 4;">
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
    </div>
  </div>
</template>

<script>
import buttonSearch from "@/components/common/button-search.vue";
import common from '@/common/mixins/common.js';
export default {
  components: { buttonSearch },
	inject: ['layout'],
	mixins: [ common ],
  data() {
    return {
			axiosSign: 'order',
			signText: '订单',
      tabBar: [
        { label: "全部", value: "all" },
        { label: "待支付", value: "nopay" },
        { label: "待发货", value: "noship" },
        { label: "已发货", value: "shiped" },
        { label: "已收货", value: "received" },
        { label: "已完成", value: "finish" },
        { label: "已关闭", value: "closed" },
        { label: "退款中", value: "refunding" },
      ],
      tabIndex: 0,
			tabVal: 'all',
      tableData: [],
      form: {
				no: "",
        name: "",
        phone: "",
				time: ""
      },
    };
  },
  created() {
		this.__init(`&tab=${this.tabVal}`)
	},
  methods: {
		handleData(Data){
			this.tableData = Data.list
			this.tableData.forEach(item => {
				if(item.order_items) item.order_items.forEach(current => {
					current.goods_item = {
						title: '树叶',
						cover: 'http://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/public/5f3f96c35a7be.jpg'
					}
				})
			})
			console.log(this.tableData)
		},
		handleClick(tab, event) {
			this.tabVal = tab.name
			this.__init(`&tab=${this.tabVal}`)
    },
		//搜索
    search(val) {
			// console.log(this.form)
			// let startTime = this.form.time[0]
			// return
      if (typeof val === "string") {
				return this.__init(`&tab=${this.tabVal}&no=${val}`)
      }
			let form = {
				...this.form,
				starttime: this.form.time[0] ? this.form.time[0] : '',
				endtime: this.form.time[1] ? this.form.time[1] : ''
			}
			this.__init(`&tab=${this.tabVal}&no=${form.no}&starttime=${form.starttime}&endtime=${form.endtime}&name=${form.name}&phone=${form.phone}`)
		},
		//重置搜索条件
    searchReset() {
      this.form = {
				no: "",
        name: "",
        phone: "",
				time: ""
      }
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
			.catch(() => {})
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
			.catch(() => {})
		},
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
