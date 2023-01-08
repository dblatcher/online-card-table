import { Socket } from 'socket.io-client'
import { Pile } from '../card-game/pile'
import { SocketedTableApp } from './SocketedTableApp'

import { MessageBox } from '../MessageBox'
import { h, render } from 'preact'

export function init (socket: Socket) {
  const tableElement = document.querySelector('.table')
  if (!tableElement) {
    console.warn('NO TABLE ELEMENT')
    return
  }

  const app = new SocketedTableApp([], tableElement, socket)

  const messageBoxContainer = document.querySelector('.message-box')
  const url = new URL(window.location.href)
  const roomName = url.pathname.split('/')[3]
  if (messageBoxContainer) {
    render(
      h(MessageBox, { socket, roomName }),
      messageBoxContainer
    )
  }

  const newDeckButton = document.querySelector('button#newDeck')
  newDeckButton?.addEventListener('click', () => {
    app.resetTo([
      Pile.ofNewDeck(),
    ])
  })

  const myWindow = window as any
  myWindow.app = app
}
