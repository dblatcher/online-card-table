export type PlayerColor = 'BLUE' | 'GREEN'

export type Cell = {
  stones: number
  color?: PlayerColor
}

export type TabulaCondition = {
  cells: Cell[],
  turnOf: PlayerColor,
}
