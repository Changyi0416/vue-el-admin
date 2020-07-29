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
        <el-tab-pane label="商品熟悉">商品熟悉
					<!-- <div class="color-list">
							<div class="color-item"
									v-for="color in colors" v-dragging="{ item: color, list: colors, group: 'color' }"
									:key="color.text"
							>{{color.text}}</div>
					</div> -->
				</el-tab-pane>
        <el-tab-pane label="媒体设置">媒体设置</el-tab-pane>
        <el-tab-pane label="商品详情">
					<!-- 富文本编辑器 -->
					<tinymce
						ref="editor"
						v-model="msg"
						@onClick="onClick"
					/>
				</el-tab-pane>
        <el-tab-pane label="折扣设置">折扣设置</el-tab-pane>
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
	components: { baseSet, simpleAttrs, manyAttrs, tinymce },
  data() {
    return {
      tabIndex: '1',
			/* colors: [
				{ text: "Aquamarine" }, 
				{ text: "Hotpink" },
				{ text: "Gold" }, 
				{ text: "Crimson" }, 
				{ text: "Blueviolet" }, 
				{ text: "Lightblue" }, 
				{ text: "Cornflowerblue" }, 
				{ text: "Skyblue" }, 
				{ text: "Burlywood" }
			], */
			msg: 'Welcome to Use Tinymce Editor',
    };
  },
  computed: {
		...mapState('goods_create', ['skus_type'])
  },
  methods: {
		...mapMutations('goods_create', ['vModelState']),
		//修改表单的值
		vModel(key, val){
			this.vModelState({key, val});
		},
    handleClick(tab, event) {
      // console.log(tab);
    },
    //批量设置
		plset(){ },
		// 鼠标单击的事件
		onClick (e, editor) {
				console.log('Element clicked')
				console.log(e)
				console.log(editor)
		},
  }
};
</script>

<style scoped>
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
</style>