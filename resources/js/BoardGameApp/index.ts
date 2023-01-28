/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { Component, ComponentChild, Fragment } from 'preact'
import { html } from 'htm/preact'
import {
  ServerToClientEvents, ClientToServerEvents, AssignIdPayload, PlayerListPayload, BasicEmitPayload,
} from 'definitions/socketEvents'
import { Socket } from 'socket.io-client'
import { Board } from './Board'
import {
  DieRoll, PlayerColor, TabulaCondition, GameEvent, AvaliableMove, ButtonValue
} from '../../../definitions/tabula/types'
import { d6 } from './diceService'
import { EventList } from './EventList'
import { ConditionAndLogPayload, ErrorPayload, TabulaInterface } from '../../../definitions/tabula/TabulaService'
import { localTabulaService } from '../localTabulaInterface'
import { RemoteTabulaInterface } from '../RemoteTabulaInterface'
import { TabulaGame } from '../../../definitions/tabula/TabulaGame'
import { ClientSafePlayer } from 'definitions/types'
import { PlayerBar } from './PlayerBar'
import { MainMessage } from './MainMessage'
import { DiceSection } from './DiceSection'
import { MenuBar } from './MenuBar'
import { ModalContainer } from '../ModalContainer'
import { LogInDialogue } from './LogInDialogue'

interface Props {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>
  roomName?: string
}

interface State {
  condition?: TabulaCondition
  events: GameEvent[]
  selectedDieIndex?: number
  players: Record<PlayerColor, ClientSafePlayer | undefined>
  hoveredOn?: ButtonValue
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
    this.handleBasicEmit = this.handleBasicEmit.bind(this)
    this.handlePlayerList = this.handlePlayerList.bind(this)
    this.updateHoveredButton = this.updateHoveredButton.bind(this)
    this.rollDice = this.rollDice.bind(this)
  }

  async componentDidMount() {
    this.props.socket?.on('conditionAndLog', this.handleServiceResponse)
    this.props.socket?.on('assignId', this.handleAssignId)
    this.props.socket?.on('playerList', this.handlePlayerList)
    this.props.socket?.on('basicEmit', this.handleBasicEmit)

    await this.tabulaService.requestConditionAndLog({ roomName: this.props.roomName, from: this.id })
      .then(this.handleServiceResponse)
  }

  componentWillUnmount(): void {
    this.props.socket?.off('conditionAndLog', this.handleServiceResponse)
    this.props.socket?.off('assignId', this.handleAssignId)
    this.props.socket?.off('playerList', this.handlePlayerList)
    this.props.socket?.off('basicEmit', this.handleBasicEmit)
  }

  handleAssignId(payload: AssignIdPayload): void {
    this.id = payload.player.id
    this.role = payload.player.role
    this.forceUpdate()
  }

  handleBasicEmit(payload: BasicEmitPayload):void {
    this.setState(state => {
      const {events} = state
      events.push({
        message:`${payload.from}: ${payload.message}`,
      })
      return {events}
    })
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
    const events = isLogUpdate ? [...this.state.events, ...log] : [...log]

    return this.setState({
      condition: { ...condition },
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

  updateHoveredButton(button: ButtonValue, eventType: 'enter' | 'leave') {
    const { hoveredOn } = this.state
    if (button === hoveredOn && eventType === 'leave') {
      this.setState({ hoveredOn: undefined })
    } else if (eventType === 'enter') {
      this.setState({ hoveredOn: button })
    }
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

  get availableMoves(): AvaliableMove[] {
    const { condition } = this.state
    return condition ? TabulaGame.findAvailableMovesForCondition(condition) : []
  }

  get winner(): PlayerColor | undefined {
    const { condition } = this.state
    return condition ? TabulaGame.findWinnerForCondition(condition) : undefined
  }

  get squareToHighlight(): ButtonValue | undefined {
    const { hoveredOn, selectedDieIndex, condition } = this.state
    const dieValue = typeof selectedDieIndex === 'number' ? condition?.dice[selectedDieIndex] : undefined

    if (typeof hoveredOn === 'number' && typeof dieValue === 'number') {
      return hoveredOn + dieValue
    }
    if (typeof hoveredOn === 'string' && typeof dieValue === 'number') {
      return dieValue - 1
    }
    return undefined
  }

  public render(): ComponentChild {
    const { condition, events, players, selectedDieIndex } = this.state
    const { availableMoves, needsToLogIn, winner } = this
    const timeToRollDice = !!condition && (availableMoves.length === 0 || condition.dice.length === 0)
    const whosTurn = (!!condition && timeToRollDice) ? otherColor(condition.currentPlayer) : condition?.currentPlayer

    return html`
      <${Fragment}>

        <${ModalContainer} isOpen=${needsToLogIn}>
          <${LogInDialogue}
            socket=${this.props.socket}
            roomName=${this.props.roomName}
          />
        </${ModalContainer}>

        <${MenuBar} handleResetClick=${this.handleResetClick}/>
        <${PlayerBar}
          players=${players}
          isLocalGame=${!this.props.socket}
          whosTurn=${whosTurn}
          localPlayerRole=${this.role} />

        <${MainMessage}
          availableMoves=${availableMoves}
          winner=${winner}
          currentPlayer=${condition?.currentPlayer || 'BLUE'}
          players=${players}
          needsToLogIn=${needsToLogIn}
          noDiceLeft=${condition?.dice.length === 0}
        />

        <div style=${{ display: 'flex' }}>

        ${condition && html`
          <${Board}
            game=${condition}
            squareClickHandler=${this.handleSquareClick}
            specialClickHandler=${this.handleSpecialClick}
            highlightSquareIndex=${this.squareToHighlight}
            updateHoveredButton=${this.updateHoveredButton}
          >
          ${!winner && !needsToLogIn && html`
            <${DiceSection}
              condition=${condition}
              numberOfMoves=${availableMoves.length}
              handleDieClick=${this.handleDieClick}
              selectedDieIndex=${selectedDieIndex}
              rollDice=${this.rollDice}
            />
          `}
          </${Board}>
        `}
          <${EventList} events=${events} />

        </div>
      </${Fragment}>
    `
  }
}
