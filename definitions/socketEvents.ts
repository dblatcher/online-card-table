import { SerialisedPile, TableAction } from './cardAndPile'
import {
  MoveRequestPayload, NewTurnRequestPayload, ConditionAndLogPayload, ConditionAndLogRequestPayload, ErrorPayload, ResetGameRequest,
} from './tabula/TabulaService'
import { ClientSafePlayer } from './types'

interface TableStatusPayload {
  data: SerialisedPile[]
  from: string
  roomName: string
  action?: TableAction
}

interface BasicEmitPayload {
  message: string
  from?: string
  roomName?: string
}

interface LogInPayload {
  name?: string
  roomName?: string
  roomType?: string
}

interface AssignIdPayload {
  player: ClientSafePlayer
  roomName: string
}

interface PlayerListPayload {
  roomName: string
  players: ClientSafePlayer[]
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (payload: BasicEmitPayload) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  tableStatus: (payload: TableStatusPayload) => void
  assignId: (payload: AssignIdPayload) => void
  playerList: (payload: PlayerListPayload) => void

  conditionAndLog: (payload: ConditionAndLogPayload) => void
}

interface ClientToServerEvents {
  hello: () => void;
  basicEmit: (payload: BasicEmitPayload) => void
  tableStatus: (payload: TableStatusPayload) => void
  logIn: (payload: LogInPayload) => void

  conditionAndLogRequest: (
    payload: ConditionAndLogRequestPayload,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => void
  moveRequest: (
    payload: MoveRequestPayload,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => void
  newTurnRequest: (
    payload: NewTurnRequestPayload,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => void
  resetGameRequest: (
    payload: ResetGameRequest,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => void
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

export type {
  ServerToClientEvents, ClientToServerEvents, InterServerEvents,
  SocketData, TableStatusPayload, AssignIdPayload, LogInPayload, PlayerListPayload,
  BasicEmitPayload,
}
