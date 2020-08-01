<template>
	<table class="ruleSetTable table table-sm table-bordered">
	  <thead>
	    <tr>
	      <th scope="col" v-for="(th, i) in tableThs" :key="i"
				:colspan="th.colspan ? th.colspan : 1" :rowspan="th.rowspan">{{th.name}}</th>
	    </tr>
	    <tr>
	      <th scope="col" v-for="(item, i) in sku_card" :key="i">{{item.name}}</th>
	    </tr>
	  </thead>
	  <tbody>
	    <tr v-for="(tr, i) in tableList" :key="i">
				<td v-for="(td, j) in tr.skus" :key="j">{{td.name}}</td>
	      <td>
					<span class="btn rounded border p-0" 
					style="border-style: dashed !important; width: 40px; height: 40px;"
					@click="chooseImage(tr)">
						<i class="el-icon-plus text-muted" style="margin-top: 10px;" v-if="tr.image == ''"></i>
						<img :src="tr.image" v-else class="w-100 h-100">
					</span>
				</td>
				<td><el-input size="mini" v-model="tr.pprice"></el-input></td> <!-- 销售价 -->
	      <td><el-input size="mini" v-model="tr.oprice"></el-input></td> <!-- 市场价 -->
	      <td><el-input size="mini" v-model="tr.cprice"></el-input></td> <!-- 成本价 -->
	      <td><el-input size="mini" v-model="tr.stock"></el-input></td> <!-- 库存 -->
	      <td><el-input size="mini" v-model="tr.volume"></el-input></td> <!-- 体积 -->
	      <td><el-input size="mini" v-model="tr.weight"></el-input></td> <!-- 重量 -->
	      <td><el-input size="mini" v-model="tr.code"></el-input></td> <!-- 编码 -->
	    </tr>
	  </tbody>
	</table>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	export default {
		inject: ['app'],
		data(){
			return {
				tableList: []
			}
		},
		computed: {
			...mapState('goods_create', ['sku_card']),
			...mapGetters('goods_create',['tableThs', 'tableData'])
		},
		watch: {
			tableData(newValue, oldValue){
				this.tableList = newValue;
			}
		},
		created(){
			this.tableList = this.tableData;
			// console.log(this.tableList);
		},
		methods: {
			chooseImage(item){
				this.app.chooseImage((res) => {
					item.image = res[0].img
				}, 1)
			}
		}
	}
</script>

<style>
</style>
