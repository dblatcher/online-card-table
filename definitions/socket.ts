import { SerialisedPile } from 'resources/js/card-game/pile'

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (payload: { message: string }) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  basicEmit: (payload: { message: string }) => void;
  tableStatus: (payload: {
    data: SerialisedPile[]
  }) => void
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

export type {
  ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData,
}
