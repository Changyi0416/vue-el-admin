<template>
  <div class="text-center">
    <el-row class="pt-5">
      <el-col :span="8" style="min-height: 80px;">
      </el-col>
      <el-col :span="8" class="mt-5">
        <el-form :model="form" ref="form" label-width="80px">
          <el-form-item label>
            <el-input v-model="form.username" type="text" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label>
            <el-input v-model="form.password" type="password" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label>
            <el-button type="primary" size="medium" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8" style="min-height: 80px;">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    login() {}
  }
};
</script>

<style scoped>
</style>