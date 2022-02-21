import { SerialisedPile } from 'resources/js/card-game/pile'

interface TableStatusPayload {
  data: SerialisedPile[]
  from: string
}

interface BasicEmitPayload {
  message: string
  from?: string
}

interface LogInPayload {
  name?: string
  roomName?: string
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (payload: BasicEmitPayload) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  tableStatus: (payload: TableStatusPayload) => void
  assignId: (payload: { id: string }) => void
}

interface ClientToServerEvents {
  hello: () => void;
  basicEmit: (payload: BasicEmitPayload) => void
  tableStatus: (payload: TableStatusPayload) => void
  logIn: (payload: LogInPayload) => void
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

export type {
  ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData, TableStatusPayload,
}
