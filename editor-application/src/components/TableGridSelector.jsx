import { useState } from 'react'
import './TableGridSelector.css'

export const TableGridSelector = ({ onSelect }) => {
  const [hoveredRow, setHoveredRow] = useState(0)
  const [hoveredCol, setHoveredCol] = useState(0)

  const maxRows = 8
  const maxCols = 8

  return (
    <div className="grid-selector">
      {[...Array(maxRows)].map((_, row) => (
        <div key={row} className="row">
          {[...Array(maxCols)].map((_, col) => {
            const isActive = row <= hoveredRow && col <= hoveredCol
            return (
              <div
                key={col}
                className={`cell ${isActive ? 'active' : ''}`}
                onMouseEnter={() => {
                  setHoveredRow(row)
                  setHoveredCol(col)
                }}
                onClick={() => onSelect(row + 1, col + 1)}
              />
            )
          })}
        </div>
      ))}
      <div className="label">
        {hoveredRow + 1} × {hoveredCol + 1}
      </div>
    </div>
  )
}
