import React, { useEffect } from 'react'
// import * as XLSX from 'xlsx'
import * as XLSX from 'xlsx-js-style'

import { saveAs } from 'file-saver'
import './TiptapExcel.css'

function rgbStringToHex(rgb) {
  const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
  if (!result) return null;
  return (
    ((1 << 24) + (parseInt(result[1]) << 16) + (parseInt(result[2]) << 8) + parseInt(result[3]))
      .toString(16)
      .toUpperCase()
      .slice(1)
  );
}

const TiptapExcel = () => {
  useEffect(() => {
    const head = document.head

    const jqueryScript = document.createElement('script')
    jqueryScript.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js'
    jqueryScript.onload = () => {
      const mousewheelScript = document.createElement('script')
      mousewheelScript.src = 'https://cdn.jsdelivr.net/npm/jquery-mousewheel@3.1.13/jquery.mousewheel.min.js'
      mousewheelScript.onload = () => {
        const cssLinks = [
          'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/plugins.css',
          'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/css/luckysheet.css',
          'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/assets/iconfont/iconfont.css',
        ]
        cssLinks.forEach(href => {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = href
          head.appendChild(link)
        })

        const luckysheetScript = document.createElement('script')
        luckysheetScript.src = 'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/luckysheet.umd.js'
        luckysheetScript.onload = () => {
          window.luckysheet.create({
            container: 'luckysheet',
            title: 'Excel Editor',
            lang: 'en',
            showtoolbar: true,
            showsheetbar: true,
            showinfobar: true,
            showstatbar: true,
            enableAddRow: true,
            enableAddCol: true,
            allowEdit: true,
          })
        }

        head.appendChild(luckysheetScript)
      }
      head.appendChild(mousewheelScript)
    }

    head.appendChild(jqueryScript)
  }, [])

const exportToXLSX = () => {
  const luckysheetData = window.luckysheet.getAllSheets();
  console.log('Luckysheet Data:', luckysheetData);
  const sheet = luckysheetData[0];
  const worksheet = {};
  let maxCol = 0;

  // Get styles map if present
  const stylesMap = (sheet.config && sheet.config.styles) ? sheet.config.styles : {};

  sheet.data.forEach((row, rowIndex) => {
    if (!row) return;

    row.forEach((cell, colIndex) => {
      if (!cell) return;

      maxCol = Math.max(maxCol, colIndex);
      const cellRef = XLSX.utils.encode_cell({ c: colIndex, r: rowIndex });

      // Extract style from cell or referenced style, but keep value from cell
      let styleSource = cell;
      if (cell.s !== undefined && stylesMap[cell.s]) {
        styleSource = { ...stylesMap[cell.s], ...cell };
      }

      // Robust color extraction
      let fontColor = '000000';
      try {
        if (styleSource.fc) {
          if (typeof styleSource.fc === 'object' && styleSource.fc.rgb && typeof styleSource.fc.rgb === 'string') {
            let hex = rgbStringToHex(styleSource.fc.rgb);
            if (hex) fontColor = hex;
          } else if (typeof styleSource.fc === 'string') {
            if (styleSource.fc.startsWith('rgb(')) {
              let hex = rgbStringToHex(styleSource.fc);
              if (hex) fontColor = hex;
            } else if (/^[0-9A-Fa-f#]{3,}$/.test(styleSource.fc)) {
              fontColor = styleSource.fc.replace('#', '').toUpperCase();
            }
          }
        }
      } catch (e) {
        fontColor = '000000';
      }
      let fillColor = null;
      try {
        if (styleSource.bg) {
          if (typeof styleSource.bg === 'object' && styleSource.bg.rgb && typeof styleSource.bg.rgb === 'string') {
            let hex = rgbStringToHex(styleSource.bg.rgb);
            if (hex) fillColor = hex;
          } else if (typeof styleSource.bg === 'string') {
            if (styleSource.bg.startsWith('rgb(')) {
              let hex = rgbStringToHex(styleSource.bg);
              if (hex) fillColor = hex;
            } else if (/^[0-9A-Fa-f#]{3,}$/.test(styleSource.bg)) {
              fillColor = styleSource.bg.replace('#', '').toUpperCase();
            }
          }
        }
      } catch (e) {
        fillColor = null;
      }

      const style = {
        font: {
          name: 'Arial',
          sz: styleSource.fs ? Math.round(styleSource.fs * 0.75) : 12,
          bold: styleSource.bl === 1,
          italic: styleSource.it === 1,
          underline: styleSource.un === 1,
          color: { rgb: fontColor },
        },
        alignment: {
          wrapText: true,
          horizontal:
            styleSource.ht === 1
              ? 'center'
              : styleSource.ht === 2
              ? 'right'
              : 'left',
        },
      };

      if (fillColor) {
        style.fill = {
          patternType: 'solid',
          fgColor: { rgb: fillColor },
        };
      }

      worksheet[cellRef] = {
        v: cell.v || '', // Always use value from original cell
        t: typeof cell.v === 'number' ? 'n' : 's',
        s: style,
      };
    });
  });

  worksheet['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: sheet.data.length - 1, c: maxCol },
  });

  worksheet['!cols'] = Array(maxCol + 1).fill({ width: 30 });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(
    new Blob([wbout], { type: 'application/octet-stream' }),
    'luckysheet_export_styled.xlsx'
  );
};

  // Export Luckysheet data as JSON
  const exportToJSON = () => {
    const luckysheetData = window.luckysheet.getAllSheets();
    const json = JSON.stringify(luckysheetData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'luckysheet-export.json');
  };

  // Import JSON and load into Luckysheet
  const importFromJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let jsonData = JSON.parse(event.target.result);
        // Accept both array and object-with-data
        if (Array.isArray(jsonData)) {
          // ok
        } else if (jsonData && Array.isArray(jsonData.data)) {
          jsonData = jsonData.data;
        } else {
          throw new Error('Invalid Luckysheet JSON format');
        }
        // Assign unique indexes if missing
        jsonData.forEach((sheet, idx) => {
          if (sheet.index === undefined) sheet.index = idx + 1;
        });
        // Reload Luckysheet with imported data
        window.luckysheet.destroy();
        window.luckysheet.create({
          container: 'luckysheet',
          data: jsonData,
          title: 'Excel Editor',
          lang: 'en',
          showtoolbar: true,
          showsheetbar: true,
          showinfobar: true,
          showstatbar: true,
          enableAddRow: true,
          enableAddCol: true,
          allowEdit: true,
        });
        alert('JSON imported successfully!');
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h2>Excel Editor</h2>
      <button onClick={exportToXLSX} style={{ marginBottom: '10px', marginRight: '10px' }}>⬇ Export to XLSX</button>
      <button onClick={exportToJSON} style={{ marginBottom: '10px', marginRight: '10px' }}>⬇ Export to JSON</button>
      <label style={{ marginBottom: '10px', marginRight: '10px', cursor: 'pointer' }}>
        ⬆ Import from JSON
        <input type="file" accept="application/json" style={{ display: 'none' }} onChange={importFromJSON} />
      </label>
      <div id="luckysheet" style={{ width: '100%', height: '600px', margin: '0 auto' }}></div>
    </div>
  )
}

export default TiptapExcel
