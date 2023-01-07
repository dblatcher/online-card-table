import '../scss/boardGame.scss'
import { h, render } from 'preact'
import { openClientSocket } from './socket/client-socket'
import { BoardGameApp } from './BoardGameApp'
import { MessageBox } from './MessageBox'

function initBoardGame() {
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

  const messageBoxContainer = document.querySelector('.message-box')
  if (messageBoxContainer) {
    const url = new URL(window.location.href)
    const roomName = url.pathname.split('/')[2]
    render(
      h(MessageBox, { socket, roomName }),
      messageBoxContainer
    )
  }
}

window.onload = () => {
  initBoardGame()
}
