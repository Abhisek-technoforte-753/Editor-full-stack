// MenuBar.tsx
import React, { useRef, useState } from 'react'
import Modal from 'react-modal'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Type,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Eraser,
  Minus,
  Highlighter,
  TableIcon,
  ImageIcon,
  Shapes,
  ChevronDown,
  CheckSquare,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette
} from 'lucide-react' // make sure you have lucide-react installed
import { TableGridSelector } from './TableGridSelector' // your custom table grid selector component
import "./menubar.css" // import your CSS styles for the menu bar
import { ListDropdownMenu } from './ListDropdownMenu'

export const MenuBar = ({ editor }) => {
  const [showTableGrid, setShowTableGrid] = useState(false)
  const [showShapeDropdown, setShowShapeDropdown] = useState(false)
  const [tableAction, setTableAction] = useState('')
  const [showColorDropdown, setShowColorDropdown] = useState(false)
  const fileInputRef = useRef(null)
// const [showListDropdown, setShowListDropdown] = useState(false)
  if (!editor) {
    return null
  }

  const handleTableAction = (action) => {
    switch (action) {
      case 'addColumnBefore':
        editor.commands.addColumnBefore()
        break
      case 'addColumnAfter':
        editor.commands.addColumnAfter()
        break
      case 'addRowBefore':
        editor.commands.addRowBefore()
        break
      case 'addRowAfter':
        editor.commands.addRowAfter()
        break
      case 'deleteRow':
        editor.commands.deleteRow()
        break
      case 'deleteColumn':
        editor.commands.deleteColumn()
        break
      default:
        break
    }

    setTableAction('') // reset dropdown after selection
  }

  const insertTable = (rows, cols) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setShowTableGrid(false)
  }

  const onFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (readerEvent) => {
        const base64 = readerEvent.target.result
        editor.chain().focus().setImage({ src: base64 }).run()
      }
      reader.readAsDataURL(file)
    }
    // Reset input value to allow re-uploading same file if needed
    event.target.value = null
  }

  // Trigger file input click
  const onClickImageButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const insertShape = (type, label) => {
    editor.chain().focus().insertShape(type, label).run()
    setShowShapeDropdown(false)
  }
  return (
    <nav className="menubar">
      <div className="menubar-content">
        {/* Row 1 */}
        <div className="menubar-row">
          <button title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={`menubar-btn${editor.isActive('bold') ? ' menubar-btn-active' : ''}`}> <Bold size={18} /> </button>
          <button title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={`menubar-btn${editor.isActive('italic') ? ' menubar-btn-active' : ''}`}> <Italic size={18} /> </button>
          <button title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`menubar-btn${editor.isActive('underline') ? ' menubar-btn-active' : ''}`}> <Underline size={18} /> </button>
          <button title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} className={`menubar-btn${editor.isActive('strike') ? ' menubar-btn-active' : ''}`}> <Strikethrough size={18} /> </button>
          <button title="Code" onClick={() => editor.chain().focus().toggleCode().run()} className={`menubar-btn${editor.isActive('code') ? ' menubar-btn-active' : ''}`}> <Code size={18} /> </button>
          <button title="Clear Formatting" onClick={() => editor.chain().focus().unsetAllMarks().run()} className="menubar-btn"> <Eraser size={18} /> </button>
          <select title="Font Family" onChange={e => editor.chain().focus().setMark('textStyle', { fontFamily: e.target.value }).run()} defaultValue="" className="menubar-select">
            <option value="">Font</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
          <select title="Font Size" onChange={e => editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()} defaultValue="" className="menubar-select">
            <option value="">Size</option>
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="24px">24</option>
            <option value="32px">32</option>
          </select>
          <button title="Highlight" onClick={() => editor.chain().focus().toggleHighlight().run()} className="menubar-btn"> <Highlighter size={18} /> </button>
          {/* Color Picker Dropdown */}
          <div className="menubar-relative" style={{ display: 'inline-block' }}>
            <button
              title="Text Color"
              onClick={() => setShowColorDropdown((prev) => !prev)}
              className="menubar-btn"
              type="button"
            >
              <Palette size={18} />
            </button>
            {showColorDropdown && (
              <div className="menubar-popup" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '6px',
                padding: '10px',
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                position: 'absolute',
                zIndex: 10
              }}>
                {[
                  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF', '#FF0000',
                  '#FFA500', '#FFFF00', '#008000', '#00CED1', '#0000FF', '#800080', '#FFC0CB',
                  '#FFD700', '#A52A2A', '#8B4513', '#2E8B57', '#20B2AA', '#4682B4', '#708090'
                ].map(color => (
                  <button
                    key={color}
                    title={color}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorDropdown(false);
                    }}
                    style={{ background: color, width: 22, height: 22, border: editor.isActive('textStyle', { color }) ? '2px solid #333' : '1px solid #ccc', borderRadius: 4, cursor: 'pointer' }}
                  />
                ))}
              </div>
            )}
          </div>
          <button title="Align Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} className="menubar-btn"> <AlignLeft size={18} /> </button>
          <button title="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} className="menubar-btn"> <AlignCenter size={18} /> </button>
        </div>
        {/* Row 2 */}
        <div className="menubar-row">
          <button title="Align Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} className="menubar-btn"> <AlignRight size={18} /> </button>
          <button title="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()} className="menubar-btn"> <Type size={18} className="-mb-1" /> <span className="text-xs align-super">sup</span> </button>
          <button title="Subscript" onClick={() => editor.chain().focus().toggleSubscript().run()} className="menubar-btn"> <Type size={18} className="-mt-1" /> <span className="text-xs align-sub">sub</span> </button>
          <ListDropdownMenu editor={editor} />
          <button title="Task List" onClick={() => editor.chain().focus().toggleTaskList().run()} className="menubar-btn"> <CheckSquare size={18} /> </button>
          <div className="menubar-relative">
            <button title="Insert Table" onClick={() => setShowTableGrid((prev) => !prev)} type="button" className="menubar-btn"> <TableIcon size={18} /> </button>
            {showTableGrid && (
              <div className="menubar-popup">
                <TableGridSelector onSelect={insertTable} />
              </div>
            )}
          </div>
          {/* Table Actions Dropdown */}
          <select
            className="menubar-select"
            value={tableAction}
            onChange={(e) => handleTableAction(e.target.value)}
            title="Table Actions"
          >
            <option value="">-- Table Actions --</option>
            <option value="addColumnBefore">➕ Add Column Before</option>
            <option value="addColumnAfter">➕ Add Column After</option>
            <option value="addRowBefore">➕ Add Row Above</option>
            <option value="addRowAfter">➕ Add Row Below</option>
            <option value="deleteRow">❌ Delete Row</option>
            <option value="deleteColumn">❌ Delete Column</option>
          </select>

          <div className="menubar-relative">
            <button title="Insert Shape" onClick={() => setShowShapeDropdown(prev => !prev)} type="button" className="menubar-btn flex items-center gap-1"> <Shapes size={18} /> </button>
            {showShapeDropdown && (
              <div className="menubar-popup">
                <button onClick={() => insertShape('rectangle', 'Rectangle')} className="menubar-btn">🟥</button>
                <button onClick={() => insertShape('circle', 'Circle')} className="menubar-btn">⭕</button>
                <button onClick={() => insertShape('triangle', 'Triangle')} className="menubar-btn">🔺</button>
                <button onClick={() => insertShape('parallelogram', 'Parallelogram')} className="menubar-btn">▰</button>
                <button onClick={() => insertShape('terminator', 'Terminator')} className="menubar-btn">🛑</button>
                <button onClick={() => insertShape('decision', 'Decision')} className="menubar-btn">🔷</button>
              </div>
            )}
          </div>
          
          <button title="Insert Image" onClick={onClickImageButton} type="button" className="menubar-btn"> <ImageIcon size={18} /> </button>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={onFileChange} />
          <button title="Insert Line" onClick={() => editor.chain().focus().insertLine({ x: 100, y: 100, length: 200, angle: 30, strokeWidth: 2, strokeColor: 'black' }).run()} type="button" className="menubar-btn"> <Minus size={18} /> </button>
          <button title="Smart Quotes" onClick={() => editor.commands.wrapInSmartQuotes()} disabled={!editor || editor.state.selection.empty} className="menubar-btn"> <Quote size={18} /> </button>
          <button title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} type="button" className="menubar-btn"> <Minus size={18} /> </button>
          <button title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} type="button" className="menubar-btn"> <Undo size={18} /> </button>
          <button title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} type="button" className="menubar-btn"> <Redo size={18} /> </button>
        </div>
       </div>
    </nav>
  )
}
