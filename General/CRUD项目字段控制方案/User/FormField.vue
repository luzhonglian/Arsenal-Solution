<template>
  <div class="search-item">
    <!-- -------- 输入框 ------------ -->
    <el-input
      v-if="type == 'input'"
      v-model="currentValue"
      :clearable="clearable"
      :placeholder="placeholder || '请输入'"
      :disabled="disabled"
    ></el-input>
    <!-- -------- textarea------------ -->
    <el-input
      v-if="type == 'textarea'"
      autosize
      v-model="currentValue"
      :clearable="clearable"
      type="textarea"
      :placeholder="placeholder || '请输入'"
      :disabled="disabled"
    ></el-input>
    <!-- -------- 下拉框 ------------ -->
    <el-select
      v-if="type == 'select'"
      style="min-width: 177px"
      v-model="currentValue"
      :clearable="clearable"
      :placeholder="placeholder || '请选择'"
      :filterable="filterable"
      :teleported="teleported"
      :disabled="disabled"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <!-- -------- 时间选择器 ------------ -->
    <el-date-picker
      v-if="type == 'picker'"
      v-model="currentValue"
      style="width: 100%"
      :type="dateType"
      :teleported="teleported"
      :placeholder="placeholder || '选择' + date2Des[dateType]"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :value-format="date2Format[dateType]"
      :clearable="clearable"
      :disabled="disabled"
    ></el-date-picker>
    <!-- -------- 单选框 ------------ -->
    <el-radio-group v-if="type == 'radio'" v-model="currentValue">
      <el-radio v-for="item in options" :key="item.label" :value="item.value"
        >{{ item.label }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script setup>
/**
 * @description 表单组件：输入框、下拉框、时间选择器、单选框
 * @param {String} type 类型：input、select、picker、radio
 * @param {Array} options 下拉框选项
 * @param {String} placeholder 提示文字
 * @param {String} dateType 时间选择器类型：year、month、date、dates、datetime、datetimerange、daterange、monthrange
 * @usage <FormField v-model="name"  />
 * <FormField v-model="name" type="select" :options="options:{label:String,value:String}[]" />
 * <FormField v-model="name" type="picker" dateType="date" />
 * <FormField v-model="name" type="radio" :options="[{label:String,value:String}]" />
 */
const props = defineProps({
  modelValue: {},
  type: {
    type: String,
    default: "input",
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "",
  },
  dateType: {
    type: String,
    default: "date",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  filterable: {
    type: Boolean,
    default: true,
  },
  teleported: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:modelValue"]);
const currentValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emits("update:modelValue", val);
  },
});
//'year' | 'years' |'month' | 'date' | 'dates' | 'datetime' | 'datetimerange' | 'daterange' | 'monthrange'
const date2Des = {
  year: "年份",
  years: "年份范围",
  month: "月份",
  date: "日期",
  dates: "日期范围",
  datetime: "时间",
};
const date2Format = {
  year: "YYYY",
  years: "YYYY",
  month: "YYYY-MM",
  date: "YYYY-MM-DD",
  dates: "YYYY-MM-DD",
  datetime: "YYYY-MM-DD HH:mm:ss",
  datetimerange: "YYYY-MM-DD HH:mm:ss",
  daterange: "YYYY-MM-DD",
  monthrange: "YYYY-MM",
};
</script>

<style lang="scss" scoped>
:deep() {
  .el-date-editor--daterange {
    width: 240px !important;
  }
  .el-date-editor--datetimerange {
    width: 380px !important;
  }
}
</style>
