/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */

import { Component, ComponentChild } from 'preact'
import { html } from 'htm/preact'
import { ServerToClientEvents, ClientToServerEvents } from 'definitions/socketEvents'
import { Socket } from 'socket.io-client'
import { Board } from './Board'
import { TabulaGame } from './TabulaGame'
import { DieButton } from './DieButton'
import { DieRoll, PlayerColor, TabulaCondition } from './types'
import { d6 } from './diceService'

interface Props {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>
}

interface State {
  condition: TabulaCondition
  selectedDieIndex?: number
}

export class BoardGameApp extends Component<Props, State> {
  tabula: TabulaGame
  constructor(props: Props) {
    super(props)

    const game = TabulaGame.testState()
    this.tabula = game
    this.state = {
      condition: game.condition,
      selectedDieIndex: 0,
    }
    this.handleSquareClick = this.handleSquareClick.bind(this)
    this.handleDieClick = this.handleDieClick.bind(this)
    this.handleSpecialClick = this.handleSpecialClick.bind(this)
    this.rollDice = this.rollDice.bind(this)
  }

  updateConditionState() {
    this.setState({
      condition: this.tabula.condition,
      selectedDieIndex: this.tabula.condition.dice.length > 0 ? 0 : undefined,
    })
  }

  handleSquareClick(cellIndex: number) {
    const { selectedDieIndex } = this.state
    if (typeof selectedDieIndex === 'number') {
      this.tabula.attemptMoveFromSquare(selectedDieIndex, cellIndex)
      this.updateConditionState()
    }
  }

  handleSpecialClick(player: PlayerColor, zone: 'jail' | 'start') {
    const { selectedDieIndex } = this.state
    if (player !== this.tabula.condition.currentPlayer || typeof selectedDieIndex === 'undefined') {
      return
    }
    switch (zone) {
      case 'jail':
        this.tabula.attemptMoveFromJail(selectedDieIndex)
        break
      case 'start':
        this.tabula.attemptMoveFromStart(selectedDieIndex)
        break
    }
    this.updateConditionState()
  }

  rollDice() {
    const roll: [DieRoll, DieRoll] = [d6(), d6()]
    this.tabula.newTurn(roll)
    this.updateConditionState()
  }

  handleDieClick(dieIndex: number) {
    this.setState({ selectedDieIndex: dieIndex })
  }

  get message(): string {
    const { currentPlayer, dice } = this.state.condition
    const { otherPlayer } = this.tabula

    if (dice.length === 0) {
      return `${otherPlayer} to roll dice`
    }

    return `${currentPlayer} to move`
  }

  public render(): ComponentChild {
    const { condition } = this.state
    return html`
      <div>
        <p>${this.message}</p>

        <section>
          ${condition.dice.length === 0 && html`
          <button onClick=${this.rollDice}>roll</buttonl>
          `}
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
          specialClickHandler=${this.handleSpecialClick}
        />
      </div>
    `
  }
}
