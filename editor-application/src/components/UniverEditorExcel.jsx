// import React, { useEffect, useRef, useState } from 'react';
// import { createUniver, LocaleType, merge } from '@univerjs/presets';
// import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
// import { UniverSheetsSortPreset } from '@univerjs/preset-sheets-sort';
// import enUS from '@univerjs/preset-sheets-core/locales/en-US';
// import * as XLSX from 'xlsx-js-style';
// import { saveAs } from 'file-saver';
// import '@univerjs/preset-sheets-core/lib/index.css';

// const LOGGED_IN_USER = "userBy";

// function generateRandomId() {
//   return Math.random().toString(36).substr(2, 9);
// }

// const UniverEditorExcel = () => {
//   const containerRef = useRef(null);
//   const univerAPIRef = useRef(null);
//   const [readOnly, setReadOnly] = useState(false);

//   useEffect(() => {
//     const { univer, univerAPI } = createUniver({
//       locale: LocaleType.EN_US,
//       locales: {
//         [LocaleType.EN_US]: merge({}, enUS),
//       },
//       presets: [
//         UniverSheetsCorePreset({
//           container: containerRef.current,
//         }),
//         UniverSheetsSortPreset(), // ✅ Sorting feature
//       ],
//     });

//     univerAPI.createWorkbook({});
//     univerAPIRef.current = univerAPI;
//   }, []);

//   const exportAsJSON = () => {
//     const snapshot = univerAPIRef.current.getActiveWorkbook().getSnapshot();
//     const payload = {
//       docId: null,
//       content: snapshot,
//       fromUser: "userA",
//       toUser: "userB",
//       status: "Review_B"
//     };
//     const json = JSON.stringify(payload, null, 2);
//     const blob = new Blob([json], { type: 'application/json' });
//     saveAs(blob, 'univer-export.json');
//   };

//   const exportAsXLSX = () => {
//     const snapshot = univerAPIRef.current.getActiveWorkbook().getSnapshot();
//     const sheets = snapshot.sheets;
//     const sheetIds = Object.keys(sheets);
//     if (sheetIds.length === 0) return;

//     const sheetId = sheetIds[0];
//     const cellData = sheets[sheetId].cellData;
//     const rowIndices = Object.keys(cellData).map(Number);
//     const maxRow = Math.max(...rowIndices, 0);
//     let maxCol = 0;
//     rowIndices.forEach(rowIdx => {
//       const row = cellData[rowIdx];
//       const colIndices = Object.keys(row).map(Number);
//       if (colIndices.length > 0) {
//         maxCol = Math.max(maxCol, ...colIndices);
//       }
//     });

//     const worksheet = {};
//     for (let r = 0; r <= maxRow; r++) {
//       const row = cellData[r] || {};
//       for (let c = 0; c <= maxCol; c++) {
//         const cell = row[c];
//         const cellRef = XLSX.utils.encode_cell({ r, c });
//         if (cell) {
//           let style = {};
//           let styleObj = {};
//           if (cell.s) {
//             if (typeof cell.s === 'string' && snapshot.styles && snapshot.styles[cell.s]) {
//               styleObj = snapshot.styles[cell.s];
//             } else if (typeof cell.s === 'object') {
//               styleObj = cell.s;
//             }
//           }
//           if (Object.keys(styleObj).length > 0) {
//             style.font = {};
//             if (styleObj.bl === 1) style.font.bold = true;
//             if (styleObj.it === 1) style.font.italic = true;
//             if (styleObj.fs) style.font.sz = styleObj.fs;
//             if (styleObj.fc) style.font.color = { rgb: styleObj.fc.replace('#', '').toUpperCase() };
//             if (styleObj.bg) style.fill = {
//               patternType: 'solid',
//               fgColor: { rgb: styleObj.bg.replace('#', '').toUpperCase() }
//             };
//           }
//           worksheet[cellRef] = {
//             v: cell.v,
//             t: typeof cell.v === 'number' ? 'n' : 's',
//             s: style,
//           };
//         }
//       }
//     }

//     worksheet['!ref'] = XLSX.utils.encode_range({
//       s: { r: 0, c: 0 },
//       e: { r: maxRow, c: maxCol }
//     });

//     worksheet['!cols'] = Array(maxCol + 1).fill({ width: 20 });

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'univer-export-styled.xlsx');
//   };

