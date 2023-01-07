import { SerialisedPile } from './cardAndPile'
import { TabulaGame } from './tabula/TabulaGame'
import { Player } from './types'

interface BaseRoomState {
  name: string
  players: Player[]
}

export type CardRoomState = BaseRoomState & {
  table: SerialisedPile[]
  type: 'Card'
}

export type TabulaRoomState = BaseRoomState & {
  game: TabulaGame
  type: 'Tabula'
}

export type RoomState = TabulaRoomState | CardRoomState
