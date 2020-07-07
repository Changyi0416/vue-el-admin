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
          <el-button type="success" @click="albumOpen(false)">创建相册</el-button>
          <el-button type="warning" @click="upload">上传图片</el-button>
        </el-form>
      </el-header>
      <el-container>
        <!-- 侧边 -->
        <el-aside
          width="200px"
          class="position-absolute bg-white border-right"
          style="top: 60px; left:0; bottom: 60px;"
        >
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item list-group-item-action border-bottom-0 d-flex align-items-center"
              style="cursor: pointer;"
              :class="{'album-active': albumsIndex == i}"
              v-for="(item, i) in albums"
              :key="i"
              @click.stop="albumsIndex = i"
            >
              {{item.name}}
              <el-dropdown class="ml-auto">
                <span class="btn btn-light text-muted" size="mini">
                  {{item.num}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.stop.native="albumOpen({item, i})">修改</el-dropdown-item>
                  <el-dropdown-item @click.stop.native="albumDel(i)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
        </el-aside>
        <el-container>
          <!-- 主内容 -->
          <el-main
            class="position-absolute"
            style="top: 60px; left:200px; right: 0; bottom: 60px;"
          >Main</el-main>
        </el-container>
      </el-container>
      <el-footer>Footer</el-footer>
    </el-container>

    <!-- 创建|编辑相册-模态框 -->
    <el-dialog title="创建相册" :visible.sync="albumDialog" width="50%" @close="dialogClose">
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
        <el-button type="primary" @click="dialogEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        order: "",
        name: ""
      },
      albumEditIndex: -1,
      albumDialog: false,
      albumForm: {
        name: "",
        order: 0
      },
      albumsIndex: 0,
      albums: []
    };
  },
  created() {
    this.__init();
  },
  methods: {
    //初始化相册列表
    __init() {
      for (let i = 0; i < 5; i++) {
        this.albums.push({
          name: "项目" + i,
          num: Math.floor(Math.random() * 100),
          order: 0
        });
      }
    },
    //创建|新建 相册
    albumOpen(obj) {
      //编辑
      if(obj){
        let {item, i} = obj;
        this.albumForm.name = item.name;
        this.albumForm.order= item.order;
        this.albumEditIndex = i;
        return this.albumDialog = true;
      }
      //创建
      this.albumForm = {
        name: '',
        order: 0
      }
      this.albumEditIndex = -1
      this.albumDialog = true
    },
    //创建|编辑相册-模态框关闭
    dialogClose() { },
    //创建|编辑相册-模态框确定
    dialogEnter() {
      //编辑
      if(this.albumEditIndex > -1) {
        this.albumEdit()
      }else {
        //创建
        this.albums.unshift({
          name: this.albumForm.name,
          order: this.albumForm.order,
          num: 0
        })
      }
      this.albumDialog = false
    },
    //编辑相册
    albumEdit(){
      this.albums[this.albumEditIndex].name = this.albumForm.name
      this.albums[this.albumEditIndex].order = this.albumForm.order
    },
    //删除相册
    albumDel(i) {
      this.$confirm("确定删除此相册", "提示", {
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
    search() {},
    create() {},
    upload() {}
  }
};
</script>

<style scoped>
.album-active {
  color: #67c23a !important;
  background-color: #f0f9eb !important ;
  border-color: #c2e7b0 !important;
}
</style>