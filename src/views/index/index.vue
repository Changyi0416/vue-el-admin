<template>
  <div>
    <el-row :gutter="20" class="mb-3">
      <el-col :span="6" v-for="(item, i) in counts" :key="i">
        <el-card class="box-card" shadow="hover">
          <div class="d-flex align-items-center">
            <i class="bg-primary text-white text-center h4 mb-0 mr-3"
              style="width: 40px; height: 40px; line-height: 40px;"
              :class="[item.icon, item.bg_color]"
            ></i>
            <div>
              <p class="h5">{{ item.num }}</p>
              <small class="text-muted">{{ item.desc }}</small>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mb-3">
      <el-col :span="12" class="d-flex flex-column justify-center" style="height: 370px;">
        <el-card class="flex-grow-1 mb-1" v-for="(item, i) in tips" :key="i">
          <div slot="header" class="clearfix">
            <span>{{ item.title }}</span>
            <small class="text-muted" style="float: right; padding: 3px 0">
              {{ item.desc }}
            </small>
          </div>
          <el-row :gutter="i | getGutter">
            <el-col :span="item.list.length | getCol" v-for="(current, j) in item.list" :key="j">
              <button class="btn btn-light w-100">
                <h4>{{ current.value }}</h4>
                <small class="text-muted">{{ current.name }}</small>
              </button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="height: 370px;" :body-style="{ height: '100%' }">
          <div slot="header" class="clearfix">
            <span>订单总数统计</span>
            <small class="text-muted" style="float: right; padding: 3px 0">订单数量</small>
          </div>
          <div ref="chart" class="w-100" style="height: 270px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class style="height: 320px;">
      <el-col :span="12">
        <el-card style="height: 320px;" :body-style="{ padding: '20px' }">
          <div slot="header" class="clearfix">
            <span>销售情况统计</span>
            <small class="text-muted" style="float: right; padding: 3px 0">按周期统计商家店铺的订单量和订单金额</small>
          </div>
          <div>
            <div class="border w-100 d-flex mb-3" style="height: 100px;">
              <div
                class="bg-light text-center text-muted h-100"
                style="width: 100px; line-height: 100px;"
              >昨日销量</div>
              <div class="flex-grow-1">
                <div
                  class="border-bottom w-100 h-50 pl-3 text-muted d-flex align-items-center"
                >订单量（件）12</div>
                <div class="w-100 h-50 pl-3 text-secondary d-flex align-items-center">订单金额（元）120</div>
              </div>
            </div>
            <div class="border w-100 d-flex" style="height: 100px;">
              <div
                class="bg-light text-center text-muted h-100"
                style="width: 100px; line-height: 100px;"
              >本月销量</div>
              <div class="flex-grow-1">
                <div
                  class="border-bottom w-100 h-50 pl-3 text-muted d-flex align-items-center"
                >订单量（件）12</div>
                <div class="w-100 h-50 pl-3 text-secondary d-flex align-items-center">订单金额（元）120</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="height: 320px;" :body-style="{ padding: '20px' }" >
          <div slot="header" class="clearfix">
            <span>单品销售排名</span>
            <small class="text-muted" style="float: right; padding: 3px 0">按周期统计商家店铺的订单量和订单金额</small>
          </div>
          <el-table :data="tableData" height="220" border style="width: 100%">
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column prop="name" label="商品信息"></el-table-column>
            <el-table-column prop="num" label="销量" width="100"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
		<div class="container p-3">
			<span>vue-count-to：</span>
			<count-to :startVal="startVal" :endVal="endVal" :duration="3000"
			:autoplay="true" suffix="访问量" separator=","
			class="text-primary font-weight" style="font-size: 18px;"></count-to>
		</div>
  </div>
</template>

<script>
import echarts from "echarts";
import countTo from 'vue-count-to'
export default {
	components: { countTo },
  data() {
    return {
			startVal: 0,
			endVal: 2000,
      counts: [
        {
          icon: "el-icon-user-solid",
          bg_color: "bg-primary",
          num: 20,
          desc: "关注人数（个）"
        },
        {
          icon: "el-icon-s-finance",
          bg_color: "bg-success",
          num: 120,
          desc: "订单总数（笔）"
        },
        {
          icon: "el-icon-s-order",
          bg_color: "bg-danger",
          num: 4138.28,
          desc: "今日订单总金额（元）"
        },
        {
          icon: "el-icon-s-data",
          bg_color: "bg-warning",
          num: 100,
          desc: "本月销量（笔）"
        }
      ],
      tips: [
        {
          title: "店铺及商品提示",
          desc: "您需要关注的店铺信息及待处理事项",
          list: [
            { name: "出售中", value: "64" },
            { name: "待回复", value: "10" },
            { name: "库存预警", value: "0" },
            { name: "仓库中", value: "3" }
          ]
        },
        {
          title: "交易提醒",
          desc: "您需要立即处理的交易订单",
          list: [
            { name: "代收款", value: "0" },
            { name: "代发货", value: "10" },
            { name: "已发货", value: "0" },
            { name: "已收货", value: "3" },
            { name: "退款中", value: "3" },
            { name: "待售后", value: "3" }
          ]
        }
      ],
      tableData: [
        { name: "小天鹅滚筒洗衣机", num: "9" },
        { name: "花花公子男装", num: "9" },
        { name: "三彩2019黑色水彩笔", num: "9" },
        { name: "女性控妆散粉", num: "9" },
        { name: "mac口红",  num: "9" }
      ]
    };
  },
  created() {},
  mounted() {
    //画统计图
    this.drawLine();
  },
  filters: {
    getGutter(val) {
      return [20, 10][val];
    },
    getCol(len) {
      return 24 / len;
    }
  },
  methods: {
		//图表
    drawLine() {
      let chartInit = echarts.init(this.$refs.chart);
      // 指定图表的配置项和数据
      let option = {
        title: {},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "视频广告",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "直接访问",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "搜索引擎",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: {},
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      chartInit.setOption(option);
    },
  }
};
</script>

<style scoped></style>
