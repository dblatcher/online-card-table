import { Socket } from 'socket.io-client'
import { Pile } from '../card-game/pile'
import { MessageBox } from './MessageBox'
import { SocketedTableApp } from './SocketedTableApp'

export function init (socket: Socket) {
  const tableElement = document.querySelector('.table')
  if (!tableElement) {
    console.warn('NO TABLE ELEMENT')
    return
  }

  const app = new SocketedTableApp([], tableElement, socket, {
    playerList: document.querySelector('div.playerList') || undefined,
  })

  let messageBox
  const messageBoxContainer = document.querySelector('.message-box')
  console.log({messageBoxContainer})
  if (messageBoxContainer) {
    messageBox = new MessageBox(messageBoxContainer, socket)
  }

  const newDeckButton = document.querySelector('button#newDeck')
  newDeckButton?.addEventListener('click', () => {
    app.resetTo([
      Pile.ofNewDeck(),
    ])
    app.reportState()
  })

  const myWindow = window as any
  myWindow.app = app
  myWindow.messageBox = messageBox
}
