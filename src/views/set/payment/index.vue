<template>
  <div>
    <el-tabs v-model="tabIndex" @tab-click="tabHandle">
      <el-tab-pane label="支付设置" name="0">
        <el-table :data="tableData" border stripe>
          <el-table-column label="支付方式">
            <template slot-scope="scope">
              <div class="d-flex">
                <img class="rounded mr-2" :src="scope.row.src" alt="" style="width: 50px; height: 50px;">
                <div>
                  <span class="" style="font-size: 15px;">{{scope.row.name}}</span>
                  <br><small>{{scope.row.desc}}</small>
                </div>
              </div>
            </template>  
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template>
              <el-link type="primary" :underline="false" @click="configItem(scope.row, scope.$index)">配置</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="物流设置" name="1">
        <el-form :model="form" ref="from" label-width="100px" size="medius">
          <el-form-item label="未支付订单">
            <el-input type="number" v-model="form.customer" width="80px" placeholder="请输入">
              <template slot="append">天后自动关闭</template>
            </el-input>
            <br><small class="text-secondary">订单下单未付款，n天后自动关闭，设置0天不自动关闭</small>
          </el-form-item>
          <el-form-item label="已发货订单">
            <el-input type="number" v-model="form.customer" width="80px" placeholder="请输入">
              <template slot="append">天后自动确认收货</template>
            </el-input>
            <br><small class="text-secondary">如果在期间未设置确认收货，系统自动完成收货，设置0天不自动收货</small>
          </el-form-item>
          <el-form-item label="已完成订单">
            <el-input type="number" v-model="form.customer" width="80px" placeholder="请输入">
              <template slot="append">天内允许申请售后</template>
            </el-input>
            <br><small class="text-secondary">订单完成后，用户在n天内可以发起售后申请，设置0天不允许申请售后</small>
          </el-form-item>
          <el-form-item label="运费组合策略">
            <el-select v-model="form.customer" placeholder="请选择">
              <el-option :value="1">1</el-option>
              <el-option :value="2">2</el-option>
            </el-select>
              
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tabIndex: '1',
        tableData: [
          {
            name: '银联卡支付',
            desc: '该系统支持即刻到账接口',
            src: 'http://wxcs.niuteam.cn/addons/NsUnionPay/ico.png'
          },
          {
            name: '支付宝支付',
            desc: '该系统支持即刻到账接口',
            src: 'http://wxcs.niuteam.cn/addons/NsAlipay/ico.png'
          },
          {
            name: '微信支付',
            desc: '该系统支持微信网页支付和扫码支付',
            src: 'http://wxcs.niuteam.cn/addons/NsWeixinpay/ico.png'
          }
        ],
        form: {
          customer: '',
          key: ''
        }
      }
    },
    filters: {
      formatType(value){
        console.log(value);
        return ['','按重量','按件数'][value]
      }
    },
    methods: {
      tabHandle(tab){
        // console.log(tab)
      },
      configItem(){},
      onSubmit(){}
    }
  }
</script>

<style scoped>
.el-input {
  width: 40%;
}
</style>