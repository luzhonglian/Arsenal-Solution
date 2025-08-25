<template>
  <el-button type="primary" @click="onClick"> 导出 </el-button>

  <el-table :data="tableData" style="width: 100%" border ref="ERef">
    <el-table-column label="歌手信息大全" align="center">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="歌手"></el-table-column>
      <el-table-column prop="region" label="住址"></el-table-column>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { utils } from "xlsx"; //! 免费版的xlsx不支持样式设置，需要使用xlsx-style-vite
import * as XLSX_STYLE from "xlsx-style-vite";
import FileSaver from "file-saver";

const ERef = ref(null);
const tableData = ref([
  { id: 1, name: "周杰伦", region: "北京王府井文华东方酒店" },
  { id: 2, name: "林俊杰", region: "上海东方明珠" },
  { id: 3, name: "", region: "广州塔" },
  {},
]);
/**
 * @description 获取字符串的宽度
 */
function getStrWidth(text, fontSize) {
  const span = document.createElement("span");
  //. 设置 span 元素的字体和样式
  const styleObj = {
    font: "bold",
    fontSize: fontSize + "px",
    visibility: "hidden",
    whiteSpace: "pre",
  };
  Object.assign(span.style, styleObj);
  span.textContent = text;
  document.body.appendChild(span);
  const width = span.offsetWidth;
  document.body.removeChild(span);
  return width;
}

const onClick = () => {
  exportElTable(ERef.value, {
    errorCells: { 2: [2] }, ///第三行第三列标红
    hasExtraHeader: true,
  });
};

/**
 * @description 导出
 * @param {*} ERef el-table 的引用
 * @param {*} filename 导出文件名
 * @param {*} errorCells:{R:[C1,C2]} 不合格数据位置,用以标红
 * @param {*} headerRowCnt 表头行数
 * @param {*} hasExtraHeader 是否有额外的描述表头，用嵌套的el-table-column实现
 * @param {*} firstColBold 第一列字体加粗
 */
function exportElTable(ERef, option = {}) {
  if (!ERef) return;

  const {
    filename = "fileName.xlsx",
    errorCells = {},
    headerRowCnt = 1,
    hasExtraHeader = false,
    firstColBold = false,
  } = option;

  const { $el } = ERef;

  const wb = utils.book_new();

  //` 获取表格的Dom对象
  //#region
  const headerDOM = $el.querySelector(
    ".el-table .el-table__header-wrapper .el-table__header"
  );
  const bodyDOM = $el.querySelector(
    ".el-table .el-table__body-wrapper .el-table__body"
  );

  let divEle = document.createElement("div");
  if (headerDOM) {
    divEle.appendChild(headerDOM.cloneNode(true));
  }
  divEle.appendChild(bodyDOM.cloneNode(true));
  const sheet = utils.table_to_sheet(divEle, { raw: true });
  //#endregion

  //`样式
  //#region
  //. 按列遍历每个单元格，给所有单元格加边框，并设置宽度为内容宽度
  const colWidths = [];
  /*
   * range是一个对象，包含了一个表格的范围
   * {s:{c:0,r:0}
   * {e:{c:maxColIndex,r:maxRowIndex}}
   */
  const range = utils.decode_range(sheet["!ref"]);
  const borderStyle = { style: "thin", color: { rgb: "000000" } }; ///默认border样式
  const getBorderStyleObj = (direction, cell) => {
    const obj = cell || { s: { border: {} } };
    obj.s.border[direction] = borderStyle;
    return obj;
  };
  const getCellRef = (r, c) => utils.encode_cell({ r, c });
  const getCell = (r, c) => sheet[getCellRef(r, c)];
  const addBorder = (R, C, dir) => {
    const CellRef = getCellRef(R, C);
    sheet[CellRef] = getBorderStyleObj(dir, sheet[CellRef]);
  };

  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 60; /// 设置一个默认宽度
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cell = getCell(R, C);
      //. 空单元格补边
      if (!cell?.t) {
        //! 有额外的描述表头时加下边框
        if (hasExtraHeader && R == 0 && C > 0) {
          addBorder(R, C, "bottom");
        }

        /// 最后一行，补下边
        if (R == range.e.r) {
          addBorder(R, C, "bottom");
        } else if (R > 0) {
          /// 上边行为空，下边行不为空，补上边
          const topCell = getCell(R - 1, C);
          const bottomCell = getCell(R + 1, C);
          if (!topCell?.t && bottomCell?.t) {
            addBorder(R, C, "top");
          }
        }
        /// 最后一列，补右边
        if (C == range.e.c) {
          addBorder(R, C, "right");
        } else if (C > 0) {
          /// 左边列为空，右边列不为空，补左边
          const leftCell = getCell(R, C - 1);
          const rightCell = getCell(R, C + 1);
          if (!leftCell?.t && rightCell?.t) {
            addBorder(R, C, "left");
          }
        }
        continue;
      }

      //. 样式设置
      //#region
      const cellStyle = {
        border: {
          top: borderStyle,
          bottom: borderStyle,
          left: borderStyle,
          right: borderStyle,
        },
        alignment: { horizontal: "center", vertical: "center" },
      };
      /// 第一列字体加粗
      if (C == 0 && firstColBold) {
        cellStyle.font = { bold: true };
      }
      /// 如果是表头，字体加粗，额外描述表头用大字体
      if (R < headerRowCnt) {
        cellStyle.font = {
          bold: true,
          ...(hasExtraHeader && R === 0 ? { sz: 18 } : {}),
        };
      }
      /// 判断是否为不合格数据，不合格的字体为红色
      if (errorCells[R]?.includes(C)) {
        cellStyle.font = { color: { rgb: "FF0000" } };
      }

      cell.s = cellStyle;
      //#endregion

      /// 计算单元格内容的最大宽度
      //! 有额外的描述表头时不算其内容宽度
      if (cell.v && !(hasExtraHeader && R == 0)) {
        const cellValue = cell.v.toString();
        const fontSize = C == range.e.c ? 16 : 14; ///字体默认是12，适当增大以留白，最后一列需更大以正常显示
        maxWidth = Math.max(maxWidth, getStrWidth(cellValue, fontSize));
      }
    }
    colWidths.push({ wpx: maxWidth });
  }
  sheet["!cols"] = colWidths;
  //#endregion

  //` 导出工作表，String2ArrayBuffer
  //#region
  utils.book_append_sheet(wb, sheet);
  divEle = null;
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };
  const writeOption = {
    bookType: "xlsx",
    bookSST: false,
    type: "binary",
    cellStyles: true,
  };
  const wbout = XLSX_STYLE.write(wb, writeOption);
  try {
    FileSaver.saveAs(
      new Blob([s2ab(wbout)], {
        type: 'application/octet-stream;charset=utf-8"',
      }),
      filename
    );
  } catch (e) {
    if (typeof console !== "undefined") {
    }
  }
  //#endregion
}
</script>

<style scoped lang="scss"></style>