// SaveJsonFormat.jsx
import React from 'react'

const LOGGED_IN_USER = "userB";

const SaveJsonFormat = ({ editor, onLoadJson }) => {
  const saveToLocalStorage = async () => {
    if (!editor) return
    const json = editor.getJSON()
    alert('Document saved to localStorage!')
    const payload = {
      docId: null,
      content: json,
      fromUser: "userA",
      toUser: "userB",
      status: "Review_B"
    }
    localStorage.setItem('tiptap-doc', JSON.stringify(payload))

    try {
      const response = await fetch('https://localhost:7119/api/ExportWordTipTap/save-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const loadJsonFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        // Check for assigned user
        const assignedUser = jsonData.toUser;
        console.log(assignedUser, LOGGED_IN_USER,"-----------------");
        const readOnly = assignedUser !== LOGGED_IN_USER;
        if (onLoadJson) {
          onLoadJson(jsonData.content, readOnly);
        }
        alert(readOnly ? 'You are not the assigned user. Editor is read-only.' : 'You are the assigned user. You can edit.');
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <button onClick={saveToLocalStorage} style={{ marginTop: '1rem' }}>
        💾 Save-Json
      </button>
      <input
        type="file"
        accept="application/json"
        style={{ display: 'block', marginTop: '1rem' }}
        onChange={loadJsonFile}
      />
    </div>
  )
}

export default SaveJsonFormat;
