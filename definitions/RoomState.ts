import { SerialisedPile } from './cardAndPile'

interface Player {
  id: string
  socketId: string
  name?: string
}

interface RoomState {
  name: string
  table: SerialisedPile[]
  players: Player[]
}

export type {
  Player, RoomState,
}
