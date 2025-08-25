<template>
  <el-form ref="FormRef" :model="formData" inline>
    <el-form-item
      v-for="item of items4Search"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
    >
      <FormField
        v-model="formData[item.prop]"
        :type="item.type"
        :options="item.options"
        :dateType="item.dateType"
      />
    </el-form-item>
    <!-- -------- 操作 ------------ -->
    <el-form-item>
      <ActionBtns @action="onAction" />
    </el-form-item>
  </el-form>
  <!-- ------------------------- table ------------------------- -->
  <Table :columns="columns" :tableData="tableData" @rowAction="onRowAction" />
  <!-- ------------------------- 分页器 ------------------------- -->
  <el-pagination
    v-model:current-page="page.page"
    v-model:page-size="page.limit"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, ->, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="getData"
    @current-change="getData"
  />
  <CRU
    v-if="isDialogShow"
    :type="aedType"
    :formData="aedData"
    :items="items4Add"
    :rules="rules"
    v-model="isDialogShow"
    @confirm="onConfirm"
  />
</template>

<script setup>
import { columns, items4Search, items4Add, rules } from "./config";
import CRU from "./CRU.vue";
import ActionBtns from "./ActionBtns.vue";
import FormField from "./FormField.vue";
import Table from "./Table.vue";

const total = ref(0);
const aedType = ref(); /// add edit detail
const aedData = ref({});
const isDialogShow = ref(false);
const FormRef = ref();
const formData = reactive({});
const page = reactive({
  page: 1,
  limit: 10,
});
const tableData = ref([]);
//` 保持引用不变替换数组内容
function replaceArrContent(target, source = []) {
  const arr = isRef(target) ? target.value : target;
  if (!Array.isArray(arr)) return;
  arr.splice(0, arr.length, ...source);
}
//` 表格行点击事件
function onRowAction({ type, row }) {
  if (type == "delete") {
    ElMessageBox.confirm("是否确认删除?", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        // await deleteUser({ id: row.id });
        // getData();
      })
      .catch(() => {});
    return;
  }
  aedData.value = row;
  aedType.value = type;
  isDialogShow.value = true;
}
//` 操作按钮点击事件
function onAction(type) {
  if (type == "add") {
    aedType.value = "add";
    isDialogShow.value = true;
  }
  if (type == "search") {
    getData();
  }
  if (type == "reset") {
    FormRef.value.resetFields();
    getData();
  }
}
//` 请求数据
//#region
async function getData() {
  const payload = Object.assign({}, formData, page);
  if (payload.date) {
    payload.startDate = payload.date[0];
    payload.endDate = payload.date[1];
    delete payload.date;
  }
  ///模拟数据
  const data = [
    {
      id: 1,
      name: "周杰伦",
      phone: "13800000001",
      role: 2,
      credit: 1,
      badge: 5,
      winRate: 95,
      regDate: "2020-01-01",
    },
    {
      id: 2,
      name: "高启强",
      phone: "13800000002",
      role: 1,
      credit: 0,
      badge: 0,
      winRate: 12,
      regDate: "2020-02-01",
    },
  ];
  replaceArrContent(tableData, data);
  total.value = data.length;
}
onMounted(getData);
//#endregion
//` 处理增改的确认操作
//#region
async function onConfirm({ type, data }) {
  console.log("data", data);
  if (type == "add") {
    // await addUser(data);
    // getData();
  } else {
    // await editUser(data);
    // getData();
  }
}
//#endregion
</script>

<style lang="scss" scoped></style>
