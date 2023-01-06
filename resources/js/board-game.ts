import '../scss/boardGame.scss'
import { h, render } from 'preact'
import { openClientSocket } from './socket/client-socket'
import { BoardGameApp } from './BoardGameApp'

function initBoardGame () {
  const container = document.querySelector('#app-container')
  const socket = openClientSocket(true)
  if (!container) {
    return
  }

  container.innerHTML = ''

  render(
    h(BoardGameApp, { socket }),
    container
  )
}

window.onload = () => {
  initBoardGame()
}
