<template>
	<el-card class="bg-light mb-2" :body-style="{ 'padding': '10px'}" v-show="searchSeniorShow">
		<div slot="header" class="clearfix">
			<span>高级搜索</span>
			<el-button class="text-pramiry" style="float: right; padding: 3px 0" type="text" @click="$emit('searchSeniorClose')">收起</el-button>
		</div>
		<div>
			<el-form ref="form" :model="form" label-width="80px">
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="商品名称">
							<el-input v-model="form.name" size="mini" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="商品编码">
							<el-input v-model="form.code" size="mini" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="商品类型">
							<el-select v-model="form.type" size="mini" placeholder="请选择">
								<el-option label="区域一" value="1"></el-option>
								<el-option label="区域二" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="商品分类">
							<el-select v-model="form.category" size="mini" placeholder="请选择">
								<el-option label="区域一" value="1"></el-option>
								<el-option label="区域二" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-button size="mini" type="info" @click="$emit('search', form)">搜索</el-button>
				<el-button size="mini" type="reset" @click="$emit('searchReset', '2')">清空筛选条件</el-button>
			</el-form>
		</div>
	</el-card>
</template>

<script>
	export default {
		props: {
			searchSeniorShow: {
				type: Boolean,
				default: false
			},
			form: Object
		},
		created() {
			console.log(this.searchSeniorShow);
		},
		methods: {
		}
	}
</script>

<style>
</style>
