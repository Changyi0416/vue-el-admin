<template>
	<div>
    <button-search ref="buttonSearch" placeholder="请输入" 
		@search="search">
     <!-- <template #form>
        <el-form ref="form" :model="form" label-width="80px" size="medium">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="评价用户">
                <el-input v-model="form.username" placeholder="要搜索的评价用户"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="评价类型">
                <el-select v-model="form.type" placeholder="请选择" >
                  <el-option label="全部" value="0"></el-option>
                  <el-option label="好评" value="1"></el-option>
                  <el-option label="差评" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发布时间">
                <el-date-picker v-model="form.time" type="daterange" 
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-button type="info" @click="search">搜索</el-button>
          <el-button type="reset" @click="searchReset">清空筛选条件</el-button>
        </el-form>
      </template> -->
    </button-search>
		<el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div class="media">
            <img class="mr-2" :src="scope.row.user.avatar" style="width:50px; height: 50px;" alt="Generic placeholder image">
            <div class="media-body">
              <h6 class="mt-0 d-flex align-items-center">
                {{scope.row.user.username}}
                <span class="text-secondary ml-2" style="font-size: 14px;">{{scope.row.review_time}}</span>
								<el-button v-show="!scope.row.extra.length && !isComment" class="ml-auto" type="info" size="small" 
								@click="isComment = true">回复</el-button>	
              </h6>
							<div>
								{{scope.row.review.data}}
								<div class="py-2" v-show="scope.row.review.image.length">
									<img v-for="(img, i) in scope.row.review.image" :key="i" :src="img" alt=""
									style="max-width: 100px; max-height: 100px;">
								</div>
							</div>
							<div v-show="isComment">
								<el-input type="textarea" v-model="commentText" placeholder="请输入"></el-input>
								<div class="py-2">
									<el-button type="success" size="small" @click="submitComment(scope.row.id)">回复</el-button>	
									<el-button type="info" size="small" @click="closeComment">取消</el-button>	
								</div>
							</div>
              <div class="media bg-light p-2 rounded" v-if="scope.row.extra.length"
							v-for="(item, i) in scope.row.extra" :key="i">
                <div class="media-body">
                  <h6 class="d-flex mt-0">
										客服：
										<el-button class="ml-auto" type="info" size="small" @click="isComment = true">修改</el-button>	
									</h6>
                  {{item.data}}
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
		  <el-table-column label="ID" prop="id" align="center" width="80px"></el-table-column>
		  <el-table-column label="商品">
        <template slot-scope="scope">
          <div class="d-flex">
            <img :src="scope.row.goods_item.cover" alt="" style="width: 80px; height: 80px;">
            <h6>{{scope.row.goods_item.title}}</h6>
          </div>
        </template>
      </el-table-column>
		  <el-table-column label="评价信息" >
        <template slot-scope="scope">
          <p>用户：{{scope.row.user.username}}</p>
          <p class="d-flex">评分：
            <el-rate v-model="scope.row.rating" :colors="starColors"> </el-rate>
          </p>
        </template>
      </el-table-column>
		  <el-table-column label="评价时间" prop="review_time" align="center" width="200"></el-table-column>
		  <el-table-column label="是否显示" width="150" align="center">
		    <template slot-scope="scope">
					<el-button class="mb-1" plain size="mini"
					  :type="scope.row.status ? 'success' : 'danger'"
					  @click="changeStatus(scope.row)"
					>{{scope.row.status ? '启用' : '禁用'}}</el-button>
		    </template>
		  </el-table-column>
		</el-table>
		<div style="height: 60px;"></div>
		<el-footer class="px-0 d-flex align-items-center position-fixed bg-white" 
		style="left:200px; right: 0; bottom: 0; z-index: 4;">
		  <div class="flex-grow-1 px-2 h-100 d-flex align-items-center">
				<el-pagination
				  @size-change="pageSizeChange"
				  @current-change="pageCurrentChange"
				  :current-page="page.current"
				  :page-sizes="page.sizes"
				  :page-size="page.size"
				  layout="total, sizes, prev, pager, next, jumper"
				  :total="page.total">
				</el-pagination>
		  </div>
		</el-footer>
	</div>
</template>

<script>
  import buttonSearch from "@/components/common/button-search.vue";
	import common from '@/common/mixins/common.js';
	export default {
		inject: ['layout'],
		mixins: [ common ],
    components: { buttonSearch },
		data(){
			return {
				axiosSign: 'goods_comment',
				signText: '评价',
        /* //高级搜索form表单数据
        form: {
          username: "",
          type: "",
          time: ""
        }, */
        starColors: ['#99A9BF', '#F7BA2A', '#FF9900'],
				tableData: [],
				//客服回复
				commentText: '',
				isComment: false,
			}
		},
		methods: {
			//搜索
			search(val){
				this.__init(`&title=${val}`)
			},
			searchReset(){},
			//提交回复
			submitComment(id){
				if(this.commentText == '') return this.$message.error('回复内容不可为空')
				this.axios.post(`/admin/goods_comment/review/${id}`, { data: this.commentText }, 
				{ token: true })
				.then(res => {
					console.log(res.data.data)
					this.closeComment()
					this.$message({type: 'success', message: '回复成功'})
					this.__init()
				})
			},
			//取消回复
			closeComment(){
				this.commentText = ''
				this.isComment = false
			},
			//批量删除
			deleteMore(){
				this.checkedSku.forEach(item => {
					let i = this.tableData.findIndex(v => item.id == v.id)
					this.tableData.splice(i, 1)
				})
			},
		}
	}
</script>

<style scoped>
</style>
