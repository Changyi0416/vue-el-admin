<template>
  <div>
    <el-tabs v-model="tabIndex" @tab-click="tabHandle">
      <el-tab-pane label="注册与访问" name="0">
        <el-form :model="form" ref="form" size="small" label-width="130px">
          <el-form-item label="是否允许注册会员">
            <el-radio-group v-model="form.isreg">
              <el-radio-button :label="0">是</el-radio-button>
              <el-radio-button :label="1">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="注册类型">
            <el-radio-group v-model="form.reg_type">
              <el-radio-button label="username">普通注册</el-radio-button>
              <el-radio-button label="phone">手机注册</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码最小长度">
            <el-input type="number" v-model="form.password_length" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="强制密码复杂度">
            <el-checkbox-group v-model="form.paddword_encrypt">
              <el-checkbox-button label="0">数字</el-checkbox-button>
              <el-checkbox-button label="1">小写字母</el-checkbox-button>
              <el-checkbox-button label="2">大写字母</el-checkbox-button>
              <el-checkbox-button label="3">符号</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="上传设置" name="1">
        <el-form :model="form" ref="from" label-width="100px" size="small">
          <el-form-item label="默认上传方式">
            <el-radio-group v-model="form.upload_method">
              <el-radio-button label="local">本地存储</el-radio-button>
              <el-radio-button label="qiniu">七牛云存储</el-radio-button>
              <el-radio-button label="oss">阿里0ss</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Bucket">
            <el-input v-model="form.Bucket" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="ACCESS_KEY">
            <el-input v-model="form.ACCESS_KEY" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="SECRET_key">
            <el-input v-model="form.SECRET_key" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="空间域名">
            <el-input v-model="form.http" placeholder="请输入"></el-input>
            <br><small class="text-secondary">请补全http://或https://</small>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="API安全" name="2">
        <el-form :model="form" ref="form" label-width="120px" size="small">
          <el-form-item label="是否开启api安全">
            <el-radio-group v-model="form.api">
              <el-radio-button :label="1">是</el-radio-button>
              <el-radio-button :label="0">否</el-radio-button>
            </el-radio-group>
            <br><small class="text-secondary">api安全功能开启之后调用前端api需要传输签名串</small>
          </el-form-item>
          <el-form-item label="秘钥">
            <el-input v-model="form.api_key" placeholder="请输入"></el-input>
            <br><small class="text-secondary">秘钥设置关系系统中api需用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置后对应会员要求重新登录获取token</small>
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
        tabIndex: '0',
        form: {
          isreg: 1,
          reg_type: 'username',
          password_length: '',
          paddword_encrypt: [],
          upload_method: 'local',
          Bucket: '',
          ACCESS_KEY: '',
          SECRET_key: '',
          http: '',
          api: 1,
          api_key: ''
        }
      }
    },
    methods: {
      tabHandle(tab){
        // console.log(tab)
      },
      onSubmit(){

      }
    }
  }
</script>

<style scoped>
.el-input {
  width: 40%;
}
</style>