import { Card, SerialisedCard } from 'resources/js/card-game/card'
import { Pile, SerialisedPile } from 'resources/js/card-game/pile'

interface ShuffleAction {
  type: 'shufflePile',
  pileIndex: number
}

interface SpreadOrCollectPileAction {
  type: 'spreadOrCollectPile',
  pileIndex: number
}

interface TurnOverPileAction {
  type: 'turnOverPile',
  pileIndex: number
}

interface ResetAction {
  type: 'reset'
}

type TableAction = ShuffleAction | TurnOverPileAction | ResetAction | SpreadOrCollectPileAction

export {
  Card, SerialisedCard, Pile, SerialisedPile,
  TableAction,
  ShuffleAction, ResetAction,
}
