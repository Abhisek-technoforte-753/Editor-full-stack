import React, { useEffect, useRef } from 'react';
import { createUniver, LocaleType, merge } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import enUS from '@univerjs/preset-sheets-core/locales/en-US';
import * as XLSX from 'xlsx-js-style'; // instead of 'xlsx'
import { saveAs } from 'file-saver';
import '@univerjs/preset-sheets-core/lib/index.css';

const UniverEditorExcel = () => {
  const containerRef = useRef(null);
  const univerAPIRef = useRef(null);

  useEffect(() => {
    const { univer, univerAPI } = createUniver({
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: merge({}, enUS),
      },
      presets: [
        UniverSheetsCorePreset({
          container: containerRef.current,
        }),
      ],
    });

    univerAPI.createWorkbook({});
    univerAPIRef.current = univerAPI;
  }, []);

  // Export as JSON (preserves styles, formulas, etc.)
  const exportAsJSON = () => {
    const snapshot = univerAPIRef.current.getActiveWorkbook().getSnapshot();
    const json = JSON.stringify(snapshot, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'univer-export.json');
  };

  // Export as basic XLSX (with styles and correct alignment)
  const exportAsXLSX = () => {
    const snapshot = univerAPIRef.current.getActiveWorkbook().getSnapshot();
    console.log('Univer JSON:==========>', snapshot);

    const sheets = snapshot.sheets;
    const sheetIds = Object.keys(sheets);

    if (sheetIds.length === 0) return;

    const sheetId = sheetIds[0];
    const cellData = sheets[sheetId].cellData;

    // Find max row and col
    const rowIndices = Object.keys(cellData).map(Number);
    const maxRow = Math.max(...rowIndices, 0);
    let maxCol = 0;
    rowIndices.forEach(rowIdx => {
      const row = cellData[rowIdx];
      const colIndices = Object.keys(row).map(Number);
      if (colIndices.length > 0) {
        maxCol = Math.max(maxCol, ...colIndices);
      }
    });

    // Build worksheet with styles
    const worksheet = {};
    for (let r = 0; r <= maxRow; r++) {
      const row = cellData[r] || {};
      for (let c = 0; c <= maxCol; c++) {
        const cell = row[c];
        const cellRef = XLSX.utils.encode_cell({ r, c });
        if (cell) {
          // Map Univer style to XLSX style
          let style = {};
          let styleObj = {};
          if (cell.s) {
            // If cell.s is a string, look up in snapshot.styles
            if (typeof cell.s === 'string' && snapshot.styles && snapshot.styles[cell.s]) {
              styleObj = snapshot.styles[cell.s];
            } else if (typeof cell.s === 'object') {
              styleObj = cell.s;
            }
          }
          if (Object.keys(styleObj).length > 0) {
            style.font = {};
            if (styleObj.bl === 1) style.font.bold = true;
            if (styleObj.it === 1) style.font.italic = true;
            if (styleObj.fs) style.font.sz = styleObj.fs;
            if (styleObj.fc) style.font.color = { rgb: styleObj.fc.replace('#', '') };
            if (styleObj.bg) style.fill = { patternType: 'solid', fgColor: { rgb: styleObj.bg.replace('#', '') } };
          }
          worksheet[cellRef] = {
            v: cell.v,
            t: typeof cell.v === 'number' ? 'n' : 's',
            s: style,
          };
        }
      }
    }

    worksheet['!ref'] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: maxRow, c: maxCol }
    });

    worksheet['!cols'] = Array(maxCol + 1).fill({ width: 20 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'univer-export-styled.xlsx');
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={exportAsJSON} style={{ marginRight: 10 }}>
          Export as JSON (with styles)
        </button>
        <button onClick={exportAsXLSX}>
          Export as XLSX (values only)
        </button>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: 600, border: '1px solid #ccc' }} />
    </div>
  );
};

export default UniverEditorExcel;
