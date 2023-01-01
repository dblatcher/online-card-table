/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */

import { Component, ComponentChild } from 'preact'
import { html } from 'htm/preact'
import { ServerToClientEvents, ClientToServerEvents } from 'definitions/socketEvents'
import { Socket } from 'socket.io-client'
import { Board } from './Board'
import { TabulaGame } from './TabulaGame'

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
      game: TabulaGame.initial(),
    }
    this.handleSquareClick = this.handleSquareClick.bind(this)
  }

  handleSquareClick(cellIndex: number) {
    console.log(`square ${cellIndex} clicked`, this.state.game.condition.cells[cellIndex])
  }

  public render(): ComponentChild {
    const { game } = this.state
    return html`
      <div>
        <p>hello ${this.props.text}</p>
        <${Board}
          game=${game.condition}
          squareClickHandler=${this.handleSquareClick}
        />
      </div>
    `
  }
}
