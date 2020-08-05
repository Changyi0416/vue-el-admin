<template>
		<!-- 底部分页 -->
		<el-footer class="px-0 d-flex align-items-center position-fixed bg-white"
		style="left:200px; right: 0; bottom: 0; z-index: 4;">
		  <div class="flex-grow-1 px-2 h-100 d-flex align-items-center">
				<!-- @size-change="handleSizeChange"
		       -->
		    <el-pagination
		      :current-page="currentPage"
		      :page-sizes="[10, 20, 30, 40]"
		      :page-size="10"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="40"
					@current-change="$emit('currentChange')">
		    </el-pagination>
		  </div>
		</el-footer>
</template>

<script>
	export default {
		props: {
			currentPage: {
				type: Number,
				default: 1
			}
		},
		data(){
			return {
				
			}
		},
		methods: {
			//分页
			handleSizeChange(val) {
			  console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
			  console.log(`当前页: ${val}`);
			},
		}
	}
</script>

<style>
</style>
