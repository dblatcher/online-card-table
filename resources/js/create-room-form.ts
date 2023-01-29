import { fetchSuggestedRoomName } from './modules/api'
import { CLIPBOARD_WIDGET_SELECTOR, initClipBoardWidget } from './modules/clipboard'

const getSuggestedName = async (nameField: HTMLInputElement) => {
  const name = await fetchSuggestedRoomName()
  if (name) {
    nameField.value = name
  }
}

function init () {
  const getNameSuggestionButton = document.querySelector('#getNameSuggestion')
  const nameField = document.querySelector('input[name=name]') as HTMLInputElement | null
  if (nameField) {
    getNameSuggestionButton?.addEventListener('click', () => {
      getSuggestedName(nameField)
    })
  }

  const clipboardContainer = document.querySelector(CLIPBOARD_WIDGET_SELECTOR)
  if (clipboardContainer) {
    initClipBoardWidget(clipboardContainer)
  }
}

window.onload = () => {
  init()
}

