/* eslint-disable brace-style */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  ServerToClientEvents, ClientToServerEvents,
} from 'definitions/socketEvents'
import { css } from '@emotion/css'
import { html } from 'htm/preact'
import { Fragment, Component } from 'preact'
import { Socket } from 'socket.io-client'
import InputControl from '../MessageBox/InputControl'

interface Props {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>
  roomName?: string
}

interface State {
  name: string
}

const dialogueStyle = css`
  padding: 1rem;
`

export class LogInDialogue extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
    }
    this.logIn = this.logIn.bind(this)
  }

  logIn () {
    const { socket, roomName } = this.props
    const { name } = this.state
    socket?.emit('logIn', { roomName, roomType: 'tabula', name })
  }

  render () {
    const {name} = this.state
    return html`
    <${Fragment}>
      <article class=${dialogueStyle}>
        <p>please choose a name</p>

        <${InputControl}
          buttonText="log in"
          send=${this.logIn}
          update=${(name) => {this.setState({name})}}
          value=${name}
        />

      </article>
    </${Fragment}>
    `
  }
}
