<template>
  <div>
    <el-container class="position-absolute" style="top: 55px; bottom: 0; left: 0; right: 0;">
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
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <el-input v-model="form.name" placeholder="相册名称" class="mr-2" style="width: 220px;"></el-input>
            <el-button type="success" @click="search">搜索</el-button>
          </div>
          <el-button type="warning" v-show="chooseImgList.length > 0" @click="cancelSelected()">取消选中</el-button>
          <el-button type="danger" v-show="chooseImgList.length > 0" @click="imageDel({all: true})">批量删除</el-button>
          <el-button type="success" @click="albumOpen(false)">创建相册</el-button>
          <el-button type="warning" @click="uploadModel = true">上传图片</el-button>
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
            <album-item
              v-for="(item, i) in albums"
              :key="i"
              :item="item"
              :i="i"
              :isActive="albumsIndex == i"
              @handel="albumsIndex = i"
              @open="albumOpen"
              @del="albumDel"
            ></album-item>
          </ul>
        </el-aside>
        <el-container>
          <!-- 主内容 -->
          <el-main class="position-absolute" style="top: 60px; left:180px; right: 0; bottom: 60px;">
            <el-row :gutter="10">
              <el-col
                :span="24"
                :lg="4"
                :md="6"
                :sm="8"
                :xs="12"
                v-for="(item, i) in imageArr"
                :key="i"
              >
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
                    <img :src="item.img" class="w-100" height="100" @click="imageSelected(item, i)" />
                    <div
                      class="w-100 text-white position-absolute text-left px-2"
                      style="background-color: rgba(0, 0, 0, 0.5); height: 30px; line-height: 30px; margin-top: -30px;"
                    >
                      <small>{{item.name}}</small>
                    </div>
                    <el-button-group class="mt-2">
                      <el-button icon="el-icon-view" size="mini" @click="imagePreview(item.img)"></el-button>
                      <el-button icon="el-icon-edit" size="mini" @click="imageEdit(item)"></el-button>
                      <el-button icon="el-icon-delete" size="mini" @click="imageDel({i})"></el-button>
                    </el-button-group>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-container>
      <el-footer class="px-0 d-flex align-items-center">
        <!-- 分页 -->
        <div style="width: 180px; flex-shrink: 0;" class="h-100 border-right d-flex justify-content-center align-items-center">
          <el-button-group>
            <el-button size="mini" @click="">下一页</el-button>
            <el-button size="mini" @click="">上一页</el-button>
          </el-button-group>
        </div>
        <div class="flex-grow-1 px-2 h-100 border-top d-flex align-items-center">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
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
    <el-dialog title="上传图片" :visible.sync="uploadModel" width="50%" @close="uploadModel = false">
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        drag
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
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
      albumEditIndex: -1, //被修改的id
      albumDialog: false,
      albumForm: {
        name: "",
        order: 0
      }, //创建|修改form
      albumsIndex: 0, //被active索引
      albums: [],
      //上传图片
      uploadModel: false,
      //图片预览
      previewModel: false,
      viewImage: "",
      imageArr: [],
      chooseImgList: [], //被选中的图片
      //分页
      currentPage: 4
    };
  },
  created() {
    this.__init();
  },
  computed: {
    albumEditTitle() {
      return this.albumEditIndex > -1 ? "修改相册" : "创建相册";
    }
  },
  methods: {
    //初始化相册列表
    __init() {
      for (let i = 0; i < 10; i++) {
        this.albums.push({
          name: "项目" + i,
          num: Math.floor(Math.random() * 100),
          order: 0
        });
      }
      for (let j = 0; j < 10; j++) {
        this.imageArr.push({
          id: j,
          img: require("../../static/19.jpg"),
          name: "图片" + (j + 1),
          isCheck: false,
          checkOrder: 0
        });
      }
    },
    //创建|新建 相册
    albumOpen(obj) {
      //编辑
      if (obj) {
        let { item, i } = obj;
        this.albumForm.name = item.name;
        this.albumForm.order = item.order;
        this.albumEditIndex = i;
        return (this.albumDialog = true);
      }
      //创建
      this.albumForm = {
        name: "",
        order: 0
      };
      this.albumEditIndex = -1;
      this.albumDialog = true;
    },
    //创建|编辑相册-模态框确定
    albumDialogEnter() {
      //编辑
      if (this.albumEditIndex > -1) {
        this.albumEdit();
      } else {
        //创建
        this.albums.unshift({
          name: this.albumForm.name,
          order: this.albumForm.order,
          num: 0
        });
      }
      this.albumDialog = false;
    },
    //编辑相册
    albumEdit() {
      this.albums[this.albumEditIndex].name = this.albumForm.name;
      this.albums[this.albumEditIndex].order = this.albumForm.order;
    },
    //删除相册
    albumDel(i) {
      this.$confirm("是否删除该相册", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.albums.splice(i, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    //预览图片
    imagePreview(img) {
      this.viewImage = img;
      this.previewModel = true;
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
          item.name = data.value;
          this.$message({
            message: "修改成功",
            type: "success"
          });
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
          //在imageArr中找到已选中的，取反->得到未选中的赋值给list
          let list = this.imageArr.filter(item => !item.isCheck);
          /* let list = this.imageArr.filter(item => {
            return !this.chooseImgList.some(img => img.id === item.id)
          }) */
          this.chooseImgList = [];
          this.imageArr = list;
        }else this.imageArr.splice(obj.i, 1); //删除一个
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      })
      .catch(e => e);
    },
    //选中图片
    imageSelected(item) {
      //选中
      if (!item.isCheck) {
        //chooseImgList加入选中
        this.chooseImgList.push({
          id: item.id,
          img: item.img
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
    cancelSelected(){
      //将图片的isCheck属性变为false，取消选中样式
      this.imageArr.forEach(item => {
        if(item.isCheck)  item.isCheck = false
      })
      //选中排序归0
      this.chooseImgList = []
    },
    //图片分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    search() {},
    create() {},
    upload() {}
  }
};
</script>

<style scoped>
</style>
