/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { Component, ComponentChild } from 'preact'
import { html } from 'htm/preact'
import { ServerToClientEvents, ClientToServerEvents } from 'definitions/socketEvents'
import { Socket } from 'socket.io-client'
import { Board } from './Board'
import { DieButton } from './DieButton'
import { DieRoll, PlayerColor, TabulaCondition, GameEvent } from '../../../definitions/tabula/types'
import { d6 } from './diceService'
import { EventList } from './EventList'
import { ConditionAndLogPayload } from '../../../definitions/tabula/TabulaService'
import { localTabulaService } from '../localTabulaService'

interface Props {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>
}

interface State {
  condition?: TabulaCondition
  events: GameEvent[]
  selectedDieIndex?: number
}

export class BoardGameApp extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      condition: undefined,
      events: [],
      selectedDieIndex: 0,
    }
    this.handleSquareClick = this.handleSquareClick.bind(this)
    this.handleDieClick = this.handleDieClick.bind(this)
    this.handleSpecialClick = this.handleSpecialClick.bind(this)
    this.handleServiceResponse = this.handleServiceResponse.bind(this)
    this.rollDice = this.rollDice.bind(this)
  }

  async componentDidMount() {
    await localTabulaService.requestConditionAndLog()
      .then(this.handleServiceResponse)
  }

  handleServiceResponse(response: ConditionAndLogPayload) {
    const { condition, log } = response
    return this.setState({
      condition: condition,
      events: log,
      selectedDieIndex: condition.dice.length > 0 ? 0 : undefined,
    })
  }

  async handleSquareClick(cellIndex: number) {
    const { selectedDieIndex } = this.state
    if (typeof selectedDieIndex !== 'number') {
      return
    }
    await localTabulaService.requestMove({ dieIndex: selectedDieIndex, squareOrZone: cellIndex })
      .then(this.handleServiceResponse)
  }

  async handleSpecialClick(player: PlayerColor, zone: 'jail' | 'start') {
    const { selectedDieIndex, condition } = this.state
    if (player !== condition?.currentPlayer || typeof selectedDieIndex === 'undefined') {
      return
    }

    await localTabulaService.requestMove({ dieIndex: selectedDieIndex, squareOrZone: zone })
      .then(this.handleServiceResponse)
  }

  async rollDice() {
    const roll: [DieRoll, DieRoll] = [d6(), d6()]
    await localTabulaService.requestNewTurn({ dice: roll })
      .then(this.handleServiceResponse)
  }

  handleDieClick(dieIndex: number) {
    this.setState({ selectedDieIndex: dieIndex })
  }

  get message(): string {
    const { condition } = this.state
    if (!condition) {
      return 'LOADING...'
    }
    const { currentPlayer, dice } = condition

    if (dice.length === 0) {
      return `${currentPlayer} turn over. Next player to roll dice`
    }

    return `${currentPlayer} to move`
  }

  public render(): ComponentChild {
    const { condition, events } = this.state

    // TO DO - waiting screen?
    if (!condition) {
      return html`
      <div>
        <p>${this.message}</p>
      </div>
      `
    }

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

        <div style=${{ display: 'flex' }}>

          <${Board}
            game=${condition}
            squareClickHandler=${this.handleSquareClick}
            specialClickHandler=${this.handleSpecialClick}
          />

          <${EventList} events=${events} />

        </div>
      </div>
    `
  }
}