//   const loadJsonFile = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const jsonData = JSON.parse(event.target.result);
//         if (jsonData && typeof jsonData === 'object' && jsonData.content && jsonData.toUser) {
//           const assignedUser = jsonData.toUser;
//           const isReadOnly = assignedUser !== LOGGED_IN_USER;
//           jsonData.content.id = generateRandomId();
//           univerAPIRef.current.createWorkbook(jsonData.content);
//           setReadOnly(isReadOnly);
//           alert(isReadOnly ? 'You are not the assigned user. Editor is read-only.' : 'You can edit.');
//         } else {
//           jsonData.id = generateRandomId();
//           univerAPIRef.current.createWorkbook(jsonData);
//           setReadOnly(false);
//           alert('Loaded snapshot (no user check). You can edit.');
//         }
//       } catch (err) {
//         console.error('Error loading JSON:', err);
//         alert('Invalid JSON file.');
//       }
//     };
//     reader.readAsText(file);
//   };

//   return (
//     <div>
//       <div style={{ marginBottom: 10 }}>
//         <button onClick={exportAsJSON} style={{ marginRight: 10 }}>
//           Export as JSON (with styles)
//         </button>
//         <button onClick={exportAsXLSX}>
//           Export as XLSX (values only)
//         </button>
//         <input
//           type="file"
//           accept="application/json"
//           style={{ display: 'block', marginTop: '1rem' }}
//           onChange={loadJsonFile}
//         />
//       </div>
//       <div ref={containerRef} style={{ width: '100%', height: 600, border: '1px solid #ccc' }} />
//     </div>
//   );
// };

// export default UniverEditorExcel;

import React, { useEffect, useRef, useState } from 'react';
import { createUniver, LocaleType, merge } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import { UniverSheetsSortPreset } from '@univerjs/preset-sheets-sort';
import { UniverSheetsFilterPreset } from '@univerjs/preset-sheets-filter';
import { UniverSheetsFilterUIPlugin } from '@univerjs/sheets-filter-ui';
import enUS from '@univerjs/preset-sheets-core/locales/en-US';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import '@univerjs/preset-sheets-core/lib/index.css';

const LOGGED_IN_USER = "userBy";

function generateRandomId() {
  return Math.random().toString(36).substr(2, 9);
}

const UniverEditorExcel = () => {
  const containerRef = useRef(null);
  const univerAPIRef = useRef(null);
  const [readOnly, setReadOnly] = useState(false);

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
        UniverSheetsSortPreset(),
        UniverSheetsFilterPreset(), // ✅ This already includes UI plugin
      ],
    });
  
    univerAPI.createWorkbook({});
    univerAPIRef.current = univerAPI;
  }, []);
  

 
  
  
  

  const exportAsJSON = () => {
    const snapshot = univerAPIRef.current.getActiveWorkbook().getSnapshot();
    const payload = {
      docId: null,
      content: snapshot,
      fromUser: "userA",
      toUser: "userB",
      status: "Review_B"
    };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'univer-export.json');
  };

  const exportAsXLSX = () => {
    const snapshot = univerAPIRef.current.getActiveWorkbook().getSnapshot();
    const sheets = snapshot.sheets;
    const sheetIds = Object.keys(sheets);
    if (sheetIds.length === 0) return;

    const sheetId = sheetIds[0];
    const cellData = sheets[sheetId].cellData;
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

    const worksheet = {};
    for (let r = 0; r <= maxRow; r++) {
      const row = cellData[r] || {};
      for (let c = 0; c <= maxCol; c++) {
        const cell = row[c];
        const cellRef = XLSX.utils.encode_cell({ r, c });
        if (cell) {
          let style = {};
          let styleObj = {};
          if (cell.s) {
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
            if (styleObj.fc) style.font.color = { rgb: styleObj.fc.replace('#', '').toUpperCase() };
            if (styleObj.bg) style.fill = {
              patternType: 'solid',
              fgColor: { rgb: styleObj.bg.replace('#', '').toUpperCase() }
            };
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

  const loadJsonFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        if (jsonData && typeof jsonData === 'object' && jsonData.content && jsonData.toUser) {
          const assignedUser = jsonData.toUser;
          const isReadOnly = assignedUser !== LOGGED_IN_USER;
          jsonData.content.id = generateRandomId();
          univerAPIRef.current.createWorkbook(jsonData.content);
          setReadOnly(isReadOnly);
          alert(isReadOnly ? 'You are not the assigned user. Editor is read-only.' : 'You can edit.');
        } else {
          jsonData.id = generateRandomId();
          univerAPIRef.current.createWorkbook(jsonData);
          setReadOnly(false);
          alert('Loaded snapshot (no user check). You can edit.');
        }
      } catch (err) {
        console.error('Error loading JSON:', err);
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
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
        <input
          type="file"
          accept="application/json"
          style={{ display: 'block', marginTop: '1rem' }}
          onChange={loadJsonFile}
        />
      </div>
      <div ref={containerRef} style={{ width: '100%', height: 600, border: '1px solid #ccc' }} />
    </div>
  );
};

export default UniverEditorExcel;
