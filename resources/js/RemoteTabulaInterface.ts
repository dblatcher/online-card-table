import { ServerToClientEvents, ClientToServerEvents } from 'definitions/socketEvents'
import { Socket } from 'socket.io-client'
import {
  TabulaInterface,
  ConditionAndLogPayload,
  MoveRequestPayload,
  NewTurnRequestPayload,
  ConditionAndLogRequestPayload,
  ErrorPayload,
  ResetGameRequest,
} from '../../definitions/tabula/TabulaService'

export class RemoteTabulaInterface extends TabulaInterface {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>

  constructor (socket: Socket<ServerToClientEvents, ClientToServerEvents>) {
    super()
    this.socket = socket
  }

  public async requestConditionAndLog (request: ConditionAndLogRequestPayload) {
    const response = await new Promise<ConditionAndLogPayload | ErrorPayload>((resolve) => {
      this.socket.emit('conditionAndLogRequest', request, (response) => {
        return resolve(response)
      })
    })
    return response
  }

  public async requestMove (request: MoveRequestPayload) {
    const response = await new Promise<ConditionAndLogPayload | ErrorPayload>((resolve) => {
      this.socket.emit('moveRequest', request, (response) => {
        return resolve(response)
      })
    })
    return response
  }

  public async requestNewTurn (request: NewTurnRequestPayload) {
    const response = await new Promise<ConditionAndLogPayload | ErrorPayload>((resolve) => {
      this.socket.emit('newTurnRequest', request, (response) => {
        return resolve(response)
      })
    })

    return response
  }

  public async requestResetGame(request: ResetGameRequest): Promise<ConditionAndLogPayload | ErrorPayload> {
    const response = await new Promise<ConditionAndLogPayload | ErrorPayload>((resolve) => {
      this.socket.emit('resetGameRequest', request, (response) => {
        return resolve(response)
      })
    })

    return response
  }
}
