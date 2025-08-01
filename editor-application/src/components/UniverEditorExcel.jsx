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
import { UniverSheetsExchangeClientPlugin } from '@univerjs-pro/sheets-exchange-client';
import DocumentForm from './DocumentForm.jsx';



function generateRandomId() {
  return Math.random().toString(36).substr(2, 9);
}

const UniverEditorExcel = ({ initialContent, documentData, setEditorInstance }) => {
  const containerRef = useRef(null);
  const univerAPIRef = useRef(null);
  const [readOnly, setReadOnly] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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
        UniverSheetsFilterPreset(),
      ],
    });
  
    // Create workbook first
    univerAPI.createWorkbook({});
    univerAPIRef.current = univerAPI;
    setIsInitialized(true);
    if (setEditorInstance && univerAPIRef.current) {
      setEditorInstance(univerAPIRef.current);
    }
  }, [setEditorInstance]);

  // Load initial content when component is initialized and initialContent is available
  useEffect(() => {
    if (isInitialized && initialContent && univerAPIRef.current) {
      console.log('Loading initial content in Excel editor:', initialContent);
      try {
        // Handle the content structure - it might be nested
        let contentToLoad = initialContent;
        if (initialContent.content) {
          contentToLoad = initialContent.content;
          console.log('Using nested content:', contentToLoad);
        }
        if (contentToLoad && typeof contentToLoad === 'object') {
          contentToLoad.id = generateRandomId();
          console.log('Creating workbook with content:', contentToLoad);
          univerAPIRef.current.createWorkbook(contentToLoad);
          setReadOnly(false);
          console.log('Initial content loaded successfully in Excel editor');
        } else {
          console.warn('Content to load is not a valid object:', contentToLoad);
        }
      } catch (error) {
        console.error('Error loading initial content in Excel editor:', error);
      }
    } else {
      console.log('Excel editor initialization status:', {
        isInitialized,
        hasInitialContent: !!initialContent,
        hasUniverAPI: !!univerAPIRef.current
      });
    }
  }, [isInitialized, initialContent]);
 
  const exportAsJSON = () => {
    const snapshot = univerAPIRef.current.getActiveWorkbook().getSnapshot();
    const payload = {
      docId: null,
      content: snapshot,
      fromUser: "userA",
      toUser: "userB",
      type:"Excel",
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
        
        // Process cell if it has content OR if it has styles (like borders)
        const cellData = row[c];
        if (cellData) {
          console.log(`Processing cell [${r},${c}]:`, cellData);
          let style = {};
          let styleObj = {};
          let cellValue = '';
          let cellType = 's';
          
          // Get cell value and type
          if (cellData.v !== undefined) {
            cellValue = cellData.v;
            cellType = typeof cellData.v === 'number' ? 'n' : 's';
          }
          
          // Get style object
          if (cellData.s) {
            if (typeof cellData.s === 'string' && snapshot.styles && snapshot.styles[cellData.s]) {
              styleObj = snapshot.styles[cellData.s];
              console.log(`Style for cell [${r},${c}]:`, styleObj);
            } else if (typeof cellData.s === 'object') {
              styleObj = cellData.s;
              console.log(`Inline style for cell [${r},${c}]:`, styleObj);
            }
          }
          
          if (Object.keys(styleObj).length > 0) {
            style.font = {};
            if (styleObj.bl === 1) style.font.bold = true;
            if (styleObj.it === 1) style.font.italic = true;
            if (styleObj.fs) style.font.sz = styleObj.fs;
            if (styleObj.fc) {
              style.font.color = { rgb: styleObj.fc.replace('#', '').toUpperCase() };
            } else if (styleObj.cl && styleObj.cl.rgb) {
              style.font.color = { rgb: styleObj.cl.rgb.replace('#', '').toUpperCase() };
            }
            if (styleObj.bg) {
              let bgColor = styleObj.bg;
              if (typeof bgColor === 'object' && bgColor.rgb) {
                bgColor = bgColor.rgb;
              }
              if (typeof bgColor === 'string') {
                style.fill = {
                  patternType: 'solid',
                  fgColor: { rgb: bgColor.replace('#', '').toUpperCase() }
                };
              }
            }
            if (styleObj.wr === 1 || styleObj.tb === 3) {
              style.alignment = style.alignment || {};
              style.alignment.wrapText = true;
            }
            
            // Alignment mapping
            if (styleObj.ht || styleObj.vt) {
              style.alignment = style.alignment || {};
              // Horizontal alignment
              if (styleObj.ht) {
                if (styleObj.ht === 1) style.alignment.horizontal = 'left';
                else if (styleObj.ht === 2) style.alignment.horizontal = 'center';
                else if (styleObj.ht === 3) style.alignment.horizontal = 'right';
              }
              // Vertical alignment
              if (styleObj.vt) {
                if (styleObj.vt === 1) style.alignment.vertical = 'top';
                else if (styleObj.vt === 2) style.alignment.vertical = 'center';
                else if (styleObj.vt === 3) style.alignment.vertical = 'bottom';
              }
            }

            // Handle borders
            if (styleObj.bd) {
              console.log(`Processing borders for cell [${r},${c}]:`, styleObj.bd);
              style.border = {};
              const border = styleObj.bd;
              
              // Top border
              if (border.t && border.t.s === 1) {
                style.border.top = {
                  style: 'thin',
                  color: { rgb: border.t.cl.rgb.replace('#', '').toUpperCase() }
                };
              }
              
              // Bottom border
              if (border.b && border.b.s === 1) {
                style.border.bottom = {
                  style: 'thin',
                  color: { rgb: border.b.cl.rgb.replace('#', '').toUpperCase() }
                };
              }
              
              // Left border
              if (border.l && border.l.s === 1) {
                style.border.left = {
                  style: 'thin',
                  color: { rgb: border.l.cl.rgb.replace('#', '').toUpperCase() }
                };
              }
              
              // Right border
              if (border.r && border.r.s === 1) {
                style.border.right = {
                  style: 'thin',
                  color: { rgb: border.r.cl.rgb.replace('#', '').toUpperCase() }
                };
              }
            }
          }
          
          worksheet[cellRef] = {
            v: cellValue,
            t: cellType,
            s: style,
          };
        }
      }
    }

    // Handle merged cells
    const mergeData = sheets[sheetId].mergeData || [];
    if (mergeData.length > 0) {
      worksheet['!merges'] = mergeData.map(merge => ({
        s: { r: merge.startRow, c: merge.startColumn },
        e: { r: merge.endRow, c: merge.endColumn }
      }));
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
        console.log('Loading JSON data:', jsonData);
        if (jsonData.content) {
          jsonData.content.id = generateRandomId();
          univerAPIRef.current.createWorkbook(jsonData.content);
          setReadOnly(false);
          alert('JSON file loaded successfully!');
        } else {
          alert('Invalid JSON format. Missing content field.');
        }
      } catch (err) {
        console.error('Error parsing JSON:', err);
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

 
  return (
    <div>
      <div style={{ marginBottom: 10, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={exportAsJSON} style={{ marginRight: 10 }}>
          Export as JSON (with styles)
        </button>
        <button onClick={exportAsXLSX}>
          Export as XLSX (values only)
        </button>
        <input
          type="file"
          accept="application/json"
          style={{ display: 'block' }}
          onChange={loadJsonFile}
        />
      </div>
      <div ref={containerRef} style={{ width: '100%', height: 600, border: '1px solid #ccc' }} />

    </div>
  );
};

export default UniverEditorExcel;
