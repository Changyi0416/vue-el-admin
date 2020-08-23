<template>
  <div>
    <el-container class="bg-light position-absolute" style="top: 55px; bottom: 0; left: 0; right: 0;">
      <!-- 头部 -->
      <el-header class="d-flex">
        <el-form :model="form" ref="form" size="mini" class="w-100 d-flex align-items-center">
          <div class="d-flex align-items-center mr-auto">
            <el-select
              v-model="form.order"
              placeholder="请选择图片排序方式"
              class="mr-2"
              style="width: 220px;" size="medium"
            >
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <el-input v-model="form.name" size="medium" placeholder="相册名称" class="mr-2" style="width: 220px;"></el-input>
            <el-button type="success" size="medium" @click="search">搜索</el-button>
          </div>
          <el-button type="warning" size="medium" v-show="chooseImgList.length > 0" @click="cancelSelected()">取消选中</el-button>
          <el-button type="danger" size="medium" v-show="chooseImgList.length > 0" @click="imageDel({all: true})">批量删除</el-button>
          <el-button type="success" size="medium" @click="albumOpen(false)">创建相册</el-button>
          <el-button type="warning" size="medium" @click="uploadModel = true">上传图片</el-button>
        </el-form>
      </el-header>
      <el-container>
        <!-- 侧边 -->
        <el-aside
          width="180px"
          class="position-absolute bg-white border-right"
          style="top: 60px; left:0; bottom: 60px;"
        >
          <ul class="list-group list-group-flush">
            <album-item v-for="(item, i) in albums" :key="i"
              :item="item" :i="i" :isActive="albumsIndex == i"
              @handel="albumHandel(item, i)"
              @open="albumOpen"
              @del="albumDel(item.id)"
            ></album-item>
          </ul>
        </el-aside>
        <el-container>
          <!-- 主内容 -->
          <el-main class="position-absolute" style="top: 60px; left:180px; right: 0; bottom: 60px;">
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
                      <el-button icon="el-icon-view" size="mini" @click="imagePreview(item.url)"></el-button>
                      <el-button icon="el-icon-edit" size="mini" @click="imageEdit(item)"></el-button>
                      <el-button icon="el-icon-delete" size="mini" @click="imageDel({id: item.id})"></el-button>
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
            :current-page="currentPage"
            :page-sizes="[10, 20, 30]"
            :page-size="imgPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="imgTotal">
          </el-pagination>
        </div>
      </el-footer>
    </el-container>

    <!-- 创建|编辑相册-模态框 -->
    <el-dialog :title="albumEditTitle" :visible.sync="albumDialog" width="50%">
      <el-form :model="albumForm" ref="albumForm" label-width="80px">
        <el-form-item label="相册名称">
          <el-input v-model="albumForm.name" size="medium" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="相册排序">
          <el-input-number v-model="albumForm.order" :min="0" size="medium"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="albumDialog = false">取 消</el-button>
        <el-button type="primary" @click="albumDialogEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 上传图片-模态框 -->
    <el-dialog title="上传图片" :visible.sync="uploadModel" width="45%" @close="uploadModel = false">
      <el-upload class="upload-demo" action="/admin/image/upload"
			style="display: block; margin: 0 atuo;"
        drag multiple
				:headers="{ token: $store.state.user.token }"
				:data="{ image_class_id: currentAlbumId }"
				name="img"
				:on-success="uploadSuccess"
				:file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
    <!-- 图片预览-模态框 -->
    <el-dialog :visible.sync="previewModel" width="50%">
      <div class style="margin: -60px -20px -30px;">
        <img :src="viewImage" class="w-100" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import albumItem from "@/components/image/album-item.vue";
