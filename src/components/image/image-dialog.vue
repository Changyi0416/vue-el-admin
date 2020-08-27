<template>
  <!-- 相册弹出层-选择相片 -->
  <el-dialog title="图片管理" class="chooseImage" :visible.sync="shopImageDia" width="90%" top="3vh"
		:before-close="close">
    <el-container style="height: 65vh;">
      <!-- 头部 -->
      <el-header class="d-flex">
        <el-form :model="form" ref="form" class="w-100 d-flex align-items-center">
          <div class="d-flex align-items-center mr-auto">
            <el-select
              v-model="form.order"
              placeholder="请选择图片排序方式"
              class="mr-2"
              style="width: 220px;"
            >
              <el-option label="升序" value="asc"></el-option>
              <el-option label="降序" value="desc"></el-option>
            </el-select>
            <el-input v-model="form.keyword" placeholder="相册名称" class="mr-2" style="width: 220px;"></el-input>
            <el-button type="success" @click="search">搜索</el-button>
          </div>
        </el-form>
      </el-header>
      <el-container style="position: relative;">
        <!-- 侧边 -->
        <el-aside
          width="180px"
          class="position-absolute bg-white border-right"
          style="top: 0; left:0; bottom: 0;"
        >
					<ul class="list-group list-group-flush">
						<album-item v-for="(item, i) in albums" :key="i"
							:item="item" :i="i" :isActive="albumsIndex == i"
              :isShow="false"
							@handel="albumHandel(item, i)"
						></album-item>
					</ul>
        </el-aside>
        <el-container v-loading="imgConLoading">
          <!-- 主内容 -->
          <el-main class="position-absolute" style="top: 0; left:180px; right: 0; bottom: 0;">
            <el-row :gutter="10" v-if="imageArr.length > 0">
							<el-col :span="24" :lg="4" :md="6" :sm="8" :xs="12"
                v-for="(item, i) in imageArr" :key="i">
                <el-card
                  class="mb-2"
                  :class="{'border border-danger': item.isCheck}"
                  shadow="hover"
                  :body-style="{ padding: '0', 'cursor': 'pointer' }"
                >
                  <div class="position-relative text-center pb-2">
                    <span
                      class="badge badge-danger position-absolute"
                      style="right: 0; top: 0;"
                      v-show="item.isCheck"
                    >{{item.checkOrder}}</span>
                    <img :src="item.url" class="w-100" height="100" @click="imageSelected(item, i)" />
                    <div
                      class="w-100 text-white position-absolute text-left px-2"
                      style="background-color: rgba(0, 0, 0, 0.5); height: 30px; line-height: 30px; margin-top: -30px;"
                    >
                      <small>{{item.name}}</small>
                    </div>
                    <el-button-group class="mt-2">
                      <el-button icon="el-icon-edit" size="mini" @click="imageEdit(item)"></el-button>
                      <!-- <el-button icon="el-icon-delete" size="mini" @click="imageDel({i})"></el-button> -->
                    </el-button-group>
                  </div>
                </el-card>
              </el-col>
            </el-row>
						<p v-else class="text-secondary">暂无图片</p>
          </el-main>
        </el-container>
      </el-container>
      <el-footer class="px-0 d-flex align-items-center">
        <!-- 分页 -->
        <div style="width: 180px; flex-shrink: 0;" class="h-100 border-right d-flex justify-content-center align-items-center">
          <el-button-group>
            <el-button size="mini" :disabled="albumPage == 1" @click="changeAlbumPage('pre')">上一页</el-button>
            <el-button size="mini" :disabled="albumPage == albumMaxPage" @click="changeAlbumPage('next')">下一页</el-button>
          </el-button-group>
        </div>
        <div class="flex-grow-1 px-2 h-100 border-top d-flex align-items-center">
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
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import albumItem from "@/components/image/album-item.vue";
export default {
	props: {
		maxNum: { //选择图片最大限制
			type: Number,
			default: 9
		}
	},
  components: { albumItem },
  data() {
    return {
			imgConLoading: false,
      shopImageDia: false,
      callback: false,

      form: {
        order: "",
        keyword: ""
      },
      //图片预览
      imageArr: [],
      chooseImgList: [], //被选中的图片
			
			//相册列表
			albumsIndex: 0, //被active索引
			albumPage: 1, //相册页码
			albumMaxPage: -1, //相册最大页码
			albums: [],
			currentAlbumId: -1, //选中相册id
			//分页
			page: {
				current: 1, //当前所在页数
				sizes: [5, 10, 20, 50],
				size: 10, //一页显示多少条
				total: 0, //总数量
			}
    };
  },
  created() {
    this.__init();
  },
  methods: {
    //打开【选择图片】弹出层
    open(callback) {
      this.callback = callback;
      this.shopImageDia = true;
    },
    confirm() {
      //返回选中的url
      if (typeof this.callback === "function") {
        this.callback(this.chooseImgList);
      }
      //隐藏弹出层
      this.close();
			this.cancelSelected(); //取消所有选中的图片
    },
    //关闭【选择图片】弹出层
    close() {
      this.callback = false; //callback重置
      this.shopImageDia = false; //关闭
			this.cancelSelected(); //取消所有选中的图片
    },
		//初始化相册列表
		__init(type) {
				this.imgConLoading = true
			let params = `&order=${this.form.order}&keyword=${this.form.keyword}`
			this.axios.get(`/admin/imageclass/${this.albumPage}?limit=10${params}`, { token: true })
			.then(res => {
				console.log(res)
				this.albums = res.data.data.list
				this.albumMaxPage = Math.ceil(res.data.data.totalCount/10)
				//切换页码时，图片应显示相册列表第一个相册里的图片
				if(type == 'page') this.currentAlbumId = this.albums[0].id 
				else this.currentAlbumId = this.currentAlbumId < 0 ? this.albums[0].id : this.currentAlbumId
				if(type == 'add') {
					this.albumsIndex = this.albums.findIndex(v => {
						return v.id == this.currentAlbumId
					})
				}
				if(type == 'delete') this.currentAlbumId = this.albums[this.albumsIndex].id
				if(type == 'change') return
				this.getImage()
				this.imgConLoading = false
			})
			.catch(err => this.imgConLoading = false)
		},
		//获取相册里的图片
		getImage(){
			this.imgConLoading = true
			this.axios.get(`/admin/imageclass/${this.currentAlbumId}/image/${this.page.current}?limit=${this.page.size}`, 
			{ token: true })
			.then(res => {
				let Data = res.data.data
				this.imageArr = Data.list.map(item => {
					return {
						id: item.id,
						url: item.url,
						name: item.name,
						isCheck: false,
						checkOrder: 0
					}
				})
				this.page.total = Data.totalCount
				this.imgConLoading = false
			})
			.catch(err => this.imgConLoading = false)
		},
    //点击相册
    albumHandel(item, i){
    	this.albumsIndex = i //改变索引
    	this.currentAlbumId = item.id
    	this.getImage() 
    	this.chooseImgList = [] //清空之前选中的图片
    },
		//相册分页
		changeAlbumPage(sign){
			if(sign == 'pre') this.albumPage--
			else if(sign == 'next') this.albumPage++
			this.__init('page')
		},
		//编辑图片信息
    imageEdit(item) {
      this.$prompt("请输入新名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: item.name, //input初始文本
        inputPlaceholder: "请输入",
        inputPattern: /.*[^\s]/,
        inputErrorMessage: "名称不能为空"
      })
			.then(data => {
				this.axios.post(`/admin/image/${item.id}`, { name: data.value }, { token: true })
				.then(res => {
					this.$message({
						message: "修改成功",
						type: "success"
					});
					this.getImage()
				})
			})
			.catch(() => {})
    },
    //选中图片
    imageSelected(item) {
      //选中
      if (!item.isCheck) {
				//选中图片个数限制
				if(this.chooseImgList.length >= this.maxNum) return this.$message({message: `最多选择${this.maxNum}张图片`, type: 'error'})
        //chooseImgList加入选中
        this.chooseImgList.push({
          id: item.id,
          url: item.url
        });
        //计算序号
        item.checkOrder = this.chooseImgList.length;
        //修改状态
        item.isCheck = true;
        return;
      }
      //取消选中
      //找到在chooseImgList中的索引
      let i = this.chooseImgList.findIndex(v => v.id === item.id);
      //未找到
      if (i == -1) return;
      //重新计算选中的序号
      let len = this.chooseImgList.length;
      //判断取消的图片是否是最后一个（最后一个之前）
      if (i + 1 < len) {
        for (let j = i; j < len; j++) {
          let findIndex = this.imageArr.findIndex(
            v => v.id === this.chooseImgList[j].id
          );
          if (findIndex > -1) {
            this.imageArr[findIndex].checkOrder--;
          }
        }
      }
      //删除
      this.chooseImgList.splice(i, 1);
      //修改状态
      item.isCheck = false;
      //重置序号
      item.checkOrder = 0;
    },
    //取消选中
    cancelSelected() {
      //将图片的isCheck属性变为false，取消选中样式
      this.imageArr.forEach(item => {
        if (item.isCheck) item.isCheck = false;
      });
      //选中排序归0
      this.chooseImgList = [];
    },
    //图片分页（每页几条）
    pageSizeChange(val) {
			this.page.size = val
			this.getImage()
    },
		//图片分页（页码切换）
    pageCurrentChange(val) {
			this.page.current = val
			this.getImage()
    },
    search() {
			this.__init()
		}
  }
};
</script>

<style>
.chooseImage .el-dialog__body {
  padding: 0;
}
</style>
