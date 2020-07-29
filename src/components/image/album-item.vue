<template>
  <div>
    <li
      class="list-group-item list-group-item-action border-bottom-0 d-flex align-items-center"
      style="cursor: pointer;"
      :class="{'album-active': isActive}"
      @click.stop="$emit('handel', i)"
    >
      {{item.name}}
			<!-- 仅展示数量 -->
			<span class="btn btn-light text-muted ml-auto" size="mini" v-if="!isShow">
			  {{item.num}}
			</span>
			<!-- 修改功能 -->
      <el-dropdown class="ml-auto" v-else>
        <span class="btn btn-light text-muted" size="mini">
          {{item.num}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.stop.native="$emit('open', {item, i})">修改</el-dropdown-item>
          <el-dropdown-item @click.stop.native="$emit('del', i)">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </li>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    i: Number,
    isActive: {
      type: Boolean,
      default: false
    },
		isShow: { // 是否显示修改功能
			type: Boolean,
			default: true
		}
  },
};
</script>

<style scoped>
.album-active {
  color: #67c23a !important;
  background-color: #f0f9eb !important ;
  border-color: #c2e7b0 !important;
}
</style>