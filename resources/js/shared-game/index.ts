import { Socket } from 'socket.io-client'
import { Pile } from '../card-game/pile'
import { SocketedTableApp } from './SocketedTableApp'

export function init (socket: Socket) {
  const tableElement = document.querySelector('.table')
  if (!tableElement) {
    console.warn('NO TABLE ELEMENT')
    return
  }
  const app = new SocketedTableApp([], tableElement,socket)

  const newDeckButton = document.querySelector('button#newDeck')
  newDeckButton?.addEventListener('click', () => {
    app.resetTo([
      Pile.ofNewDeck(),
    ])
    app.reportState()
  })

  const myWindow = window as any
  myWindow.app = app
}
