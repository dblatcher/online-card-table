import { Player } from 'definitions/RoomState'
import { TabulaGame } from './TabulaGame'

interface RoomState {
  name: string
  game: TabulaGame
  players: Player[]
}

export type {
  RoomState,
}
