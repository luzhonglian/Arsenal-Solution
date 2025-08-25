<template>
  <div>
    <el-button type="primary" @click="onClick('search')">查询</el-button>
    <template v-if="!search">
      <el-button v-if="!noReset" @click="onClick('reset')">重置</el-button>
      <el-button v-if="!noAdd" @click="onClick('add')">新增</el-button>
    </template>
  </div>
</template>

<script setup>
/**
 * @description:封装的查询、重置、新增按钮
 * @description:实际使用情况分为：全用，仅查询(search)，仅查询+重置(noAdd)
 * @param {Boolean} noAdd 是否显示新增按钮
 * @usage <ActionBtns @action='' />
 */
const props = defineProps({
  search: {
    type: Boolean,
    default: false, ///仅查询
  },
  noAdd: {
    type: Boolean,
    default: false,
  },
  noReset: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["action"]);

const onClick = (type) => {
  // 查询、重置、新增
  emit("action", type);
};
</script>

<style lang="scss" scoped></style>
