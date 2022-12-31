/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */

import { Component, ComponentChild } from 'preact'
import { html } from 'htm/preact'
import { ServerToClientEvents, ClientToServerEvents } from 'definitions/socketEvents'
import { Socket } from 'socket.io-client'

interface Props {
  text: string
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>
}

export class BoardGameApp extends Component<Props> {
  constructor(props:Props) {
    super((props))
  }

  public render(): ComponentChild {
    return html`
      <div>
        <p>hello ${this.props.text}</p>
      </div>
    `
  }
}
