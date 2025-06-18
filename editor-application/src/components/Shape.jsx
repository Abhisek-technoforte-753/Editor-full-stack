// extensions/Shape.js
import { Node, mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react'
import {ShapeComponent} from './ShapeComponent'

const Shape = Node.create({
  name: 'shape',
  group: 'block',
  atom: true,

  addAttributes() {
    // Define default attributes for the shape node
    return {
      shapeType: { default: 'rectangle' },
      width: { default: 150 },
      height: { default: 100 },
      x: { default: 0 },
      y: { default: 0 },
         rotate: { default: 0 },
      content: { default: 'Shape' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-shape]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-shape': true })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ShapeComponent)
  },


addCommands() {
  return {
    insertShape:
      (shapeType = 'rectangle', content = 'Shape') =>
      ({ chain }) => {
        let attrs = { shapeType, content }

        if (shapeType === 'decision') {
          attrs.width = 60
          attrs.height = 60
        }

        return chain()
          .focus('end') // ⬅️ Key fix: move selection to end
          .insertContent([
            { type: this.name, attrs },
            { type: 'paragraph' },
          ])
          .run()
      },
  }
}



})

export default Shape
