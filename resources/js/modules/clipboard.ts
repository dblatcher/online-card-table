export const CLIPBOARD_WIDGET_SELECTOR = '[data-role=clipboard-widget]'

function grab (textArea: HTMLTextAreaElement) {
  if (!textArea.textContent) {
    return
  }
  navigator.clipboard.writeText(textArea.textContent)
    .then(() => {
      console.log('copied')
    })
    .catch(err => {
      console.warn('copy failed', err)
    })
}

export function initClipBoardWidget (container: Element) {
  const textArea = container.querySelector('textArea') as HTMLTextAreaElement | null
  const button = container.querySelector('button')
  if (textArea) {
    textArea.textContent = `${location.origin}/${textArea.textContent}`
  }
  if (button && textArea) {
    button.addEventListener('click', () => {
      grab(textArea)
    })
  }
}

