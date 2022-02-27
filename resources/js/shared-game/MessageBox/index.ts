import {
  ServerToClientEvents, ClientToServerEvents, BasicEmitPayload, AssignIdPayload,
} from 'definitions/socketEvents'
import { Socket } from 'socket.io-client'

import { addInitialChildren, addMessage } from './elements'

export class MessageBox {
  public id?: string
  public roomName?:string
  public containerElement: Element
  public messagesElement: Element
  public inputElement: HTMLInputElement
  public sendButton: Element
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>

  constructor (
    containerElement: Element,
    socket: Socket<ServerToClientEvents, ClientToServerEvents>
  ) {
    this.containerElement = containerElement
    this.socket = socket

    const [messagesElement, inputElement, sendButton] = addInitialChildren(this.containerElement)
    this.messagesElement = messagesElement
    this.inputElement = inputElement
    this.sendButton = sendButton
    this.socket.on('basicEmit', this.handleBasicEmit.bind(this))
    this.socket.on('assignId', this.handleAssignId.bind(this))

    this.sendButton.addEventListener('click', this.sendMessage.bind(this))
  }

  public sendMessage () {
    if (!this.id || !this.roomName) {
      return
    }

    const payload = {message:this.inputElement.value, from:this.id, roomName:this.roomName}

    this.socket.emit('basicEmit', payload)
    addMessage(this.messagesElement, payload, true)
    this.inputElement.value=''
  }

  public handleAssignId (payload: AssignIdPayload): void {
    console.log('handleAssignId', payload)
    this.roomName = payload.roomName
    this.id = payload.id
  }

  public handleBasicEmit (payload: BasicEmitPayload) {
    addMessage(this.messagesElement, payload)
  }
}
