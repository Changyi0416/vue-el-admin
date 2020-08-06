<template>
	<div>
    <button-search ref="buttonSearch" placeholder="请输入">
      <template #left>
			  <el-button size="small" type="danger" @click="deleteMore">批量删除</el-button>
      </template>  
      <template #form>
        <el-form ref="form" :model="form" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="评价用户">
                <el-input v-model="form.username" size="mini" placeholder="要搜索的评价用户"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="评价类型">
                <el-select v-model="form.type" placeholder="请选择" size="mini">
                  <el-option label="全部" value="0"></el-option>
                  <el-option label="好评" value="1"></el-option>
                  <el-option label="差评" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发布时间">
                <el-date-picker v-model="form.time" type="daterange" 
                  size="mini"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-button size="mini" type="info" @click="search">搜索</el-button>
          <el-button size="mini" type="reset" @click="searchReset">清空筛选条件</el-button>
        </el-form>
      </template>
    </button-search>
		<el-table :data="tableData" style="width: 100%" border @selection-change="selectChange">
		  <el-table-column type="selection" fixed="left" align="center"></el-table-column>
      <el-table-column type="expand">
        <template>
          <div class="media">
            <img class="mr-3" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="width:60px; height: 60px;" alt="Generic placeholder image">
            <div class="media-body">
              <h6 class="mt-0 d-flex">
                用户名1
                <span class="text-secondary ml-2" style="font-size: 14px;">2020-08-06 10:11:59</span>
                <el-button type="danger" size="mini" style="margin-left: auto;">删除</el-button>
              </h6>
              评论信息1
              <div class="media mt-3">
                <a class="pr-3" href="#">
                  <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="width:60px; height: 60px;" alt="Generic placeholder image">
                </a>
                <div class="media-body">
                  <h6 class="mt-0 d-flex">
                    用户名2
                    <span class="text-secondary ml-2" style="font-size: 14px;">2020-08-06 10:11:59</span>
                    <div style="margin-left: auto;">
                      <el-button type="success" size="mini">编辑</el-button>
                      <el-button type="danger" size="mini">删除</el-button>
                    </div>
                  </h6>
                  评论信息2
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
            <img :src="scope.row.goods.cover" alt="" style="width: 100px; height: 100px;">
            <h6>{{scope.row.goods.title}}</h6>
          </div>
        </template>
      </el-table-column>
		  <el-table-column label="评价信息" >
        <template slot-scope="scope">
          <p>用户：{{scope.row.username}}</p>
          <p class="d-flex">评分：
            <el-rate v-model="scope.row.star" :colors="starColors"> </el-rate>
          </p>
        </template>
      </el-table-column>
		  <el-table-column label="评价时间" prop="create_time" align="center" width="200"></el-table-column>
		  <el-table-column label="是否显示" width="150">
		    <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
		    </template>
		  </el-table-column>
		</el-table>
		<el-footer class="px-0 d-flex align-items-center position-fixed bg-white" 
		style="left:200px; right: 0; bottom: 0; z-index: 4;">
		  <div class="flex-grow-1 px-2 h-100 d-flex align-items-center">
		    <el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="currentPage"
		      :page-sizes="[10, 20, 30, 40]"
		      :page-size="10"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="40">
		    </el-pagination>
		  </div>
		</el-footer>
	</div>
</template>

<script>
  import buttonSearch from "@/components/common/button-search.vue";
	export default {
    components: { buttonSearch },
		data(){
			return {
        //高级搜索form表单数据
        form: {
          username: "",
          type: "",
          time: ""
        },
        starColors: ['#99A9BF', '#F7BA2A', '#FF9900'],
				tableData: [
					{
						id: 11231,
						goods: {
              title: '商品名称',
              cover: 'http://static.yoshop.xany6.com/2018071718294208f086786.jpg'
            },
            username: '用户名',
            star: 3,
            create_time: '2020-08-06 10:11:59',
            status: 1
					},
					{
						id: 2353454,
						goods: {
              title: '商品名称',
              cover: 'http://static.yoshop.xany6.com/2018071718294208f086786.jpg'
            },
            username: '用户名',
            star: 3,
            create_time: '2020-08-06 10:11:59',
            status: 1
					},
				],
				//多选
				checkedComment: [],
				//分页
				currentPage: 1
			}
		},
		methods: {
			search(){},
			searchReset(){},
			//多选
			selectChange(val) {
			  this.checkedComment = val;
			  console.log(this.checkedComment);
			},
			//批量删除
			deleteMore(){
				this.checkedSku.forEach(item => {
					let i = this.tableData.findIndex(v => item.id == v.id)
					this.tableData.splice(i, 1)
				})
			},
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

<style scoped>
</style>
