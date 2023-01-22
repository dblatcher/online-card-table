/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { Component, ComponentChild } from 'preact'
import { html } from 'htm/preact'
import {
  ServerToClientEvents, ClientToServerEvents, AssignIdPayload, PlayerListPayload,
} from 'definitions/socketEvents'
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
import { ClientSafePlayer } from 'definitions/types'
import { PlayerBar } from './PlayerBar'

interface Props {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>
  roomName?: string
}

interface State {
  condition?: TabulaCondition
  events: GameEvent[]
  selectedDieIndex?: number
  players: Record<PlayerColor, ClientSafePlayer | undefined>
}

const otherColor = (color: PlayerColor): PlayerColor => color === 'BLUE' ? 'GREEN' : 'BLUE'

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
      players: {
        'BLUE': undefined,
        'GREEN': undefined,
      },
    }
    this.handleSquareClick = this.handleSquareClick.bind(this)
    this.handleDieClick = this.handleDieClick.bind(this)
    this.handleSpecialClick = this.handleSpecialClick.bind(this)
    this.handleResetClick = this.handleResetClick.bind(this)
    this.handleServiceResponse = this.handleServiceResponse.bind(this)
    this.handleAssignId = this.handleAssignId.bind(this)
    this.handlePlayerList = this.handlePlayerList.bind(this)
    this.rollDice = this.rollDice.bind(this)
  }

  async componentDidMount() {
    this.props.socket?.on('conditionAndLog', this.handleServiceResponse)
    this.props.socket?.on('assignId', this.handleAssignId)
    this.props.socket?.on('playerList', this.handlePlayerList)

    // TO DO - request player list on mount ?
    await this.tabulaService.requestConditionAndLog({ roomName: this.props.roomName, from: this.id })
      .then(this.handleServiceResponse)
  }

  componentWillUnmount(): void {
    this.props.socket?.off('conditionAndLog', this.handleServiceResponse)
    this.props.socket?.off('assignId', this.handleAssignId)
    this.props.socket?.off('playerList', this.handlePlayerList)
  }

  handleAssignId(payload: AssignIdPayload): void {
    console.log('handleAssignId', payload)
    this.id = payload.player.id
    this.role = payload.player.role
    this.forceUpdate()
  }

  handlePlayerList(payload: PlayerListPayload): void {
    const { players } = payload
    this.setState({
      players: {
        BLUE: players.find(player => player.role === 'BLUE'),
        GREEN: players.find(player => player.role === 'GREEN'),
      },
    })
  }

  handleServiceResponse(response: ConditionAndLogPayload | ErrorPayload) {
    if ('errorMessage' in response) {
      console.error(response)
      return
    }
    const { condition, log, isLogUpdate } = response
    const events = isLogUpdate ? [...this.state.events,...log] : [...log]

    return this.setState({
      condition: {...condition},
      events: [...events],
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

  async handleSpecialClick(zone: 'jail' | 'start') {
    const { selectedDieIndex } = this.state
    if (typeof selectedDieIndex === 'undefined') {
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

  async handleResetClick() {
    console.log('RESET')
    await this.tabulaService.requestResetGame({
      roomName: this.props.roomName,
      from: this.id,
      reset: true,
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

  getPlayerName(color: PlayerColor): string {
    return this.state.players[color]?.name || color
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
    const currentPlayerName = this.getPlayerName(currentPlayer)
    const otherPlayerName = this.getPlayerName(currentPlayer === 'BLUE' ? 'GREEN' : 'BLUE')

    if (winner) {
      return `${this.getPlayerName(winner)} has won the game!`
    }

    if (dice.length === 0) {
      return `${currentPlayerName}'s turn over. ${otherPlayerName} to roll dice`
    }

    if (availableMoves.length === 0) {
      return `${currentPlayerName} cannot move. ${otherPlayerName} to roll dice`
    }

    return `${currentPlayerName} to move`
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
    const { condition, events, players } = this.state
    const { availableMoves, needsToLogIn, winner } = this
    const timeToRollDice = !!condition && (availableMoves.length === 0 || condition.dice.length === 0)
    const whosTurn = (!!condition && timeToRollDice) ? otherColor(condition.currentPlayer) : condition?.currentPlayer

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
        <button onclick=${this.handleResetClick}>RESET GAME</button>
        <${PlayerBar}
          players=${players}
          isLocalGame=${!this.props.socket}
          whosTurn=${whosTurn}
          localPlayerRole=${this.role} />

        <span>${message}</span>
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
                ${timeToRollDice ? html`
                <button onClick=${this.rollDice}>roll</buttonl>
                `: html`
                <p>${availableMoves.length} available moves.</p>
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
