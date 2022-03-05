import { SerialisedPile } from './cardAndPile'

interface Player {
  id: string
  socketId: string
  name?: string
}

type ClientSafePlayer =(Partial<Player> & {id:string, socketId:undefined})

interface RoomState {
  name: string
  table: SerialisedPile[]
  players: Player[]
}

export type {
  Player, RoomState, ClientSafePlayer,
}
