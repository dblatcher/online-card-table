import { SerialisedPile } from './cardAndPile'

interface Player {
  id: string
  name?: string
}

interface RoomState {
  table: SerialisedPile[]
  players: Player[]
}

export type {
  Player, RoomState,
}
