import React from 'react'
import { Rnd } from 'react-rnd'
import { NodeViewWrapper } from '@tiptap/react'

const MIN_WIDTH = 40
const MIN_HEIGHT = 40

export const ShapeComponent = ({ node, updateAttributes }) => {
  const shapeType = node.attrs.shapeType
  const width = Number(node.attrs.width) || 120
  const height = Number(node.attrs.height) || 120
  const x = Number(node.attrs.x) || 0
  const y = Number(node.attrs.y) || 0

  const allowResize = shapeType !== 'triangle'

  const shapeStyles = {
    rectangle: {
      backgroundColor: '#4A90E2',
     },
    circle: {
      backgroundColor: '#7ED321',
      borderRadius: '50%',
    },
    triangle: {
      width: 0,
      height: 0,
      borderLeft: `${width / 2}px solid transparent`,
      borderRight: `${width / 2}px solid transparent`,
      borderBottom: `${height}px solid #D0021B`,
      backgroundColor: 'transparent',
      borderRadius: 0,
    },
    parallelogram: {
      backgroundColor: '#50E3C2',
      transform: 'skew(20deg)',
      width: '100%',
      height: '100%',
    },

    terminator: {
      backgroundColor: '#F8E71C',
      borderRadius: '50px', // rounded rectangle
      width: '100%',
      height: '100%',
      display: 'inline-block',
      userSelect: 'none',
    },

    decision: {
      backgroundColor: '#B620E0',
      transform: 'rotate(45deg)',
      transformOrigin: 'center',
      width: '100%',
      height: '100%',
      display: 'inline-block',
      userSelect: 'none',
    },


  }

  return (
    <NodeViewWrapper as="div" style={{ position: 'absolute' }}>
      <Rnd
        size={{ width, height }}
        position={{ x, y }}
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
        onDragStop={(e, d) => {
          updateAttributes({ x: d.x, y: d.y })
        }}
      
        onResizeStop={(e, direction, ref, delta, position) => {
          let newWidth = ref.offsetWidth
          let newHeight = ref.offsetHeight

          if (shapeType === 'decision') {
            const maxSize = Math.max(newWidth, newHeight)
            newWidth = maxSize
            newHeight = maxSize
          }
         updateAttributes({
            width: newWidth,
            height: newHeight,
            x: position.x,
            y: position.y,
          })
        }}

        bounds="#editor-page" // Shared canvas container
        enableResizing={allowResize}
        dragHandleClassName="shape-drag-handle"
        style={{ display: 'inline-block', zIndex: 10 }}
      >
        <div
          className="shape-drag-handle"
          style={{
            cursor: allowResize ? 'move' : 'default',
            ...shapeStyles[shapeType],
            userSelect: 'none',
            width: shapeType === 'triangle' ? 0 : '100%',
            height: shapeType === 'triangle' ? 0 : '100%',
          }}
        />
      </Rnd>
    </NodeViewWrapper>
  )
}
