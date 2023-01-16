/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { Component, ComponentChild } from 'preact'
import { html } from 'htm/preact'
import { ServerToClientEvents, ClientToServerEvents, AssignIdPayload } from 'definitions/socketEvents'
import { Socket } from 'socket.io-client'
import { Board } from './Board'
import { DieButton } from './DieButton'
import { DieRoll, PlayerColor, TabulaCondition, GameEvent, AvaliableMove } from '../../../definitions/tabula/types'
import { d6 } from './diceService'
import { EventList } from './EventList'
import { ConditionAndLogPayload, ErrorPayload, TabulaInterface } from '../../../definitions/tabula/TabulaService'
import { localTabulaService } from '../localTabulaInterface'
import { RemoteTabulaInterface } from '../RemoteTabulaInterface'
import { TabulaGame } from '../../../definitions/tabula/TabulaGame'

interface Props {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>
  roomName?: string
}

interface State {
  condition?: TabulaCondition
  events: GameEvent[]
  selectedDieIndex?: number
}

export class BoardGameApp extends Component<Props, State> {
  tabulaService: TabulaInterface
  id?: string
  role?: string

  constructor(props: Props) {
    super(props)

    this.tabulaService = props.socket ? new RemoteTabulaInterface(props.socket) : localTabulaService

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

    props.socket?.on('conditionAndLog', this.handleServiceResponse)
    props.socket?.on('assignId', this.handleAssignId.bind(this))
  }

  async componentDidMount() {
    await this.tabulaService.requestConditionAndLog({ roomName: this.props.roomName, from: this.id })
      .then(this.handleServiceResponse)
  }

  public handleAssignId(payload: AssignIdPayload): void {
    console.log('handleAssignId', payload)
    this.id = payload.player.id
    this.role = payload.player.role
    this.forceUpdate()
  }

  handleServiceResponse(response: ConditionAndLogPayload | ErrorPayload) {
    if ('errorMessage' in response) {
      console.error(response)
      return
    }
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
    await this.tabulaService.requestMove({
      roomName: this.props.roomName,
      from: this.id,
      dieIndex: selectedDieIndex,
      squareOrZone: cellIndex,
    })
      .then(this.handleServiceResponse)
  }

  async handleSpecialClick(player: PlayerColor, zone: 'jail' | 'start') {
    const { selectedDieIndex, condition } = this.state
    if (player !== condition?.currentPlayer || typeof selectedDieIndex === 'undefined') {
      return
    }

    await this.tabulaService.requestMove({
      roomName: this.props.roomName,
      from: this.id,
      dieIndex: selectedDieIndex,
      squareOrZone: zone,
    })
      .then(this.handleServiceResponse)
  }

  async rollDice() {
    const roll: [DieRoll, DieRoll] = [d6(), d6()]
    await this.tabulaService.requestNewTurn({
      roomName: this.props.roomName,
      from: this.id,
      dice: roll,
    })
      .then(this.handleServiceResponse)
  }

  handleDieClick(dieIndex: number) {
    this.setState({ selectedDieIndex: dieIndex })
  }

  get needsToLogIn(): boolean {
    return (this.props.socket && !this.id) || false
  }

  getMessage(availableMoves: AvaliableMove[], winner: PlayerColor | undefined): string {
    const { condition } = this.state
    if (!condition) {
      return 'LOADING...'
    }

    if (this.needsToLogIn) {
      return 'You must sign in to play.'
    }
    const { currentPlayer, dice } = condition

    if (winner) {
      return `${winner} has won the game!`
    }

    if (dice.length === 0) {
      return `${currentPlayer} turn over. Next player to roll dice`
    }

    if (availableMoves.length === 0) {
      return `${currentPlayer} cannot move. Next player to roll dice`
    }

    return `${currentPlayer} to move`
  }

  get availableMoves(): AvaliableMove[] {
    const { condition } = this.state
    return condition ? TabulaGame.findAvailableMovesForCondition(condition) : []
  }

  get winner(): PlayerColor | undefined {
    const { condition } = this.state
    return condition ? TabulaGame.findWinnerForCondition(condition) : undefined
  }

  public render(): ComponentChild {
    const { condition, events } = this.state
    const { availableMoves, needsToLogIn, winner } = this
    const showRollButton = !!condition && (availableMoves.length === 0 || condition.dice.length === 0)

    const message = this.getMessage(availableMoves, winner)

    // TO DO - waiting screen?
    if (!condition) {
      return html`
      <div>
        <p>${message}</p>
      </div>
      `
    }

    return html`
      <div>
        <p>${message}</p>

        ${!winner && !needsToLogIn && html`
            <p>
              <span>${availableMoves.length} available moves.</span>
              <span>YOU ARE: ${this.role}</span>
            </p>
          `}

        <div style=${{ display: 'flex' }}>
          <${Board}
            game=${condition}
            squareClickHandler=${this.handleSquareClick}
            specialClickHandler=${this.handleSpecialClick}
          >

          ${!winner && !needsToLogIn && html`
            <section>
              ${condition.dice.map((die, index) => html`
              <${DieButton}
              value=${die}
                    dieIndex=${index}
                    clickHandler=${this.handleDieClick}
                    isSelected=${index === this.state.selectedDieIndex}/>
                    `)}
                ${showRollButton && html`
                <button onClick=${this.rollDice}>roll</buttonl>
                `}
            </section>
          `}

          </board>

          <${EventList} events=${events} />

        </div>
      </div>
    `
  }
}
