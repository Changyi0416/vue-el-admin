<template>
  <div>
    <router-link :to="{name: 'shop_goods_list'}">
      <el-button plain size="mini" class="position-absolute" style="top: 14px; left: 170px;">
        <i class="el-icon-arrow-left"></i>回到商品列表
      </el-button>
    </router-link>
    <div class="position-absolute goods_create" style="top: 55px; bottom: 0; left: 20px; right: 20px;">
      <el-tabs v-model="tabIndex" @tab-click="handleClick">
        <el-tab-pane label="基础设置">
					<!-- 基础设置 -->
          <base-set></base-set>
        </el-tab-pane>
        <el-tab-pane label="商品规格">
					<el-form ref="form" label-width="80px">
						<el-form-item label="商品规格">
						  <el-radio-group size="small" 
							:value="skus_type" @input="vModel('skus_type', $event)">
						    <el-radio-button :label="0">统一规格</el-radio-button>
						    <el-radio-button :label="1">多规格</el-radio-button>
						  </el-radio-group>
						</el-form-item>
					</el-form>
					<!-- 统一规格 -->
					<template v-if="skus_type === 0">
						<simple-attrs></simple-attrs>
					</template>
					<!-- 多规格 -->
					<template v-else>
						<many-attrs></many-attrs>
					</template>
        </el-tab-pane>
        <el-tab-pane label="商品属性">
					<el-form label-width="80px" size="medium">
						<el-form-item label="商品类型">
							<el-select :value="shopType" placeholder="请选择" @change="vModel('shopType', $event)">
								<el-option label="区域一" value="1"></el-option>
								<el-option label="区域二" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>商品属性</span>
						</div>
						<div class="text item">
							<el-form label-width="80px" size="medium">
								<el-form-item label="手机型号">
									<el-input placeholder="请输入手机型号" style="width: 400px;"
									:value="shopAttrs.phone" @input="vModelShopAttrs({key: 'phone', val: $event})"></el-input>
								</el-form-item>
								<!-- <el-form-item label="单选框">
									<el-radio-group v-model="radio" size="medium">
										<el-radio label="1" border>备选项1</el-radio>
										<el-radio label="2" border>备选项2</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="多选框">
									<el-checkbox-group v-model="checkboxGroup" size="medium">
										<el-checkbox label="1" border></el-checkbox>
										<el-checkbox label="2" border></el-checkbox>
									</el-checkbox-group>
								</el-form-item> -->
							</el-form>
						</div>
					</el-card>
				</el-tab-pane>
        <el-tab-pane label="媒体设置">
					<el-form label-width="80">
						<el-form-item label="商品大图">
							<div class="d-flex flex-wrap">
								<div class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3 position-relative shopPic"
								v-for="(item, i) in shopPics" :key="i"
								@click="chooseImage(i)">
									<!-- 删除 -->
									<i class="el-icon-delete p-1 bg-secondary text-white rounded position-absolute" 
									style="top: 0; right: 0;"
									@click.stop="deletePic(i)"></i>
									<img v-if="item.img" :src="item.img" alt="" class="w-100 h-100">
									<i class="el-icon-plus" v-else
									style="font-size: 30px; color: rgb(207, 209, 212);"></i>
								</div>
								<div class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3 shopPic"
								@click="chooseImage" v-if="shopPics.length < 9">
									<i class="el-icon-plus" style="font-size: 30px; color: rgb(207, 209, 212);"></i>
								</div>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
        <el-tab-pane label="商品详情">
					<!-- 富文本编辑器 -->
					<tinymce ref="editor" v-model="msg" @onClick="onClick" />
				</el-tab-pane>
        <el-tab-pane label="折扣设置">
					<el-form label-width="80px">
						<el-form-item label="会员价" size="medium">
							<el-input :value="discount" style="width: 300px;"
							@input="vModel('discount', $event)">
								<template slot="append">%</template>
							</el-input>
						</el-form-item>
					</el-form>
				</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import baseSet from '@/components/shop/goods/base-set.vue';
	import simpleAttrs from '@/components/shop/goods/simple-attrs.vue';
	import manyAttrs from '@/components/shop/goods/many-attrs.vue';
	// 富文本编辑器
	import tinymce from '@/components/common/tinymce.vue'
export default {
	inject: ['app'],
	components: { baseSet, simpleAttrs, manyAttrs, tinymce },
  data() {
    return {
      tabIndex: '0',
			select: '',
			radio: '1',
			checkboxGroup: [],
			//富文本msh
			msg: 'Welcome to Use Tinymce Editor',
    };
  },
  computed: {
		...mapState('goods_create', ['skus_type', 'shopType', 'shopAttrs', 'shopPics', 'discount'])
  },
	created(){ },
  methods: {
		...mapMutations('goods_create', ['vModelState', 'vModelShopAttrs']),
		//修改表单的值
		vModel(key, val){
			this.vModelState({key, val});
		},
		//tab选项卡切换
    handleClick(tab, event) {
      // console.log(tab);
    },
		//选择商品大图
		chooseImage(i){
			let maxNum = 9, len = this.shopPics.length;
			let count = (maxNum - len) == 0 ? 1 : maxNum - len
			this.app.chooseImage(res => {
				//更换已选中的图
				if(typeof i === 'number') {
					this.shopPics.splice(i, 1, res[0])
					this.vModel('shopPics', this.shopPics);
					return
				}
				//添加商品详情图
				let arr = [...this.shopPics, ...res];
				this.vModel('shopPics', arr);
			}, count)
		},
		//删除商品大图
		deletePic(i){
			this.$confirm('是否删除该图片', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
			.then(() => {
				this.shopPics.splice(i, 1)
				this.vModel('shopPics', this.shopPics);
				this.$message({
					type: 'success',
					message: '删除成功'
				})
			})
			.catch(() => {});
		},
		chooseShopType(val){
			console.log(val)
		},
		// 富文本点击事件
		onClick (e, editor) {
			console.log('Element clicked')
			console.log(e)
			console.log(editor)
		},
  }
};
</script>

<style scoped>
.el-card__header{
	padding: 10px 20px;
	background-color: #C0C4CC;
}

.goods_create .el-form-item {
  margin-bottom: 10px;
}
.card-header {
  line-height: 1.2 !important;
}
.card-header .el-radio{
  margin-right: 14px;
  margin-bottom: 0;
}
.card-header .el-button--mini, .el-button--small{
  padding: 8px;
}

/* 商品大图 */
.shopPic {
	width: 120px; 
	height: 120px; 
	cursor: pointer; 
	border-style: dashed !important;
}
</style>