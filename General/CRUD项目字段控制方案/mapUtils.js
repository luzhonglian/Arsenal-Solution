/// [{label}]->[{label,unit}]
//#region
import { unitMap } from "./unitMap";
export function addUnit(arr) {
  for (const item of arr) {
    if (item.unit) continue;
    item.unit = unitMap[item.label] ?? "";
  }
}
//#endregion

/// [{label}]->[{label,prop}]
//#region
export function addProp(arr, map) {
  for (const item of arr) {
    if (item.prop) continue;
    item.prop = map[item.label];
  }
}
//#endregion

/// [{label}]->[{label,map}] 内容展示时后端传来的数字需要中文显示
//#region
/**
 noMap：无需映射
 使用场景：比如用下拉框选择用户进行搜索，后端接受的是数据库里的id
 请求拿到映射[{label:'lzl',value(id):1}]后加入到userOption里，但不希望显示时使用到这个options
 就在显示的data里对name的那项加一个noMap:true
 */
export function addMap(arr, optionMap = {}) {
  for (const item of arr) {
    const option = optionMap[item.label];
    if (option && !item.noMap) {
      item.map = Object.fromEntries(
        option.map(({ label, value }) => [value, label])
      );
    }
  }
}
//#endregion

/// [{label}]->[{label,options}] 新增数据时下拉框需要options
//#region
export function addOptions(arr, optionMap = {}) {
  arr.forEach((item) => {
    if (item.options) return;
    item.options = optionMap[item.label];
  });
}
//#endregion

/// [{label}]->[{label,required}] 新增数据哪些是必填的
//#region
export function addRequired(arr, must = []) {
  arr.forEach((item) => {
    item.required = must.includes(item.label);
  });
}
//#endregion

/// el-form的验证规则
//#region
export function getRules(must, map) {
  return Object.fromEntries(
    must.map((item) => [
      map[item],
      [{ required: true, message: `请输入${item}`, trigger: "blur" }],
    ])
  );
}
//#endregion

//. 初始化搜索项
//#region
/**
 * @description 初始化搜索项
 * @param {Array} items4Search 待处理的[{label}]
 * @param {Object} map 字段中文到字段名的映射
 * @param {Object} optionMap 字段中文到字段的选项列表的映射
 * @yields {Array} items4Search {label:'中文',prop:'cn',options:[]}
 */
export function initSearchItems(items4Search, map, optionMap) {
  addProp(items4Search, map);
  addOptions(items4Search, optionMap);
}
//#endregion

//. 初始化新增项
//#region
/**
 * @description 初始化新增项
 * @param {Array} items4Add 待处理项的[{label}]或{类1:[{label}],类2:[{label}]}
 * @param {Object} map 字段中文到字段名的映射
 * @param {Object} optionMap 字段中文到字段的选项列表的映射
 * @param {Array} must 必填项的中文数组
 * @yields {Array} items4Add {label:'中文',prop:'cn',options:[],required:true}
 */
export function initAddItems(items4Add, map, optionMap, must) {
  const lists = Array.isArray(items4Add)
    ? [items4Add]
    : Object.values(items4Add);

  lists.forEach((item) => {
    addProp(item, map);
    addOptions(item, optionMap);
    addRequired(item, must);
    addMap(item, optionMap);
    addUnit(item);
  });
}
//#endregion

//. 初始化表格项
//#region
/**
 * @description 初始化表格项
 * @param {Array} items 待处理项的[{label}]
 * @param {Object} map 字段中文到字段名的映射
 * @param {Object} optionMap 字段中文到字段的选项列表的映射
 * @yields {Array} columns {label:'中文',prop:'cn',map:{}}
 */
export function initColumns(columns, map, optionMap) {
  addProp(columns, map);
  addMap(columns, optionMap);
  addUnit(columns);
}
//#endregion

//. 一次性初始化
//#region
/**
 * @description 初始化搜索、新增、表格项
 * @param {Array} items4Search 搜索项
 * @param {Array} items4Add 新增项
 * @param {Array} columns 表格项
 * @param {Object} map 字段中文到字段名的映射
 * @param {Object} optionMap 字段中文到字段的选项列表的映射
 * @param {Array} must 必填项的中文数组
 */
export function initAllItems(
  items4Search,
  items4Add,
  columns,
  map,
  optionMap,
  must
) {
  initSearchItems(items4Search, map, optionMap);
  initAddItems(items4Add, map, optionMap, must);
  initColumns(columns, map, optionMap);
}
//#endregion
