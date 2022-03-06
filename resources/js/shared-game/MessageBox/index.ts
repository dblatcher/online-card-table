/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { Component, Attributes, ComponentChild, ComponentChildren, createRef, RefObject } from 'preact'
import { html } from 'htm/preact'
import {
  ServerToClientEvents, ClientToServerEvents, BasicEmitPayload, AssignIdPayload, PlayerListPayload,
} from 'definitions/socketEvents'
import { Socket } from 'socket.io-client'
import MessagePost from './MessagePost'
import InputControl from './InputControl'
import { ClientSafePlayer } from 'definitions/RoomState'
import PlayerListBox from './PlayerListBox'

export class MessageBox extends Component {
  props: Readonly<Attributes & {
    children?: ComponentChildren;
    socket: Socket<ServerToClientEvents, ClientToServerEvents>
  }>

  state: {
    roomName?: string
    you?: ClientSafePlayer
    messages: BasicEmitPayload[]
    players: ClientSafePlayer[]
    inputValue: string
  }
  messageBoxRef: RefObject<HTMLElement>

  constructor(props) {
    super(props)
    this.state = {
      roomName: undefined,
      you: undefined,
      messages: [],
      players:[],
      inputValue: 'initial',
    }
    this.messageBoxRef = createRef()
    this.handleBasicEmit = this.handleBasicEmit.bind(this)
    this.handleAssignId = this.handleAssignId.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.handlePlayerList = this.handlePlayerList.bind(this)
  }

  componentDidMount() {
    const { socket } = this.props
    socket.on('basicEmit', this.handleBasicEmit)
    socket.on('assignId', this.handleAssignId)
    socket.on('playerList', this.handlePlayerList)
  }

  sendMessage() {
    const { socket } = this.props
    const { you, roomName, inputValue } = this.state
    if (!you || !roomName) {
      return
    }

    const payload = {
      message: inputValue,
      from: you.id,
      roomName: roomName,
    }

    socket.emit('basicEmit', payload)
    this.addMessage(payload)
    this.setState({ inputValue: '' })
  }

  handleAssignId(payload: AssignIdPayload): void {
    console.log('handleAssignId', payload)
    this.setState({
      roomName: payload.roomName,
      you: {...payload.player},
    })
  }

  addMessage(payload: BasicEmitPayload) {
    this.setState((state: MessageBox['state']) => {
      return {
        messages: [...state.messages, payload],
      }
    }, () => {
      const { current: messageBoxElement } = this.messageBoxRef
      messageBoxElement?.scrollTo(0, messageBoxElement.scrollHeight)
    })
  }

  handleBasicEmit(payload: BasicEmitPayload) {
    this.addMessage(payload)
  }

  handlePlayerList(payload: PlayerListPayload) {
    const {players,roomName} = payload

    if (!this.state.roomName || roomName === this.state.roomName) {
      this.setState({players})
    }
  }

  render(): ComponentChild {
    const { roomName, you, messages, inputValue, players } = this.state

    const signInText = you ? you.name || you.id : 'NOT SIGNED IN'

    return html`
    <div>
      <h2>Messages</h2>
      <p>You are ${signInText}, roomname: ${roomName}</p>
      <${PlayerListBox} players=${players} />
      <div class="message-box__inner" ref=${this.messageBoxRef}>
        ${messages.map(message => html`<${MessagePost} message=${message} players=${players}/>`)}
      </div>
      <${InputControl}
        send=${this.sendMessage}
        value=${inputValue}
        update=${(inputValue: string) => this.setState({ inputValue })}/>
    </div>`
  }
}
