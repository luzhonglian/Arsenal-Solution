<template>
  <div>
    <el-dialog v-model="isShow" destroy-on-close fullscreen>
      <el-scrollbar>
        <el-form ref="FormRef" :model="formData" :rules="rules">
          <el-row>
            <el-col
              v-for="item of items"
              :span="item.colSpan || 8"
              :key="item.prop"
            >
              <el-form-item
                v-bind="item"
                :label="item.label + (item.unit ? `(${item.unit})` : '') + ':'"
                :required="type != 'detail' && item.required"
              >
                <span v-if="type == 'detail'">{{
                  item.map ? item.map[formData[item.prop]] : formData[item.prop]
                }}</span>
                <FormField v-else v-model="formData[item.prop]" v-bind="item" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
      <template #footer v-if="type != 'detail'">
        <el-button type="primary" @click="onConfirm">确认</el-button>
        <el-button type="info" @click="isShow = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/**
 * CRU弹窗组件
 * 由Table页面点击操作按钮进入
 */
const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  type: {
    type: String,
    default: "",
  },
  formData: {
    type: Object,
    default: () => ({}),
  },
  items: {
    type: Array,
    default: () => [],
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
});
//` 显隐控制
//#region
const emit = defineEmits(["update:modelValue", "confirm"]);
const isShow = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
//#endregion
import { cloneDeep } from "lodash-es";
const formData = reactive(props.type == "add" ? {} : cloneDeep(props.formData));
//` 增改
//#region
const FormRef = ref(null);
const onConfirm = () => {
  FormRef.value.validate(async (valid) => {
    if (valid) {
      ///处理请求的payload
      const payload = Object.assign({}, formData);
      isShow.value = false;
      FormRef.value.resetFields();
      emit("confirm", {
        type: props.type,
        data: payload,
      });
    }
  });
};
//#endregion
</script>

<style lang="scss" scoped>
:deep() {
  .el-dialog.is-fullscreen,
  .el-dialog__body {
    display: flex;
    flex-direction: column;
  }
  .el-dialog__body {
    flex: 1;
  }
  .el-dialog__footer {
    text-align: center;
  }
}
</style>
