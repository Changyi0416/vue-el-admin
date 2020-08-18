<template>
  <div class="container">
    <div class="row">
      <div class="m-auto col-12 col-sm-6 col-md-6 col-lg-6 pt-5">
        <div class="card text-center mt-5">
          <div class="card-header bg-white text-secondary">{{$conf.logo}}</div>
          <div class="card-body">
            <el-form :model="form" :rules="loginRule" ref="loginForm">
              <el-form-item label prop="username">
                <el-input v-model="form.username" type="text" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
								<!-- @keyup.enter.native="submit" -->
              </el-form-item>
              <el-form-item label>
                <el-button type="primary" class="w-100" size="medium"  @click="submit" @keyup.enter="submit" :loading="loading">立即登录</el-button>
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
			loading: false,
      form: {
        username: "",
        password: ""
      },
      loginRule: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return;
				this.loading = true
        //提交表单
				this.axios.post('/admin/login', this.form).then(res => {
					console.log(res)
					//储存到vuex
					//储存到本地储存
					this.$store.commit('login', res.data.data)
					//成功提示
					this.$message({ type: 'success', message: '登录成功'});
					this.loading = false
					//跳转到后台首页
					this.$router.push({ name: "index" });
				})
				.catch(err => {
					this.loading = false
				})
      });
    }
  }
};
</script>

<style scoped>
</style>