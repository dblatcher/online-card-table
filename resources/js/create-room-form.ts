import { fetchSuggestedRoomName } from './api'

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
}

window.onload = () => {
  init()
}

