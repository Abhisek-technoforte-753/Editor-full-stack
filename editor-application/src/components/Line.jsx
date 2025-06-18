// extensions/Line.js
import { Node, mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react'
import { LineComponent } from './LineComponent'

const Line = Node.create({
  name: 'line',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      x: { default: 100 },
      y: { default: 100 },
      length: { default: 150 },
      angle: { default: 0 },
      strokeWidth: { default: 2 },
      strokeColor: { default: '#000' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-line]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-line': true })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(LineComponent)
  },

  // addCommands() {
  //   return {
  //     insertLine:
  //       (attrs = {}) =>
  //       ({ commands }) => {
  //         const defaultAttrs = {
  //           x: 100,
  //           y: 100,
  //           length: 150,
  //           angle: 0,
  //           strokeWidth: 2,
  //           strokeColor: '#000',
  //         }

  //         return commands.insertContent({
  //           type: this.name,
  //           attrs: {
  //             ...defaultAttrs,
  //             ...attrs,
  //           },
  //         })
  //       },
  //   }
  // },
  addCommands() {
  return {
    insertLine:
      (attrs = {}) =>
      ({ chain }) => {
        const defaultAttrs = {
          x: 100,
          y: 100,
          length: 150,
          angle: 0,
          strokeWidth: 2,
          strokeColor: '#000',
        }

        // return chain()
        //   .focus()
        //   .insertContent([
        //     { type: this.name, attrs: { ...defaultAttrs, ...attrs } },
        //     { type: 'paragraph' }, // <-- This ensures next insert doesn't overwrite
        //   ])
        //   .run()
        return chain()
  .focus('end')  // <--- Force cursor to end of document
  .insertContent([
    { type: this.name, attrs },
    { type: 'paragraph' },
  ])
  .run()

      },
  }
}

})

export default Line