export default {
	inject: ['layout'],
	
  components: {
    albumItem
  },
  data() {
    return {
      form: {
        order: "",
        name: ""
      },
      //相册列表
      albumEditId: -1, //被修改的id
      albumDialog: false,
			//创建|修改form
      albumForm: {
        name: "",
        order: 0
      }, 
      albumsIndex: 0, //被active索引
			albumPage: 1, //相册页码
			albumMaxPage: -1, //相册最大页码
      albums: [],
			currentAlbumId: -1, //选中相册id
      //上传图片
      uploadModel: false, //上传图片模态框
			fileList: [], //上传的文件列表
      previewModel: false, //图片预览
      viewImage: "",
      imageArr: [],
      chooseImgList: [], //被选中的图片
      //分页
			imgPage: 1, //图片页码
			imgTotal: 0, //图片总数量
			imgPageSize: 10, //一页显示多少张图片
      currentPage: 1 //当前所在页数
    };
  },
  created() {
    this.__init();
  },
  computed: {
    albumEditTitle() {
      return this.albumEditId > -1 ? "修改相册" : "创建相册";
    }
  },
  methods: {
    //初始化相册列表
    __init(type) {
			this.axios.get(`/admin/imageclass/${this.albumPage}?limit=10`, { token: true })
			.then(res => {
				this.albums = res.data.data.list
				this.albumMaxPage = Math.ceil(res.data.data.totalCount/10)
				//切换页码时，图片应显示相册列表第一个相册里的图片
				if(type == 'page') this.currentAlbumId = this.albums[0].id 
				else this.currentAlbumId = this.currentAlbumId < 0 ? this.albums[0].id : this.currentAlbumId
				// if(type == 'add' && this.albumsIndex != 0) return
				if(type == 'add') {
					this.albumsIndex = this.albums.findIndex(v => {
						return v.id == this.currentAlbumId
					})
					console.log(this.albumsIndex)
				}
				if(type == 'delete') this.currentAlbumId = this.albums[this.albumsIndex].id
				if(type == 'change') return
				this.getImage()
			})
    },
		//获取相册里的图片
		getImage(){
			this.layout.loading = true
			this.axios.get(`/admin/imageclass/${this.currentAlbumId}/image/${this.imgPage}?limit=${this.imgPageSize}`, 
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
				this.imgTotal = Data.totalCount
				this.layout.loading = false
			})
			.catch(err => {
				this.layout.loading = false
			})
		},
		//点击相册
		albumHandel(item, i){
			this.albumsIndex = i //改变索引
			this.currentAlbumId = item.id
			this.getImage() 
			this.chooseImgList = [] //清空之前选中的图片
		},
    //创建|新建 相册
    albumOpen(item) {
      //编辑
      if (item) {
        this.albumForm.name = item.name;
        this.albumForm.order = item.order;
				this.albumEditId = item.id
        return (this.albumDialog = true)
      }
      //创建
      this.albumForm = {
        name: "",
        order: 0
      };
      this.albumEditId = -1;
      this.albumDialog = true;
    },
    //创建|编辑相册-模态框确定
    albumDialogEnter() {
      //编辑
      if (this.albumEditId > -1) {
        this.albumEdit();
      } else {
        //创建
				this.axios.post('/admin/imageclass', this.albumForm, { token: true })
				.then((res) => {
					if(res.data.msg == 'ok') {
						this.currentAlbumId = +res.data.data.id
						//创建成功，刷新相册列表
						this.__init('add')
						
					}
				})
      }
      this.albumDialog = false;
    },
    //编辑相册
    albumEdit() {
			this.axios.post(`/admin/imageclass/${this.albumEditId}`, this.albumForm, { token: true })
			.then(res => {
				console.log(res);
				this.__init('change')
			})
    },
    //删除相册
    albumDel(id) {
      this.$confirm("是否删除该相册", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
			.then(() => {
				this.axios.delete(`/admin/imageclass/${id}`, { token: true })
				.then(res => {
					if(res.data.msg == 'ok') {
						this.$message({
							type: "success",
							message: "删除成功!"
						});
						this.__init('delete')
					}
				})
			})
			.catch(() => {});
    },
    //相册分页
		changeAlbumPage(sign){
			if(sign == 'pre') this.albumPage--
			else if(sign == 'next') this.albumPage++
			this.__init('page')
		},
		//上传图片成功函数
		uploadSuccess(res, file, fileList){
			if(res.msg == 'ok'){
				this.$message({type: 'success', message: '上传成功'})
				this.uploadModel = false //关闭模态框
				this.fileList = []
				this.__init()
			}
		},
		//预览图片
    imagePreview(img) {
      this.viewImage = img;
      this.previewModel = true;
    },
    //编辑图片信息
    imageEdit(item) {
			console.log(item)
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
					console.log(res)
					this.$message({
						message: "修改成功",
						type: "success"
					});
					this.getImage()
				})
			})
			.catch(e => e);
    },
    //删除图片
    imageDel(obj) {
      this.$confirm('是否删除'+ (obj.all ? '选中' : '该') + '图片', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        //批量删除
        if (obj.all) {
					console.log(this.chooseImgList);
					this.axios.post('/admin/image/delete_all', { ids: this.chooseImgList }, { token: true })
					.then(res => {
						console.log(res)
						this.$message({type: 'success', message: '删除成功'})
						this.__init()
						this.chooseImgList = []
					})
        }//删除一个
				else if(obj.id){
					// this.imageArr.splice(obj.i, 1);
					console.log(obj)
					this.axios.delete(`/admin/image/${obj.id}`, { token: true })
					.then(res => {
						this.$message({ type: "success",  message: "删除成功!"});
						this.__init()
					})
				} 
      })
      .catch(e => e);
    },
    //选中图片
    imageSelected(item) {
      //选中
      if (!item.isCheck) {
        //chooseImgList加入选中
        /* this.chooseImgList.push({
          id: item.id,
          url: item.url
        }); */
				this.chooseImgList.push(item.id);
        //计算序号
        item.checkOrder = this.chooseImgList.length;
        //修改状态
        item.isCheck = true;
        return;
      }
      //取消选中
      //找到在chooseImgList中的索引
      let i = this.chooseImgList.findIndex(v => v === item.id);
      //未找到
      if (i == -1) return;
      //重新计算选中的序号
      let len = this.chooseImgList.length;
      //判断取消的图片是否是最后一个（最后一个之前）
      if (i + 1 < len) {
        for (let j = i; j < len; j++) {
          let findIndex = this.imageArr.findIndex(
            v => v.id === this.chooseImgList[j]
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
    cancelSelected(){
      //将图片的isCheck属性变为false，取消选中样式
      this.imageArr.forEach(item => {
        if(item.isCheck)  item.isCheck = false
      })
      //选中排序归0
      this.chooseImgList = []
    },
    //图片分页（每页几条）
    pageSizeChange(val) {
			this.imgPageSize = val
			this.getImage()
    },
		//图片分页（页码切换）
    pageCurrentChange(val) {
			this.imgPage = val
			this.getImage()
    },
    search() {},
    create() {},
    upload() {}
  }
};
</script>

<style scoped>
</style>
