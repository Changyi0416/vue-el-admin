<template>
	<el-form ref="goodsRuleForm" label-width="80px" size="medium">
		<el-form-item label="添加规格">
			<!-- 规格卡片 -->
	    <div class="card mb-3" v-for="(item, i) in sku_card" :key="i">
				<!-- 卡片头部 -->
	      <div class="card-header d-flex align-items-center">
	        规格项：
	        <el-input size="medium" placeholder="请选择" style="width: 200px;"
					:value="item.name" @input="vModelCard(i, 'name', $event)">
	          <el-button class="btn" slot="append" @click="chooseSkuval(i)"><i class="el-icon-more"></i></el-button>
	        </el-input>
	        <el-radio-group class="ml-3"
					:value="item.type" @input="vModelCard(i, 'type', $event)">
	          <el-radio :label="0">无</el-radio>
	          <el-radio :label="1">颜色</el-radio>
	          <el-radio :label="2">图片</el-radio>
	        </el-radio-group>
	        <div class="ml-auto">
						<!-- 上移 -->
	          <el-button class="btn" icon="el-icon-top" plain size="mini" :disabled="i === 0"
						@click="moveSkuCard({sign: 'moveUp', i})"></el-button>
						<!-- 下移 -->
	          <el-button class="btn" icon="el-icon-bottom" plain size="mini" :disabled="sku_card.length === (i+1)" 
						@click="moveSkuCard({sign: 'moveDown', i})"></el-button>
	          <el-button class="btn" type="text" @click="deleSkuCard(i)">删除</el-button>
	        </div>
	      </div>
				<!-- 卡片身体 -->
	      <div class="card-body">
					<div class="d-flex align-items-center flex-wrap">
						<div class="border px-2 py-1 mr-2 mb-2 rounded"
						v-for="(current, j) in item.list" :key="j" v-dragging="{ item: current, list: item.list, group: `skuItem${i}`}">
						<many-attrs-val :i='i' :current="current" :j="j" :type="item.type"></many-attrs-val>
						</div>
					</div>
	        <el-button class="btn" type="text" icon="el-icon-plus" @click="addSkuVal(i)">添加规格值</el-button>
	      </div>
	    </div>
	    <el-button type="success" size="mini" @click="addSkuCard">添加规格</el-button>
	  </el-form-item>
	  <el-form-item label="批量设置">
	    <template v-if="!isBatchset">
				<el-button type="text" class="btn px-2"
				v-for="(item, i) in batchsetArr" :key="i"
				@click="batchset(item)">{{item.name}}</el-button>
			</template>
			<div v-else class="d-flex align-items-center">
				<el-input v-model="batchsetVal" size="small" :placeholder="batchsetPlaceholder" class="mr-2" style="width: 150px;"></el-input>
				<el-button class="btn" type="primary" size="mini" @click="batchsetConfirm">设置</el-button>
				<el-button class="btn" size="mini" @click="batchsetCancel">取消</el-button>
			</div>
	  </el-form-item>
	  <el-form-item label="规格设置" class="mb-5">
			<sku-table ref="skuTable"></sku-table>
	  </el-form-item>
	</el-form>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import manyAttrsVal from '@/components/shop/goods/many-attrs-val.vue';
	import skuTable from '@/components/shop/goods/sku-table.vue';
	export default {
		inject: ['app'],
		components: { manyAttrsVal, skuTable },
		data(){
			return {
				//批量设置按钮文字数组
				batchsetArr: [
					{name: '销售价', key: 'pprice'}, 
					{name: '市场价', key: 'oprice'}, 
					{name: '成本价', key: 'cprice'}, 
					{name: '库存', key: 'stock'}, 
					{name: '体积', key: 'volume'}, 
					{name: '重量', key: 'weight'}
				],
				isBatchset: false,
				batchsetPlaceholder: '',
				batchsetVal: '',
			}
		},
		computed: {
			...mapState('goods_create', ['sku_card']),
		},
		methods: {
			...mapMutations('goods_create', ['addSkuCard', 'deleSkuCard', 'vModelSkuCard', 'moveSkuCard', 'addSkuVal']),
			//修改规格项（名称&类型）
			vModelCard(i, key, val){
				this.vModelSkuCard({i, key, val});
			},
			//选择规格项
			chooseSkuval(i){
				this.app.chooseSkuval((res) => {
					// console.log(res);
					this.vModelCard(i, 'name', res.name);
					this.vModelCard(i, 'type', res.type);
					this.vModelCard(i, 'list', res.list);
				})
			},
			//批量设置
			batchset(item){
				this.isBatchset = item.key
				this.batchsetPlaceholder = item.name;
			},
			//确认批量设置
			batchsetConfirm(){
				let tableList = this.$refs.skuTable.tableList
				console.log(tableList)
				tableList.forEach(item => {
					item[this.isBatchset] = this.batchsetVal
				})
				this.batchsetCancel()
			},
			//取消批量设置
			batchsetCancel(){
				this.isBatchset = false
				this.batchsetVal = ''
			}
		}
		
	}
</script>

<style>
.ruleSetTable th{
	vertical-align: middle !important;
}
.ruleSetTable th, 
.ruleSetTable td {
	text-align: center;
}
.ruleSetTable .el-input__inner {
	width: 60px; 
	text-align: center;
	font-size: 14px;
}
</style>
