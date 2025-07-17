import React, { useEffect } from 'react'
// import * as XLSX from 'xlsx'
import * as XLSX from 'xlsx-js-style'

import { saveAs } from 'file-saver'
import './TiptapExcel.css'
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

      const style = {
        font: {
          name: 'Arial',
          sz: styleSource.fs ? Math.round(styleSource.fs * 0.75) : 12,
          bold: styleSource.bl === 1,
          italic: styleSource.it === 1,
          underline: styleSource.un === 1,
          color: styleSource.fc ? { rgb: styleSource.fc.replace('#', '') } : { rgb: '000000' },
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

      if (styleSource.bg) {
        style.fill = {
          patternType: 'solid',
          fgColor: { rgb: styleSource.bg.replace('#', '') },
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


  return (
    <div>
      <h2>Excel Editor</h2>
      <button onClick={exportToXLSX} style={{ marginBottom: '10px' }}>⬇ Export to XLSX</button>
      <div id="luckysheet" style={{ width: '100%', height: '600px', margin: '0 auto' }}></div>
    </div>
  )
}

export default TiptapExcel
