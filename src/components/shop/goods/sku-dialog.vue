<template>
  <!-- 相册弹出层-选择相片 -->
  <el-dialog title="商品规格选择" class="chooseImage" :visible.sync="skuDialog" width="90%" top="3vh">
    <el-container style="height: 65vh;">
      <el-container style="position: relative;">
        <!-- 侧边 -->
        <el-aside
          width="180px"
          class="position-absolute bg-white border-right"
          style="top: 0; left:0; bottom: 0;"
        >
          <ul class="list-group list-group-flush">
						<li class="list-group-item list-group-item-action" style="cursor: pointer;"
						v-for="(item, i) in skusList" :key="i"
						@click="skuLeftHandel(i)"
						:class="skuIndex == i ? 'album-active' : ''">{{item.name}}</li>
          </ul>
        </el-aside>
        <el-container>
					<el-header style="margin-left: 180px;">
						<el-button class="btn" type="primary" size="mini" @click="doChooseAll">{{isChooseAll ? '取消全选' : '全选'}}</el-button>
					</el-header>
          <!-- 主内容 -->
          <el-main class="position-absolute" style="top: 20px; left:180px; right: 0; bottom: 0;">
						<div class="d-flex">
							<span class="btn border py-1 px-3 mr-2 mb-2" style="font-size: 14px;"
							v-for="(item, i) in skuItem" :key="i"
							:class="item.isChecked ? 'album-active' : ''"
							@click="chooseSkuVal(item)">{{item.name}}</span>
						</div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
	props: {
		maxNum: { //选择图片最大限制
			type: Number,
			default: 9
		}
	},
  data() {
    return {
      skuDialog: false, //选择规格图层是否显示
      callback: false,
			
			//模拟数据
			skuIndex: 0,
			skusList: [
				{
					name: '尺寸',
					type: 0, //规格类型 0无 1颜色 2图片
					list: [{
						id: 1,
						name: 'XL',
						color: '',
						image: '',
						isChecked: false
					},{
						id: 2,
						name: 'XXL',
						color: '',
						image: '',
						isChecked: false
					}]
				},{
					name: '类型',
					type: 0, //规格类型 0无 1颜色 2图片
					list: [{
						id: 3,
						name: '手持',
						color: '',
						image: '',
						isChecked: false
					},{
						id: 4,
						name: '脚踏',
						color: '',
						image: '',
						isChecked: false
					},{
						id: 5,
						name: '电动',
						color: '',
						image: '',
						isChecked: false
					}]
				}
			],
			//被选中的数组
			chooseList: [],
    };
  },
  created() {
  },
	computed: {
		// 当前规格下的规格属性列表
		skuItem() {
			let item = this.skusList[this.skuIndex]
			return item ? item.list : []
		},
		//是否全选
		isChooseAll(){
			return this.skuItem.length == this.chooseList.length
		}
	},
  methods: {
    //打开【选择规格】弹出层
    open(callback) {
      this.callback = callback;
      this.skuDialog = true;
    },
    confirm() {
			if(this.chooseList.length == 0){
				return this.$message({type: 'error', message: '请选择规格值'})
			}
      //返回选中的url
      if (typeof this.callback === "function") {
				let item = this.skusList[this.skuIndex];
        this.callback({
						name: item.name,
						type: item.type,
						list: this.chooseList
					});
      }
      //隐藏弹出层
      this.close();
    },
    //关闭【选择规格】弹出层
    close() {
      this.callback = false; //callback重置
      this.skuDialog = false; //关闭
			this.unChooseAll()
    },
		//切换左侧规格卡片
		skuLeftHandel(i){	
			this.skuIndex = i
			this.unChooseAll()
		},
		//选择右侧规格值
		chooseSkuVal(item){
			//之前没有被选中
			if(!item.isChecked) {
				//修改选中的状态
				item.isChecked = true;
				//添加到chooseList中
				return this.chooseList.push(item);
			}
			//之前选中
			var index = this.chooseList.findIndex(v => {
				return v.id == item.id
			});
			if(index < 0) reutrn
			//从chooseList中删除当前项 
			this.chooseList.splice(index, 1);
			//修改选中的状态
			item.isChecked = false;
		},
    //取消选中、全选
    doChooseAll() {
			let list = this.skusList[this.skuIndex].list;
		 	//已经全选
			if(this.isChooseAll) {
				return this.unChooseAll()
			}
			//全选
			this.chooseList = list.map(v => {
				v.isChecked = true
				return v
			})
    },
		//取消全选
		unChooseAll(){
			let list = this.skusList[this.skuIndex].list;
			//取消选中状态
			list.forEach(v => {
				v.isChecked = false
			})
			//清空选中列表
			return this.chooseList = []
		}
  }
};
</script>

<style>
.chooseImage .el-dialog__body {
  padding: 0;
}
</style>
