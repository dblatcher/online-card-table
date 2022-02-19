import { Socket } from 'socket.io-client'
import { initialPiles } from './setUp'
import { SocketedTableApp } from './SocketedTableApp'

export function init (socket: Socket) {
  const tableElement = document.querySelector('.table')
  if (!tableElement) {
    console.warn('NO TABLE ELEMENT')
    return
  }
  const app = new SocketedTableApp(initialPiles, tableElement,socket)

  const myWindow = window as any
  myWindow.app = app
}
