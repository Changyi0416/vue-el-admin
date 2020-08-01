<template>
	<div class="d-flex align-items-center position-relative">
		<div class="d-flex align-items-center mr-2" v-if="type != 0">
			<!-- 颜色 -->
			<el-color-picker v-show="type === 1" 
			:value="current.color" @input="vModelSkuVal2(i, j, 'color', $event)"></el-color-picker>
			<!-- 图片 -->
			<div v-show="type === 2">
				<div class="btn border p-0 d-flex align-items-center justify-content-center"
				:class="{'btn-light': imageIsNone}"
				style="width: 40px; height: 40px;" 
				:style="{'border-style': (imageIsNone ? 'dashed' : 'none')+' !important'}"
				@click="chooseImage(i, j)">
					<i class="el-icon-plus text-muted" v-if="imageIsNone"></i>
					<img class="w-100 h-100" v-else :src="current.image">
				</div>
			</div>
		</div>
		<!-- 规格值 -->
		<el-input class="sku-card-val" style="width: 80px; font-size: 14px;"
		:value="current.name" @input="vModelSkuVal2(i, j, 'name', $event)"></el-input>
		<!-- 删除规格值 -->
		<span class="btn btn-light p-0 position-absolute" style="line-height: 1; right: -16px; top: -13px;"
		@click="deleSkuVal({i, j})">
			<i class="el-icon-circle-close text-muted"></i>
		</span>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		inject: ['app'],
		props: {
			current: Object,
			i: Number,
			j: Number,
			type: Number
		},
		data(){
			return {}
		},
		computed: {
			...mapState('goods_create', ['sku_card']),
			imageIsNone(){
				return this.current.image === '' ? true : false;
			}
		},
		methods: {
			...mapMutations('goods_create', ['vModelSkuVal', 'deleSkuVal']),
			//修改规格值
			vModelSkuVal2(i, j, key, val){
				this.vModelSkuVal({i, j, key, val});
			},
			//选择图片
			chooseImage(i, j){
				this.app.chooseImage((res) => {
					this.vModelSkuVal({i, j, key: 'image', val: res[0].img});
				}, 1);
			}
		}
	}
</script>

<style scoped>
.el-input__inner {
		border-color: transparent !important;
		text-align: center;
		padding: 0 4px;
	}
.el-input__inner:hover {
		border-color: #C0C4CC;
	}
.el-input__inner:focus {
		border-color: #409EFF;
	}
</style>
