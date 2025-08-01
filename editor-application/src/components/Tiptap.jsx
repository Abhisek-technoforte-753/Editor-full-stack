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

const Tiptap = ({ initialContent: propInitialContent, documentData }) => {
  // Priority: prop data > localStorage > default
  let initialContent = '<p>Hello Tiptap!</p>';
  
  if (propInitialContent) {
    // Use content from props (loaded document)
    initialContent = propInitialContent;
  } else {
    // Fallback to localStorage
    const savedJSON = localStorage.getItem('tiptap-doc');
    if (savedJSON) {
      try {
        const parsed = JSON.parse(savedJSON);
        initialContent = parsed && parsed.content ? parsed.content : parsed;
      } catch (e) {
        initialContent = '<p>Hello Tiptap!</p>';
      }
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
  const handleLoadJson = (jsonData) => {
    if (jsonData.content) {
      setContent(jsonData.content);
      setEditable(true);
      if (editor) {
        editor.commands.setContent(jsonData.content);
        editor.setEditable(true);
      }
    }
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
          setContent(jsonData.content);
          setEditable(true);
          if (editor) {
            editor.commands.setContent(jsonData.content);
            editor.setEditable(true);
          }
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

  // Handler for saving document
  const handleSave = async (payload) => {
    try {
      const response = await fetch('https://localhost:7119/api/ExportWordTipTap/save-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Saved to API:', result);
        alert('Document saved successfully!');
      } else {
        const error = await response.text();
        console.error('API error:', error);
        alert('Failed to save to backend.');
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('Network error or server unreachable.');
    }
  };

  return (
    <div className="editor-viewport">
      <div className="editor-menu">
        <MenuBar editor={editor} disabled={!editable} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
          {editor && <ExportToPdf />}
          {editor && <ExportToWord editor={editor} />}
          <input
            type="file"
            accept="application/json"
            style={{ display: 'block' }}
            onChange={loadJsonFile}
          />
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
