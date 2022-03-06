import { Socket } from 'socket.io-client'
import { Pile } from '../card-game/pile'
import { SocketedTableApp } from './SocketedTableApp'

import { MessageBox } from './MessageBox'
import { h, render } from 'preact'

function sendLoginRequest (socket:Socket, name?:string):void {
  const url = new URL(window.location.href)
  const roomName = url.pathname.split('/')[2]
  socket.emit('logIn', {roomName, name})
}

const names = ['Bob','John','Mary','Cline','Kwame','Mehmet','Bill','Zara','Haoching']
function pickRandomName ():string {
  return names[Math.floor(Math.random()*names.length)]
}

export function init (socket: Socket) {
  const tableElement = document.querySelector('.table')
  if (!tableElement) {
    console.warn('NO TABLE ELEMENT')
    return
  }

  const app = new SocketedTableApp([], tableElement, socket, {
    playerList: document.querySelector('div.playerList') || undefined,
  })

  const messageBoxContainer = document.querySelector('.message-box')
  if (messageBoxContainer) {
    render(
      h(MessageBox, { socket: socket }),
      messageBoxContainer
    )
  }

  const newDeckButton = document.querySelector('button#newDeck')
  newDeckButton?.addEventListener('click', () => {
    app.resetTo([
      Pile.ofNewDeck(),
    ])
    app.reportState()
  })

  sendLoginRequest(socket, pickRandomName())
  const myWindow = window as any
  myWindow.app = app
}
