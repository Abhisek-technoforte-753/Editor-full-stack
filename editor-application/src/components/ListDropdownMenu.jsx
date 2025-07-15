// src/components/ListDropdownMenu.jsx
import { List, ListOrdered, CheckSquare } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

export const ListDropdownMenu = ({ editor }) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef()

  const listOptions = [
    {
      name: 'Bullet List',
      icon: <List size={16} />,
      command: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      name: 'Ordered List',
      icon: <ListOrdered size={16} />,
      command: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      name: 'Task List',
      icon: <CheckSquare size={16} />,
      command: () => editor.chain().focus().toggleTaskList().run(),
    },
  ]

  const handleSelect = (command) => {
    command()
    setOpen(false)
  }

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button onClick={() => setOpen((prev) => !prev)}>List ▾</button>

     {open && (
  <div
    style={{
      position: 'absolute',
      top: '32px',
      left: 0,
      background: '#fff',
      border: '1px solid #ccc',
      padding: '4px 0',
      borderRadius: '4px',
      zIndex: 100,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      minWidth: '160px',
    }}
  >
    {listOptions.map((option, index) => (
      <button
        key={index}
        onClick={() => handleSelect(option.command)}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '8px 12px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '14px',
          gap: '10px',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f1f1f1'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>{option.icon}</span>
        <span>{option.name}</span>
      </button>
    ))}
  </div>
)}

    </div>
  )
}
