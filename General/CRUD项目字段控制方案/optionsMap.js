//!  异常状态一律为 0
//!  正常状态一律为 1
//!  非正常异常从1开始
//!  Uniapp需将label改为text
export const userOption = {
  角色: [
    { label: "普通用户", value: 1 },
    { label: "大会员", value: 2 },
    { label: "管理员", value: 3 },
  ],
  信用情况: [
    { label: "不大行", value: 0 },
    { label: "嘎嘎好", value: 1 },
  ],
};
