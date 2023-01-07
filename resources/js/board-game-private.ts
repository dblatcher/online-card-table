import '../scss/boardGame.scss'
import { h, render } from 'preact'
import { BoardGameApp } from './BoardGameApp'

function initBoardGame() {
  const container = document.querySelector('#app-container')

  if (!container) {
    return
  }

  container.innerHTML = ''

  render(
    h(BoardGameApp, {}),
    container
  )
}

window.onload = () => {
  initBoardGame()
}
