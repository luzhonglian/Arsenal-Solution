export const userMap = {
  用户名: "name",
  联系方式: "phone",
  角色: "role",
  信用情况: "credit",
  奖章: "badge",
  胜率: "winRate",
  注册时间: "regDate",
};

//!所有的字段映射需要双向处理
function reverseMap(map) {
  for (let key in map) {
    map[map[key]] = key;
  }
}
import * as maps from "./fieldLabelMap.js";
Object.values(maps).forEach(reverseMap);
