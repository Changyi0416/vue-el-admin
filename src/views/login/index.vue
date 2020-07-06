<template>
  <div class="container">
    <div class="row">
      <div class="m-auto col-12 col-sm-6 col-md-6 col-lg-6 pt-5">
        <div class="card text-center mt-5">
          <div class="card-header bg-white text-secondary">{{$conf.logo}}</div>
          <div class="card-body">
            <el-form :model="form" :rules="loginRule" ref="loginForm">
              <el-form-item label>
                <el-input v-model="form.username" type="text" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label>
                <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label>
                <el-button type="primary" class="w-100" size="medium" @click="login">立即登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      loginRule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        console.log(valid);
        return;
        if (!valid) return;
        //提交表单
        this.$router.push({ name: "index" });
      });
    }
  }
};
</script>

<style scoped>
</style>