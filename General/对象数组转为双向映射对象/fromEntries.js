/// 生成name和site的双向映射对象
const data = [
  {
    name: "周杰伦",
    site: "新北",
  },
  {
    name: "林俊杰",
    site: "新加坡",
  },
];
const twoWayMap = {
  ...Object.fromEntries(data.map((item) => [item.name, item.site])),
  ...Object.fromEntries(data.map((item) => [item.site, item.name])),
};
console.log("twoWayMap", twoWayMap);
// twoWayMap { 周杰伦: '新北', 新北: '周杰伦', 林俊杰: '新加坡', 新加坡: '林俊杰' }
