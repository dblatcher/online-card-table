import { SerialisedPile } from './cardAndPile'
import { Player, ClientSafePlayer } from './types'

interface RoomState {
  name: string
  table: SerialisedPile[]
  players: Player[]
}

export type {
  Player, RoomState, ClientSafePlayer,
}
