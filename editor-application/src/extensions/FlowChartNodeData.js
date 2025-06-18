// FlowchartNode.ts
import { Node, mergeAttributes } from '@tiptap/core'
import mermaid from 'mermaid'

export const FlowChartNodeData = Node.create({
  name: 'flowchart',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      code: {
        default: 'graph TD;\nA-->B;',
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="flowchart"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    // Render a div with the flowchart type
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'flowchart' }), 'Flowchart']
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div')
      dom.setAttribute('data-type', 'flowchart')
      dom.contentEditable = 'false'
      dom.style.border = '1px solid #ccc'
      dom.style.padding = '10px'
      dom.style.margin = '10px 0'
      dom.style.background = '#f9f9f9'
      dom.style.borderRadius = '8px'
      dom.style.maxWidth = '100%'
      dom.style.overflowX = 'auto'

      const render = async () => {
        try {
          const { svg } = await mermaid.render(`flowchart-${Math.random()}`, node.attrs.code)
          dom.innerHTML = svg
        } catch (e) {
          dom.innerHTML = `<pre style="color:red;">Invalid Mermaid code</pre>`
        }
      }

      render()

      // Double-click to edit
      dom.addEventListener('dblclick', () => {
        const newCode = prompt('Edit Mermaid code:', node.attrs.code)
        if (newCode !== null) {
          editor.chain().focus().command(({ tr }) => {
            tr.setNodeMarkup(getPos(), undefined, {
              code: newCode,
            })
            return true
          }).run()
        }
      })

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== 'flowchart') return false
          if (updatedNode.attrs.code !== node.attrs.code) {
            render()
          }
          return true
        },
      }
    }
  },
})
