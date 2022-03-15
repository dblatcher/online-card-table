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

interface DropOnTableAction {
  type: 'dropOnTable',
  sourceCardIndex?: number,
  sourcePileIndex?: number,
  tableX: number, tableY: number,
  altKey: boolean
}

interface DropOnPileAction {
  type: 'dropOnPile',
  sourceCardIndex?: number,
  sourcePileIndex: number,
  targetCardIndex?: number,
  targetPileIndex: number,
}

type TableAction = ShuffleAction | TurnOverPileAction |
ResetAction | SpreadOrCollectPileAction | DropOnTableAction | DropOnPileAction

export {
  Card, SerialisedCard, Pile, SerialisedPile,
  TableAction,
  ShuffleAction, ResetAction,
}
