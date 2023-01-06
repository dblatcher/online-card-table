import { SerialisedPile } from './cardAndPile'
import { TabulaGame } from './tabula/TabulaGame'
import { Player, ClientSafePlayer } from './types'

interface BaseRoomState {
  name: string
  players: Player[]
}

export type CardRoomState = BaseRoomState & {
  table: SerialisedPile[]
}

export type TabulaRoomState = BaseRoomState & {
  game: TabulaGame
}

export type {
  Player, ClientSafePlayer,
}
