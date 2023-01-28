import '../scss/boardGame.scss'
import { h, render } from 'preact'
import { openClientSocket } from './socket/client-socket'
import { BoardGameApp } from './BoardGameApp'

function initBoardGame () {
  const container = document.querySelector('#app-container')
  const socket = openClientSocket(true)
  const url = new URL(window.location.href)
  const roomName = url.pathname.split('/')[3]
  if (!container) {
    return
  }

  container.innerHTML = ''

  render(
    h(BoardGameApp, { socket, roomName }),
    container
  )
}

window.onload = () => {
  initBoardGame()
}
