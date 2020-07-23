<template>
  <div>
    <router-link :to="{name: 'shop_goods_list'}">
      <el-button plain size="mini" class="position-absolute" style="top: 14px; left: 170px;">
        <i class="el-icon-arrow-left"></i>回到商品列表
      </el-button>
    </router-link>
    <div class="position-absolute goods_create" style="top: 55px; bottom: 0; left: 20px; right: 20px;">
      <el-tabs v-model="tabIndex" @tab-click="handleClick">
        <el-tab-pane label="基础设置">
          <el-form :model="baseSetForm" ref="baseSetForm"
            style="width: 60%;" label-width="80px" size="medium"
          >
            <el-form-item label="商品名称">
              <el-input v-model="baseSetForm.title" maxlength="60" placeholder="请输入商品名称，不能超过60个字符"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                :options="cagerotyOptions"
                v-model="baseSetForm.category"
                @change="cagerotyChange"
                placeholder="请选择"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="商品描述">
              <el-input
                type="textarea" :rows="3"
                v-model="baseSetForm.desc"
                placeholder="选填，商品卖点描述。例如：此款商品美观大方 性价比较高 不容错过"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品单位">
              <el-input v-model="baseSetForm.unit" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="总库存">
              <el-input type="number" v-model="baseSetForm.stock" style="width: 200px;">
                <template slot="append">件</template>
              </el-input>
            </el-form-item>
            <el-form-item label="库存预警">
              <el-input type="number" v-model="baseSetForm.min_stock" style="width: 200px;">
                <template slot="append">件</template>
              </el-input>
            </el-form-item>
            <el-form-item label="库存显示">
              <el-radio-group v-model="baseSetForm.display_stock" size="small">
                <el-radio :label="1" border>是</el-radio>
                <el-radio :label="0" border>否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否上架">
              <el-radio-group v-model="baseSetForm.status" size="small">
                <el-radio :label="0" border>放入仓库</el-radio>
                <el-radio :label="1" border>立即上架</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="运费模块">
              <el-select v-model="baseSetForm.region" placeholder="请选择运费模板">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="btn" type="primary" @click="onSubmit">立即创建</el-button>
              <el-button class="btn">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品规格">
          <el-form :model="goodsRuleForm1" ref="goodsRuleForm" 
           label-width="80px" size="medium">
            <el-form-item label="商品规格">
              <el-radio-group v-model="skus_type" size="small">
                <el-radio-button :label="0">统一规格</el-radio-button>
                <el-radio-button :label="1">多规格</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="添加规格">
              <div class="card">
                <div class="card-header d-flex align-items-center">
                  <!-- <span class="text-muted" style="width: 75px; font-size: 14px;">规格项：</span> -->
                  规格项：
                  <el-input v-model="ggx" size="medium" placeholder="请选择" style="width: 200px;">
                    <el-button class="btn" slot="append"><i class="el-icon-more"></i></el-button>
                  </el-input>
                  <el-radio-group class="ml-3" v-model="xz">
                    <el-radio :label="0">无</el-radio>
                    <el-radio :label="1">颜色</el-radio>
                    <el-radio :label="2">图片</el-radio>
                  </el-radio-group>
                  <div class="ml-auto">
                    <el-button class="btn" icon="el-icon-bottom" plain size="mini"></el-button>
                    <el-button class="btn" plain size="mini"><i class="el-icon-top"></i></el-button>
                    <el-button class="btn" type="text">删除</el-button>
                    <!-- <span class="text-primary p-2" style="cursor: pointer;">删除</span> -->
                  </div>
                </div>
                <div class="card-body">
                  <el-button type="text"><i class="el-icon-plus mr-2"></i>添加规格值</el-button>
                </div>
              </div>
              <el-button type="success" size="mini" class="mt-3">添加规格</el-button>
            </el-form-item>
            <el-form-item label="批量设置">
              <el-button type="text" class="btn px-2" @click="plset">销售价</el-button>
              <el-button type="text" class="btn px-2" @click="plset">市场价</el-button>
              <el-button type="text" class="btn px-2" @click="plset">成本价</el-button>
              <el-button type="text" class="btn px-2" @click="plset">库存</el-button>
              <el-button type="text" class="btn px-2" @click="plset">体积</el-button>
              <el-button type="text" class="btn px-2" @click="plset">重量</el-button>
            </el-form-item>
            <el-form-item label="规格设置">
            </el-form-item>
            <!-- <div>
              <el-form-item label="市场价格">
                <el-input type="number" v-model="goodsRuleForm1.num" style="width: 200px;">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="销售价格">
                <el-input type="number" v-model="goodsRuleForm1.num" style="width: 200px;">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="成本价格">
                <el-input type="number" v-model="goodsRuleForm1.num" style="width: 200px;">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="商品重量">
                <el-input type="number" v-model="goodsRuleForm1.num" style="width: 200px;">
                  <template slot="append">公斤</template>
                </el-input>
              </el-form-item>
              <el-form-item label="商品体积">
                <el-input type="number" v-model="goodsRuleForm1.num" style="width: 200px;">
                  <template slot="append">立方米</template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </div> -->
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品熟悉">商品熟悉</el-tab-pane>
        <el-tab-pane label="媒体设置">媒体设置</el-tab-pane>
        <el-tab-pane label="商品详情">商品详情</el-tab-pane>
        <el-tab-pane label="折扣设置">折扣设置</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
	import { mapState } from 'vuex';
