// Tiptap.tsx
import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Image from '@tiptap/extension-image'
import { MenuBar } from './Menubar'
import './styles.css'
import Shape from './Shape.jsx'
import Line from './Line.jsx'
// import ExportImport from './ExportImport'
import ExportToWord from './ExportToWord.jsx'
import ExportToPdf from './ExportToPdf.jsx'
import SaveLoadControls from './EditorStorageHandler.jsx'
import ExportToWordDoc from '../Dummy.jsx'
import SaveJsonFormat from './SaveJsonFormat.jsx'
import SmartQuotes from './SmartQuotes.js'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Mark } from '@tiptap/core';

// Custom Superscript extension
const Superscript = Mark.create({
  name: 'superscript',
  parseHTML() {
    return [
      { tag: 'sup' },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['sup', HTMLAttributes, 0];
  },
  addCommands() {
    return {
      toggleSuperscript: () => ({ commands }) => {
        return commands.toggleMark('superscript');
      },
    };
  },
});

// Custom Subscript extension
const Subscript = Mark.create({
  name: 'subscript',
  parseHTML() {
    return [
      { tag: 'sub' },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['sub', HTMLAttributes, 0];
  },
  addCommands() {
    return {
      toggleSubscript: () => ({ commands }) => {
        return commands.toggleMark('subscript');
      },
    };
  },
});

const LOGGED_IN_USER = "userB";

const Tiptap = () => {
  const savedJSON = localStorage.getItem('tiptap-doc')
  let initialContent = '<p>Hello Tiptap!</p>';
  if (savedJSON) {
    try {
      const parsed = JSON.parse(savedJSON);
      // If wrapped in SaveJsonFormat structure, extract .content
      initialContent = parsed && parsed.content ? parsed.content : parsed;
    } catch (e) {
      initialContent = '<p>Hello Tiptap!</p>';
    }
  }
  const [content, setContent] = React.useState(initialContent);
  const [editable, setEditable] = React.useState(true);

  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({ nested: true }),
      StarterKit,
      Underline,
      Strike,
      BulletList,
      OrderedList,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      Shape,
      Line,
      SmartQuotes
    ],
    content,
    editable,
  })

  // Handler for loading JSON and setting editability
  const handleLoadJson = (jsonContent, readOnly) => {
    setContent(jsonContent);
    setEditable(!readOnly);
    if (editor) {
      editor.commands.setContent(jsonContent);
      editor.setEditable(!readOnly);
    }
  };

  return (
    <div className="editor-viewport">
      <div className="editor-menu">
        <MenuBar editor={editor} disabled={!editable} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {editor && <ExportToPdf />}
          {editor && <ExportToWord editor={editor} />}
          {editor && <SaveLoadControls editor={editor} />}
          {editor && <SaveJsonFormat editor={editor} onLoadJson={handleLoadJson} />}
          {/* {editor && <ExportToWordDoc editor={editor} />} */}
        </div>
      </div>
      <div id="editor-page" className="editor-page">
        <div className="page">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}

export default Tiptap
