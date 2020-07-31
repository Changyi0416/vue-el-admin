<template>
  <!-- 相册弹出层-选择相片 -->
  <el-dialog title="图片管理" class="chooseImage" :visible.sync="shopImageDia" width="90%" top="3vh">
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
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <el-input v-model="form.name" placeholder="相册名称" class="mr-2" style="width: 220px;"></el-input>
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
            <album-item
              v-for="(item, i) in albums"
              :key="i"
              :item="item"
              :i="i"
              :isActive="albumsIndex == i"
              :isShow="false"
              @handel="albumsIndex = i"
            ></album-item>
          </ul>
        </el-aside>
        <el-container>
          <!-- 主内容 -->
          <el-main class="position-absolute" style="top: 0; left:180px; right: 0; bottom: 0;">
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
        <div
          style="width: 180px; flex-shrink: 0;"
          class="h-100 border-right d-flex justify-content-center align-items-center"
        >
          <el-button-group>
            <el-button size="mini">下一页</el-button>
            <el-button size="mini">上一页</el-button>
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
            :total="400"
          ></el-pagination>
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
      shopImageDia: false,
      callback: false,

      form: {
        order: "",
        name: ""
      },
      //相册列表
      albumsIndex: 0, //被active索引
      albums: [],
      //图片预览
      imageArr: [],
      chooseImgList: [], //被选中的图片
      //分页
      currentPage: 4
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
          // img: require("./static/19.jpg"),
          img: "https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg",
          name: "图片" + (j + 1),
          isCheck: false,
          checkOrder: 0
        });
      }
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
      this.$confirm("是否删除" + (obj.all ? "选中" : "该") + "图片", "提示", {
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
          } else this.imageArr.splice(obj.i, 1); //删除一个
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
				//选中图片个数限制
				if(this.chooseImgList.length >= this.maxNum) return this.$message({message: `最多选择${this.maxNum}张图片`, type: 'error'})
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
    cancelSelected() {
      //将图片的isCheck属性变为false，取消选中样式
      this.imageArr.forEach(item => {
        if (item.isCheck) item.isCheck = false;
      });
      //选中排序归0
      this.chooseImgList = [];
    },
    //图片分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    search() {}
  }
};
</script>

<style>
.chooseImage .el-dialog__body {
  padding: 0;
}
</style>
