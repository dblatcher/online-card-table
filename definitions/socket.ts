import { SerialisedPile } from 'resources/js/card-game/pile'

interface TableStatusPayload {
  data: SerialisedPile[]
  from: string
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (payload: { message: string }) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  tableStatus: (payload:TableStatusPayload) => void
}

interface ClientToServerEvents {
  hello: () => void;
  basicEmit: (payload: { message: string }) => void;
  tableStatus: (payload:TableStatusPayload) => void
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
