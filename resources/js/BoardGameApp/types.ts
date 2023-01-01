export type PlayerColor = 'BLUE' | 'GREEN'

export type Cell = {
  stones: number
  color?: PlayerColor
}

export type DieRoll = 1 | 2 | 3 | 4 | 5 | 6

export type TabulaCondition = {
  cells: Cell[],
  turnOf: PlayerColor,
  dice: DieRoll[],
  start: Record<PlayerColor, number>,
  jail: Record<PlayerColor, number>,
  home: Record<PlayerColor, number>,
}
