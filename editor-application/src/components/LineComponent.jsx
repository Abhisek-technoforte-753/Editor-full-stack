import React, { useRef, useState, useEffect } from 'react'
import { Rnd } from 'react-rnd'
import { NodeViewWrapper } from '@tiptap/react'

export const LineComponent = ({ node, updateAttributes }) => {
  const x = Number(node.attrs.x)
  const y = Number(node.attrs.y)
  const length = Number(node.attrs.length)
  const angle = Number(node.attrs.angle)
  const strokeWidth = Number(node.attrs.strokeWidth)
  const strokeColor = node.attrs.strokeColor
const latestAttrsRef = useRef(node.attrs)

  const [rotatingRight, setRotatingRight] = useState(false)
  const [rotatingLeft, setRotatingLeft] = useState(false)

  const wrapperRef = useRef(null)

  const getCenter = () => {
    const rect = wrapperRef.current.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }

  const handleRotateStart = (side) => (e) => {
    if (side === 'right') setRotatingRight(true)
    if (side === 'left') setRotatingLeft(true)
    e.stopPropagation()
  }


const handleRotate = (e) => {
  const { x: centerX, y: centerY } = getCenter()

  const mouseX = e.clientX
  const mouseY = e.clientY

  if (rotatingRight) {
    // Right end is being dragged — keep origin fixed, update angle and length
    const dx = mouseX - centerX
    const dy = mouseY - centerY
    const radians = Math.atan2(dy, dx)
    const degrees = radians * (180 / Math.PI)
    const newLength = Math.sqrt(dx * dx + dy * dy)

    updateAttributes({
      angle: degrees,
      length: newLength,
    })
  }


}








  const handleRotateEnd = () => {
    setRotatingRight(false)
    setRotatingLeft(false)
  }

  useEffect(() => {
    if (rotatingRight || rotatingLeft) {
      window.addEventListener('mousemove', handleRotate)
      window.addEventListener('mouseup', handleRotateEnd)
      return () => {
        window.removeEventListener('mousemove', handleRotate)
        window.removeEventListener('mouseup', handleRotateEnd)
      }
    }
  }, [rotatingRight, rotatingLeft])

  useEffect(() => {
  latestAttrsRef.current = node.attrs
}, [node.attrs])

  return (
    <NodeViewWrapper
      as="div"
      style={{
        position: 'absolute',
        pointerEvents: 'auto',
        cursor: rotatingRight || rotatingLeft ? 'grabbing' : 'default',
      }}
    >
      <Rnd
        size={{ width: length, height: strokeWidth * 4 }}
        position={{ x, y }}
        minWidth={30}
        minHeight={strokeWidth * 4}
        bounds="#editor-page"
        enableResizing={{ left: true, right: true }}
        onDragStop={(e, d) => updateAttributes({ x: d.x, y: d.y })}
        onResizeStop={(e, direction, ref, delta, position) => {
          updateAttributes({
            length: ref.offsetWidth,
            x: position.x,
            y: position.y,
          })
        }}
        style={{
          zIndex: 8,
          pointerEvents: 'auto',
          border: '1px dashed transparent',
        }}
      >
        <div
          ref={wrapperRef}
          className="line-drag-handle"
          style={{
            width: '100%',
            height: '100%',
            transform: `rotate(${angle}deg)`,
            position: 'relative',
            pointerEvents: 'auto',
            cursor: 'move',
          }}
        >
          {/* The line */}
          <svg
            width={length}
            height={strokeWidth * 4}
            style={{ position: 'absolute', left: 0, top: 0 }}
          >
            <line
              x1={0}
              y1={strokeWidth * 2}
              x2={length}
              y2={strokeWidth * 2}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </svg>

          {/* Left Handle */}
          <div
            style={{
              position: 'absolute',
              left: -8,
              top: `calc(50% - 8px)`,
              width: 16,
              height: 16,
              background: '#fff',
              border: '2px solid #888',
              borderRadius: '50%',
              cursor: 'grab',
              pointerEvents: 'auto',
              zIndex: 5,
            }}
            onMouseDown={handleRotateStart('left')}
          />

          {/* Right Handle */}
          <div
            style={{
              position: 'absolute',
              right: -8,
              top: `calc(50% - 8px)`,
              width: 16,
              height: 16,
              background: '#fff',
              border: '2px solid #888',
              borderRadius: '50%',
              cursor: 'grab',
              pointerEvents: 'auto',
              zIndex: 5,
            }}
            onMouseDown={handleRotateStart('right')}
          />
        </div>
      </Rnd>
    </NodeViewWrapper>
  )
}
