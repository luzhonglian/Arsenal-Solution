import { userMap } from "../fieldLabelMap.js";
import { initAllItems, getRules } from "../mapUtils.js";
import { userOption } from "../optionsMap.js";



//` 规则相关
/* 
新增、编辑的必须项：
*/
const must = ["用户名", "角色", "信用情况", "联系方式"];
export const rules = getRules(must, userMap);
//` 可供搜索的内容
/* 
用户名 角色 信用情况 注册时间
*/
export const items4Search = ref([
  {
    label: "用户名",
  },
  {
    label: "角色",
    type: "select",
  },
  {
    label: "信用情况",
    type: "select",
  },
  {
    label: "注册时间",
    type: "picker",
    dateType: "daterange",
  },
]);
/* 
用户名 联系方式 角色 
*/
//` 新增/修改需要的内容
export const items4Add = [
  {
    label: "用户名",
  },
  {
    label: "联系方式",
  },
  {
    label: "角色",
    type: "select",
  },
];

//` Table要展示的内容
/* 
用户名 联系方式 角色 信用情况 奖章 胜率 注册时间
*/
export const columns = [
  { label: "用户名" },
  { label: "联系方式" },
  { label: "角色" },
  { label: "信用情况" },
  { label: "奖章" },
  { label: "胜率" },
  { label: "注册时间" },
];

//` 一次性处理
initAllItems(items4Search.value, items4Add, columns, userMap, userOption, must);
