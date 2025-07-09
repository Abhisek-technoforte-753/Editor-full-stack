// SaveLoadControls.jsx
import React from 'react'

const SaveLoadControls = ({ editor }) => {
  const saveToLocalStorage = async () => {
    if (!editor) return

    const json = editor.getJSON()

    // Save to localStorage
    localStorage.setItem('tiptap-doc', JSON.stringify(json))
    alert('Document saved to localStorage!')

    // Prepare payload
    const payload = {
      docJson: JSON.stringify(json), // stringify the tiptap JSON
      verId: Math.floor(Math.random() * 1000), // random version ID
      userId: Math.floor(Math.random() * 10000) // random user ID
    }

    try {
      const response = await fetch('https://localhost:7119/api/ExportWordTipTap/save-doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Saved to API:', result)
      } else {
        const error = await response.text()
        console.error('API error:', error)
        alert('Failed to save to backend.')
      }
    } catch (error) {
      console.error('Request failed:', error)
      alert('Network error or server unreachable.')
    }
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
