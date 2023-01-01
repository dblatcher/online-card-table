/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */

import { Component, ComponentChild } from 'preact'
import { html } from 'htm/preact'
import { ServerToClientEvents, ClientToServerEvents } from 'definitions/socketEvents'
import { Socket } from 'socket.io-client'
import { Board } from './Board'
import { TabulaGame } from './TabulaGame'
import { DieButton } from './DieButton'

interface Props {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>
}

interface State {
  game: TabulaGame
  selectedDieIndex?: number
}

export class BoardGameApp extends Component<Props, State> {
  constructor(props: Props) {
    super((props))

    const game = TabulaGame.initial()
    game.setDice([4, 4])

    this.state = {
      game,
      selectedDieIndex: 0,
    }
    this.handleSquareClick = this.handleSquareClick.bind(this)
    this.handleDieClick = this.handleDieClick.bind(this)
  }

  handleSquareClick(cellIndex: number) {
    console.log(`square ${cellIndex} clicked`, this.state.game.condition.cells[cellIndex])
  }
  handleDieClick(dieIndex: number) {
    console.log(`die ${dieIndex} clicked`, this.state.game.condition.dice[dieIndex])
    this.setState({ selectedDieIndex: dieIndex })
  }

  public render(): ComponentChild {
    const { condition } = this.state.game
    return html`
      <div>
        <p>${condition.turnOf}'s turn</p>

        <section>
          ${condition.dice.map((die, index) => html`
            <${DieButton}
              value=${die}
              dieIndex=${index}
              clickHandler=${this.handleDieClick}
              isSelected=${index === this.state.selectedDieIndex}/>
          `)}
        </section>

        <${Board}
          game=${condition}
          squareClickHandler=${this.handleSquareClick}
        />
      </div>
    `
  }
}
