<template>
	<div>
		<div class="d-flex align-items-center mb-2">
			<!-- 左侧操作按钮 -->
			<div class="mr-auto">
				<slot name="left"></slot>
			</div>
			<!-- 右侧搜索 -->
			<div v-show="!searchSeniorShow">
				<slot name="right">
					<div class="d-flex align-items-center">
						<el-input type="text" v-model="keyword" size="small" :placeholder="placeholder" class="mr-2" style="width: 150px;"></el-input>
						<el-button size="small" type="info" @click="$emit('search', keyword)">搜索</el-button>
						<el-button size="small" v-show="hasSearchSenior" @click="searchSeniorShow = true">高级搜索</el-button>
					</div>
				</slot>
			</div>
		</div>
		<el-card class="bg-light mb-2" :body-style="{ 'padding': '10px'}" v-show="searchSeniorShow">
			<div slot="header" class="clearfix">
				<span>高级搜索</span>
				<el-button class="text-pramiry" style="float: right; padding: 3px 0" type="text" @click="searchSeniorClose">收起</el-button>
			</div>
			<div>
				<slot name="form"></slot>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		props: {
			placeholder: {
				type: String,
				default: ''
			},
			hasSearchSenior: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				keyword: '',
				searchSeniorShow: false
			}
		},
		created() {
		},
		methods: {
			//收起高级搜索
			searchSeniorClose() {
				this.searchSeniorShow = false;
				this.keyword = ''
			}
		},
	}
</script>

<style>
</style>
