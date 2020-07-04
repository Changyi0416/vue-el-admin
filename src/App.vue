<template>
  <div>
    <el-button>el-button</el-button>
    <el-radio-group v-model="radio" size="mini">
      <el-radio-button label="上海"></el-radio-button>
      <el-radio-button label="北京"></el-radio-button>
      <el-radio-button label="广州" disabled></el-radio-button>
      <el-radio-button label="深圳"></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  data(){
    return {
      radio: "广州"
    }
  }
};
</script>

<style>
</style>
