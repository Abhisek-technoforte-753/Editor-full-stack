import { Extension } from '@tiptap/core'

const SmartQuotes = Extension.create({
  name: 'smartQuotes',

  addCommands() {
    return {
      wrapInSmartQuotes:
        () =>
        ({ state, dispatch, tr }) => {
          const { from, to } = state.selection

          if (from === to) return false // No selection

          const selectedText = state.doc.textBetween(from, to, ' ')
          const quoted = `“${selectedText}”`

          // Replace selected text with quoted text
          tr.insertText(quoted, from, to)
          dispatch(tr)
          return true
        },
    }
  },
})

export default SmartQuotes
