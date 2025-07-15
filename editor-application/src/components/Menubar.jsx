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
  CheckSquare
} from 'lucide-react' // make sure you have lucide-react installed
import { TableGridSelector } from './TableGridSelector' // your custom table grid selector component
import "./menubar.css" // import your CSS styles for the menu bar
import { ListDropdownMenu } from './ListDropdownMenu'

export const MenuBar = ({ editor }) => {
  const [showTableGrid, setShowTableGrid] = useState(false)
  const [showShapeDropdown, setShowShapeDropdown] = useState(false)
  const [tableAction, setTableAction] = useState('')
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
    <div
      className="control-group"
      style={{
        padding: '10px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        marginBottom: '16px',
        borderRadius: '6px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        type="button"
        aria-label="Toggle Bold"
      >
        <Bold size={16} />
      </button>
      <button onClick={() => {
        alert('This feature is not implemented yet.')
        // editor.chain().focus().insertContent({
        //   type: 'flowchart',
        //   attrs: { code: 'graph TD;\nA-->B;' },
        // }).run()
      }}>
        Flowchart
      </button>
      {/* Shape insertion buttons */}
      <div
        className="control-group"
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          marginBottom: '16px',
          borderRadius: '6px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          position: 'relative',
        }}
      >


        {/* Shape dropdown trigger */}
        <div >
          <button onClick={() => setShowShapeDropdown(prev => !prev)} type="button">
            <Shapes size={18} /> Shape
          </button>

          {showShapeDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: 0,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '10px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <button onClick={() => insertShape('rectangle', 'Rectangle')}>🟥 Rectangle</button>
              <button onClick={() => insertShape('circle', 'Circle')}>⭕ Circle</button>
              <button onClick={() => insertShape('triangle', 'Triangle')}>🔺 Triangle</button>
              <button onClick={() => insertShape('parallelogram', 'Parallelogram')}>▰ Parallelogram</button>
              <button onClick={() => insertShape('terminator', 'Terminator')}>🛑 Terminator</button>
              <button onClick={() => insertShape('decision', 'Decision')}>🔷 Decision</button>
            </div>
          )}
        </div>
        <div>
          {/* {editor.isActive('table') && (
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
          <button onClick={() => editor.commands.addColumnBefore()}>
            ➕ Add Column Before
          </button>
          <button onClick={() => editor.commands.addColumnAfter()}>
            ➕ Add Column After
          </button>
          <button onClick={() => editor.commands.addRowBefore()}>
            ➕ Add Row Above
          </button>
          <button onClick={() => editor.commands.addRowAfter()}>
            ➕ Add Row Below
          </button>
          <button onClick={() => editor.commands.deleteRow()}>
            ❌ Delete Row
          </button>
          <button onClick={() => editor.commands.deleteColumn()}>
            ❌ Delete Column
          </button>
        </div>
      )} */}

        </div>

      </div>
      <div>
        {/* {editor.isActive('table') && ( */}
        <div style={{ height: "100%" }}>
          <select
            className='table-action-select'
            value={tableAction}
            onChange={(e) => handleTableAction(e.target.value)}
          >
            <option value="">-- Table Actions --</option>
            <option value="addColumnBefore">➕ Add Column Before</option>
            <option value="addColumnAfter">➕ Add Column After</option>
            <option value="addRowBefore">➕ Add Row Above</option>
            <option value="addRowAfter">➕ Add Row Below</option>
            <option value="deleteRow">❌ Delete Row</option>
            <option value="deleteColumn">❌ Delete Column</option>
          </select>
        </div>
        {/* )} */}
      </div>
      <button onClick={() => editor
        .chain()
        .focus()
        .insertLine({
          x: 100,
          y: 100,
          length: 200,
          angle: 30,
          strokeWidth: 2,
          strokeColor: 'black',
        })
        .run()
      } type="button">
        ➖
      </button>



      <button
        onClick={onClickImageButton}
        type="button"
        aria-label="Insert Image"
      >
        <ImageIcon size={16} />
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        type="button"
        aria-label="Toggle Italic"
      >
        <Italic size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
        type="button"
        aria-label="Toggle Strikethrough"
      >
        <Strikethrough size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
        type="button"
        aria-label="Toggle Code"
      >
        <Code size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        type="button"
        aria-label="Clear Marks"
      >
        <Eraser size={16} />
      </button>


      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        type="button"
        aria-label="Heading 1"
      >
        H1
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        type="button"
        aria-label="Heading 2"
      >
        H2
      </button>

      
      <div style={{ position: 'relative' }}>
  

  <ListDropdownMenu editor={editor} />
</div>
     
      <button
        onClick={() => editor.commands.wrapInSmartQuotes()}
        disabled={!editor || editor.state.selection.empty}
      >
        “” Smart Quote
      </button>

      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        type="button"
        aria-label="Horizontal Rule"
      >
        <Minus size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        type="button"
        aria-label="Undo"
      >
        <Undo size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        type="button"
        aria-label="Redo"
      >
        <Redo size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
        type="button"
        aria-label="Highlight Purple"
      >
        <Highlighter size={16} /> Purple
      </button>

      {/* Table Insert Dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowTableGrid((prev) => !prev)}
          type="button"
          aria-label="Insert Table"
        >
          <TableIcon size={16} />
        </button>

        {showTableGrid && (
          <div
            style={{
              position: 'absolute',
              top: '36px',
              left: 0,
              zIndex: 10,
              background: '#fff',
              padding: 6,
              border: '1px solid #ccc',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            <TableGridSelector onSelect={insertTable} />
          </div>
        )}
      </div>
    </div>
  )
}
