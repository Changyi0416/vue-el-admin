<template>
	<el-form ref="form" label-width="80px">
		<el-form-item label="市场价格">
			<el-input type="number" style="width: 200px;"
		  :value="oprice" @input="vModel('oprice', $event)">
				<template slot="append">元</template>
			</el-input>
		</el-form-item>
		<el-form-item label="销售价格">
			<el-input type="number" style="width: 200px;"
		  :value="pprice" @input="vModel('pprice', $event)">
				<template slot="append">元</template>
			</el-input>
		</el-form-item>
		<el-form-item label="成本价格">
			<el-input type="number" style="width: 200px;"
		  :value="cprice" @input="vModel('cprice', $event)">
				<template slot="append">元</template>
			</el-input>
		</el-form-item>
		<el-form-item label="商品重量">
			<el-input type="number" style="width: 200px;"
		  :value="weight" @input="vModel('weight', $event)">
				<template slot="append">公斤</template>
			</el-input>
		</el-form-item>
		<el-form-item label="商品体积">
			<el-input type="number" style="width: 200px;"
		  :value="volume" @input="vModel('volume', $event)">
				<template slot="append">立方米</template>
			</el-input>
		</el-form-item>
	</el-form>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		data(){
			return {
				
			}
		},
		computed: {
			...mapState('goods_create', ['oprice', 'pprice', 'cprice', 'weight', 'volume'])
		},
		methods: {
			...mapMutations('goods_create', ['vModelState']),
			//修改表单的值
			vModel(key, val){
				this.vModelState({key, val});
			},
		},
	}
</script>

<style>
</style>