export default {
  data() {
    return {
      tabIndex: '1',
      skus_type: '0', //0单一规格  1多规格
      baseSetForm: {
        title: "",
        category: '',
        desc: '',
        unit: '',
        stock: 0,
        min_stock: 0,
        display_stock: '0', //库存显示
        status: '0' //是否上架
      },

      ggx: '',
      xz: 0,

      //商品规格-统一规格
      goodsRuleForm1: {
        name: '',
        num: 0
      },
      cagerotyOptions: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航"
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航"
                }
              ]
            }
          ]
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "Layout 布局"
                },
                {
                  value: "color",
                  label: "Color 色彩"
                },
                {
                  value: "typography",
                  label: "Typography 字体"
                },
                {
                  value: "icon",
                  label: "Icon 图标"
                },
                {
                  value: "button",
                  label: "Button 按钮"
                }
              ]
            },
            {
              value: "form",
              label: "Form",
              children: [
                {
                  value: "radio",
                  label: "Radio 单选框"
                },
                {
                  value: "checkbox",
                  label: "Checkbox 多选框"
                },
                {
                  value: "input",
                  label: "Input 输入框"
                },
                {
                  value: "input-number",
                  label: "InputNumber 计数器"
                },
                {
                  value: "select",
                  label: "Select 选择器"
                },
                {
                  value: "cascader",
                  label: "Cascader 级联选择器"
                },
                {
                  value: "switch",
                  label: "Switch 开关"
                },
                {
                  value: "slider",
                  label: "Slider 滑块"
                },
                {
                  value: "time-picker",
                  label: "TimePicker 时间选择器"
                },
                {
                  value: "date-picker",
                  label: "DatePicker 日期选择器"
                },
                {
                  value: "datetime-picker",
                  label: "DateTimePicker 日期时间选择器"
                },
                {
                  value: "upload",
                  label: "Upload 上传"
                },
                {
                  value: "rate",
                  label: "Rate 评分"
                },
                {
                  value: "form",
                  label: "Form 表单"
                }
              ]
            },
            {
              value: "data",
              label: "Data",
              children: [
                {
                  value: "table",
                  label: "Table 表格"
                },
                {
                  value: "tag",
                  label: "Tag 标签"
                },
                {
                  value: "progress",
                  label: "Progress 进度条"
                },
                {
                  value: "tree",
                  label: "Tree 树形控件"
                },
                {
                  value: "pagination",
                  label: "Pagination 分页"
                },
                {
                  value: "badge",
                  label: "Badge 标记"
                }
              ]
            },
            {
              value: "notice",
              label: "Notice",
              children: [
                {
                  value: "alert",
                  label: "Alert 警告"
                },
                {
                  value: "loading",
                  label: "Loading 加载"
                },
                {
                  value: "message",
                  label: "Message 消息提示"
                },
                {
                  value: "message-box",
                  label: "MessageBox 弹框"
                },
                {
                  value: "notification",
                  label: "Notification 通知"
                }
              ]
            },
            {
              value: "navigation",
              label: "Navigation",
              children: [
                {
                  value: "menu",
                  label: "NavMenu 导航菜单"
                },
                {
                  value: "tabs",
                  label: "Tabs 标签页"
                },
                {
                  value: "breadcrumb",
                  label: "Breadcrumb 面包屑"
                },
                {
                  value: "dropdown",
                  label: "Dropdown 下拉菜单"
                },
                {
                  value: "steps",
                  label: "Steps 步骤条"
                }
              ]
            },
            {
              value: "others",
              label: "Others",
              children: [
                {
                  value: "dialog",
                  label: "Dialog 对话框"
                },
                {
                  value: "tooltip",
                  label: "Tooltip 文字提示"
                },
                {
                  value: "popover",
                  label: "Popover 弹出框"
                },
                {
                  value: "card",
                  label: "Card 卡片"
                },
                {
                  value: "carousel",
                  label: "Carousel 走马灯"
                },
                {
                  value: "collapse",
                  label: "Collapse 折叠面板"
                }
              ]
            }
          ]
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components"
            },
            {
              value: "sketch",
              label: "Sketch Templates"
            },
            {
              value: "jiaohu",
              label: "组件交互文档"
            }
          ]
        }
      ]
    };
  },
  computed: {
  	...mapState('module/goods_cerate', {
			// ceshi: state => state.goods_create.ceshi
			ceshi:  state => state.ceshi
		})
  },
	mounted(){
		console.log(this.ceshi);
    // console.log(this.$store.state.goods_create.ceshi);
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab);
    },
    onSubmit() {
      console.log(this.baseSetForm);
    },
    cagerotyChange(val){
      console.log(val);
    },
    //批量设置
    plset(){ }
  }
};
</script>

<style scoped>
.goods_create .el-form-item {
  margin-bottom: 10px;
}
.card-header {
  line-height: 1.2 !important;
}
.card-header .el-radio{
  margin-right: 14px;
  margin-bottom: 0;
}
.card-header .el-button--mini, .el-button--small{
  padding: 8px;
}
</style>