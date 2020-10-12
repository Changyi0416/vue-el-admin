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
			    <el-button size="mini" type="danger" @click="deleteMore">批量删除</el-button>
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
			<el-table ref="table" :data="tableData" style="width: 100%" border @selection-change="selectChange" >
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
			  <el-table-column label="操作" width="140" align="center">
			    <template slot-scope="scope">
			      <el-button type="text" size="small" class="mb-2">订单详情</el-button>
						<br>
						<!-- v-show="scope.row.ship_status === 'pending' && scope.row.closed === 0 && scope.row.payment_method && scope.row.refund_status === 'pending'" -->
			      <el-button type="text" size="small" @click="ship(scope.row)"
						
						>
							订单发货
						</el-button>
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
		<el-dialog title="订单发货" :visible.sync="shipModel" width="30%">
			<!--  :rules="shipRules" -->
		  <el-form v-model="shipForm" label-width="80px" ref="shipForm">
				<el-form-item label="快递公司" prop="expressCompany">
					<!-- <el-input type="text" v-model="shipForm.express_company" placeholder="请输入"></el-input> -->
					<el-select v-model="shipForm.express_company" placeholder="请选择">
						<el-option
							v-for="item in express_company_options" :key="item.id"
							:label="item.name" :value="item.code">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="快递单号" prop="expressNo">
					<el-input type="number" v-model="shipForm.express_no" placeholder="请输入"></el-input>
				</el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="shipModel = false">取 消</el-button>
		    <el-button type="primary" @click="submitShip">确 定</el-button>
		  </span>
		</el-dialog>
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
			//订单发货 Model
			shipModel: false,
			shipId: 0,
			shipForm: {
				express_company: '',
				express_no: ''
			},
			shipRules: {
				expressCompany: [{ required: true, message: '请输入快递公司', trigger: 'blur' }],
				expressNo: [{ required: true, message: '请输入快递单号', trigger: 'blur' }]
			},
			//快递公司列表
			express_company_options: []
    };
  },
  created() {
		this.__init(`&tab=${this.tabVal}`)
		this.getExpress_company()
	},
  methods: {
		//获取快递公司数据
		getExpress_company(){
			this.axios.get(`/admin/express_company/1?limit=50`, { token: true })
			.then(res => {
				this.express_company_options = res.data.data.list;
			})
			.catch(() => {})
		},
		handleClick(tab, event) {
			this.tabVal = tab.name
			this.__init(`&tab=${this.tabVal}`)
    },
		//搜索
    search(val) {
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
		//订单发货
		ship(item){
			this.shipId = item.id
			this.shipModel = true
		},
		submitShip(){
			this.shipModel = false
			this.layout.showLoading()
			//提交
			if(this.shipId !== '') this.axios.post(`/admin/order/${this.shipId}/ship`, this.shipForm, { token: true })
			.then(res => {
				this.layout.hideLoading()
				if(res.data.data.data) this.$message({type: 'success', message: '发货成功'})
				this.__init()
			})
			.catch(() => {
				this.layout.hideLoading()
			})
			//重置
			this.shipForm = {
				express_company: '',
				express_no: ''
			}
			/* this.$refs.shipForm.validate(valid => {
				if(valid) {
					if(this.shipId !== '') this.axios.post(`/admin/order/${this.shipId}/ship`, this.shipForm, { token: true })
					.then(res => {
						console.log(res)
					})
					.catch(() => {})
				}
			}) */
		}
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
