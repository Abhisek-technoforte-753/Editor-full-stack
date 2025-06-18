// SaveLoadControls.jsx
import React from 'react'

const SaveLoadControls = ({ editor }) => {
  const saveToLocalStorage = () => {
    if (!editor) return

    const json = editor.getJSON()
    localStorage.setItem('tiptap-doc', JSON.stringify(json))
    alert('Document saved to localStorage!')
  }

  return (
    <div>
      <button onClick={saveToLocalStorage} style={{ marginTop: '1rem' }}>
        💾 Save
      </button>
    </div>
  )
}

export default SaveLoadControls
