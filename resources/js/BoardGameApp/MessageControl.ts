/* eslint-disable brace-style */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  ServerToClientEvents, ClientToServerEvents,
} from 'definitions/socketEvents'
import { css } from '@emotion/css'
import { html } from 'htm/preact'
import { Component } from 'preact'
import { Socket } from 'socket.io-client'
import InputControl from '../MessageBox/InputControl'
import { GameEvent } from 'definitions/tabula/types'

interface Props {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>
  roomName?: string
  playerId?: string
  addToOwnEvents: { (event: GameEvent): void }
}

interface State {
  message: string
}

const dialogueStyle = css`
  margin: 0 1rem;
`

export class MessageControl extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
    }
    this.postMessage = this.postMessage.bind(this)
  }

  postMessage() {
    const { socket, roomName, playerId, addToOwnEvents } = this.props
    const { message } = this.state
    if (!message) { return }
    socket?.emit('basicEmit', { roomName, message, from: playerId })
    addToOwnEvents({ message: `ME: ${message}` })
    this.setState({ message: '' })
  }

  render() {
    const { message } = this.state
    return html`
      <aside class=${dialogueStyle}>
        <${InputControl}
          buttonText="Send"
          send=${this.postMessage}
          update=${(message) => { this.setState({ message }) }}
          value=${message}
        />
      </aside>
    `
  }
}
