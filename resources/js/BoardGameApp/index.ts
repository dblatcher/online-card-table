/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */

import { Component, ComponentChild } from 'preact'
import { html } from 'htm/preact'
import { ServerToClientEvents, ClientToServerEvents } from 'definitions/socketEvents'
import { Socket } from 'socket.io-client'
import { TabulaGame } from './types'
import { Board } from './Board'

interface Props {
  text: string
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>
}

interface State {
  game: TabulaGame
}

export class BoardGameApp extends Component<Props, State> {
  constructor(props: Props) {
    super((props))
    this.state = {
      game: {
        cells: [
          { stones: 0 },
          { stones: 0 },
          { stones: 2, color: 'BLUE' },
          { stones: 0 },
          { stones: 4, color: 'GREEN' },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
          { stones: 0 },
        ],
      },
    }
  }

  public render(): ComponentChild {
    const { game } = this.state
    return html`
      <div>
        <p>hello ${this.props.text}</p>
        <${Board} game=${game}/>
      </div>
    `
  }
}
