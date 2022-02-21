import { SerialisedPile } from "../../resources/js/card-game/pile"

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
