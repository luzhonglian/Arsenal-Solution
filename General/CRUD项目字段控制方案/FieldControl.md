# 项目字段控制方案
目的在于所有字段在3个映射表里统一维护，方便快捷，
<font color="#2186e4ff">只改文件内字段相关内容后，便无需进入到具体的vue文件修改</font>

## 映射表介绍

### 1. fieldLabelMap: 字段中文映射表 
记录每一个页面的前端显示中文和后端数据库字段的双向映射

### 2. optionsMap: 选项表
记录每一个页面修改/新增时el-select对应的下拉框options映射

### 3. unitMap: 单位映射表
记录所有有单位且需要在页面上进行展示的中文到单位的映射

## mapUtils工具函数介绍
对于增删改查页面，只需在对应页面下的config文件里配置好
**需要搜索的内容->items4Search**
**需要新增/修改的内容->items4Add**
**el-table需要展示的内容->columns**
使用initAllItems对上述内容一次性进行处理
维护时只需更改items4Search/items4Add/columns即可

## 示例组件介绍
**ActionBtns**：查询、重置、新增按钮集合
**FormField**：将多种组件合一，由传入字段控制显示想要的
**Table**：二次封装的el-table,扩展其功能
**User**：用户页面，进行增删改查及table显示的入口
**CRU**：增查改的dialog页面

