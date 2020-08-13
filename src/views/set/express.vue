<template>
  <div>
    <el-tabs v-model="tabIndex" @tab-click="tabHandle">
      <el-tab-pane label="运费模板" name="0">
        <el-button type="primary" @click="addModel">添加模板</el-button>
        <el-table :data="tableData" border stripe>
          <el-table-column label="模板名称" prop="name"></el-table-column>
          <el-table-column label="计算方式" prop="name"></el-table-column>
          <el-table-column label="排序" prop="name"></el-table-column>
          <el-table-column label="添加时间" prop="name"></el-table-column>
          <el-table-column label="状态" prop="name"></el-table-column>
          <el-table-column label="操作">
            <template>
              <el-link type="primary" :underline="false" class="mr-2" @click="editItem(scope.row, scope.$index)">修改</el-link>
              <el-link type="danger" :underline="false" @click="deleteItem(scope.row, scope.$index)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="物流跟踪" name="1">
        <el-form :model="form" ref="from" label-width="100px" size="small">
          <el-form-item label="快递100 Customer">
            <el-input v-model="form.customer" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="空间域名">
            <el-input v-model="form.key" placeholder="请输入"></el-input>
            <br><small class="text-secondary">请补全http://或https://</small>
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
        tableData: [{
          name: ''
        }],
        form: {
          customer: '',
          key: ''
        }
      }
    },
    methods: {
      tabHandle(tab){
        // console.log(tab)
      },
      addModel(){},
      editItem(){},
      deleteItem(){},
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