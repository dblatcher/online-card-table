import { SerialisedPile } from './cardAndPile'

interface Player {
  id: string
  name?: string
}

interface SharedGameState {
  table: SerialisedPile[]
  players: Player[]
}

export type {
  Player, SharedGameState,
}
