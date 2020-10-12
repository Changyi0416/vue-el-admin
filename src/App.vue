<template>
  <div>
    <router-view></router-view>
		<!-- 创建商品->商品规格->多规格->规格属性添加图片 -->
		<image-dialog ref="imageDialog" :maxNum="maxNum"></image-dialog>
		<!-- 创建商品->商品规格->多规格->选择规格项 -->
		<sku-dialog ref="skuDialog"></sku-dialog>
  </div>
</template>

<script>
import imageDialog from '@/components/image/image-dialog.vue';
import skuDialog from '@/components/shop/goods/sku-dialog.vue';
export default {
  name: "app",
	components: { imageDialog, skuDialog },
	//依赖注入
	provide(){
		return {
			app: this,
		}
	},
	data(){
		return {
			maxNum: 1
		}
	},
	created(){
		//初始化用户信息
		this.$store.commit('user/initUser');
	},
  methods: {
		//打开相册弹出层
		chooseImage(callback, maxNum){
			this.maxNum = maxNum
			//接受到的callback参数传给子组件(imageDialog)的open方法
			this.$refs.imageDialog.open(callback);
		},
		//打开选择规格值得弹出层
		chooseSkuval(callback){
			this.$refs.skuDialog.open(callback);
		}
	}
};
</script>

<style>
/* 修改全局滚动条样式 */
::-webkit-scrollbar{
  width:10px;
  height:10px;
}
::-webkit-scrollbar-track{
  background: rgb(239, 239, 239);
  border-radius:2px;
}
::-webkit-scrollbar-thumb{
  background: #bfbfbf;
  border-radius:10px;
}
::-webkit-scrollbar-thumb:hover{
  background: #b1b1b1;
}
::-webkit-scrollbar-corner{
  background: #179a16;
}

/* el-form */
.el-form-item--medium .el-form-item__label {
	margin-bottom: 0;
}
.el-dialog__body .el-form-item {
    margin-bottom: 20px !important;
}
/* btn样式 */
.el-button:hover, .el-button:focus {
  outline: none;
}
</style>
