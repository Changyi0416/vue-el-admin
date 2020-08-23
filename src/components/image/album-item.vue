<template>
  <div>
    <li
      class="list-group-item list-group-item-action border-bottom-0 d-flex align-items-center"
      style="cursor: pointer;"
      :class="{'album-active': isActive}"
      @click.stop="$emit('handel', i)"
    >
      <span style="font-size: 14px;">{{item.name}}</span>
			<!-- 仅展示数量 -->
			<span class="btn btn-light text-muted ml-auto mr-1" v-if="!isShow">
			  {{item.images_count}}
			</span>
			<!-- 修改功能 -->
      <el-dropdown class="ml-auto" size="small" v-else>
				<el-button size="mini">
					{{item.images_count}}
					<i class="el-icon-arrow-down el-icon--right"></i>
				</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.stop.native="$emit('open', item)">修改</el-dropdown-item>
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

<style>
.album-active {
  color: #67c23a !important;
  background-color: #f0f9eb !important ;
  border-color: #c2e7b0 !important;
}
.list-group-item:last-child {
	padding: 10px;
	border-left: none;
	border-right: none;
}
</style>