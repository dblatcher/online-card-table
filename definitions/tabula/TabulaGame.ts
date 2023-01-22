/* eslint-disable @typescript-eslint/space-before-function-paren */
import { Cell, DieRoll, GameEvent, PlayerColor, TabulaCondition, EventCategory, AvaliableMove } from './types'

const makeEmptyCell = (): Cell => ({ stones: 0 })
const makeEmptyCellRange = (count: number) => {
  const range: Cell[] = []
  for (let i = 0; i < count; i++) {
    range.push(makeEmptyCell())
  }
  return range
}

export class TabulaGame {
  private _condition: TabulaCondition
  private _log: GameEvent[]
  private _requestIndex: number

  constructor(condition: TabulaCondition) {
    this._condition = condition
    this._log = []
    this._requestIndex = 0
  }

  //TO DO - clone the object
  public get condition() {
    return this._condition
  }
  public get log() {
    return this._log
  }
  public get otherPlayer(): PlayerColor {
    return this._condition.currentPlayer === 'BLUE' ? 'GREEN' : 'BLUE'
  }

  public get availableMoves(): AvaliableMove[] {
    const moves: AvaliableMove[] = []
    const { dice, currentPlayer, cells, jail, start } = this.condition

    const uniqueDice = dice.reduce<DieRoll[]>((list, roll) => {
      if (!list.includes(roll)) {
        list.push(roll)
      }
      return list
    }, [])

    const canCastOff = start[currentPlayer] === 0 && jail[currentPlayer] === 0

    // must get stones from jail first
    if (jail[currentPlayer] > 0) {
      uniqueDice.forEach(die => {
        if (!this.isHeldByOtherPlayer(cells[die - 1])) {
          moves.push({ die, from: 'jail' })
        }
      })
      return moves
    }

    if (start[currentPlayer] > 0) {
      uniqueDice.forEach(die => {
        if (!this.isHeldByOtherPlayer(cells[die - 1])) {
          moves.push({ die, from: 'start' })
        }
      })
    }

    cells.forEach((cell, cellIndex) => {
      if (cell.color !== currentPlayer || cell.stones === 0) {
        return
      }

      uniqueDice.forEach(die => {
        if (cellIndex + die > cells.length) {
          if (canCastOff) {
            moves.push({ die, from: cellIndex })
          }
        } else {
          if (!this.isHeldByOtherPlayer(cells[die + cellIndex])) {
            moves.push({ die, from: cellIndex })
          }
        }
      })
    })

    return moves
  }

  public get winner(): PlayerColor | undefined {
    const { start, jail, cells } = this._condition
    const hasWon = (playerColor: PlayerColor): boolean => {
      if (cells.some(cell => cell.color === playerColor && cell.stones > 0)) {
        return false
      }
      if (start[playerColor] > 0 || jail[playerColor] > 0) {
        return false
      }
      return true
    }

    return hasWon('BLUE') ? 'BLUE' : hasWon('GREEN') ? 'GREEN' : undefined
  }

  public newTurn(rolls: [DieRoll, DieRoll]): GameEvent[] {
    this._requestIndex++
    this._condition.dice = rolls[0] === rolls[1]
      ? [rolls[0], rolls[0], rolls[0], rolls[0]]
      : [rolls[0], rolls[1]]

    this._condition.currentPlayer = this.otherPlayer
    const message = rolls[0] === rolls[1]
      ? `${this._condition.currentPlayer} rolled a double ${rolls[0]}`
      : `${this._condition.currentPlayer} rolled a ${rolls[0]} and a ${rolls[1]}`
    this.record(message, EventCategory.dice)
    return this._log.filter(entry => entry.requestIndex === this._requestIndex)
  }

  public attemptMove(dieIndex: number, cellIndexOrZone: number | 'jail' | 'start') {
    this._requestIndex++
    if (cellIndexOrZone === 'jail') {
      this.attemptMoveFromJail(dieIndex)
    } else if (cellIndexOrZone === 'start') {
      this.attemptMoveFromStart(dieIndex)
    } else if (typeof cellIndexOrZone === 'number') {
      this.attemptMoveFromSquare(dieIndex, cellIndexOrZone)
    }
    return this._log.filter(entry => entry.requestIndex === this._requestIndex)
  }

  private attemptMoveFromStart(dieIndex: number) {
    const { dice, cells, currentPlayer, start, jail } = this._condition
    const dieValue = dice[dieIndex]
    const targetCell = cells[dieValue - 1]
    const validTargetSqaure = targetCell && !this.isHeldByOtherPlayer(targetCell)

    if (jail[currentPlayer] > 0) {
      this.record(`${currentPlayer} must get thier pieces from jail first`, EventCategory.illegalMove)
      return
    } else if (start[currentPlayer] === 0) {
      this.record(`${currentPlayer} has no pieces to bring on`, EventCategory.illegalMove)
      return
    } else if (!validTargetSqaure) {
      this.record(`target is held by ${this.otherPlayer} `, EventCategory.illegalMove)
      return
    } else {
      this.record(`${currentPlayer} is moving a stone from start to ${dieValue} `, EventCategory.moveMade)
      dice.splice(dieIndex, 1)
      this.moveFromStartToSquare(targetCell)
    }
  }

  private attemptMoveFromJail(dieIndex: number) {
    const { dice, cells, currentPlayer, jail } = this._condition
    const dieValue = dice[dieIndex]
    const targetCell = cells[dieValue - 1]
    const validTargetSqaure = targetCell && !this.isHeldByOtherPlayer(targetCell)

    if (jail[currentPlayer] === 0) {
      this.record(`${currentPlayer} has no pieces in jail`)
      return
    } else if (!validTargetSqaure) {
      this.record(`target is held by ${this.otherPlayer} `)
      return
    } else {
      this.record(`${currentPlayer} is moving a stone from start to ${dieValue} `)
      dice.splice(dieIndex, 1)
      this.moveFromJailToSquare(targetCell)
    }
  }

  private attemptMoveFromSquare(dieIndex: number, cellIndex: number) {
    const { dice, cells, currentPlayer, jail, start } = this._condition
    const dieValue = dice[dieIndex]
    const startCell = cells[cellIndex]

    if (!dieValue || !startCell) {
      return
    }

    const wouldCastOff = dieValue + cellIndex >= cells.length
    const canCastOff = start[currentPlayer] === 0 && jail[currentPlayer] === 0
    const targetCell = cells[dieValue + cellIndex]
    const validStartSquare = startCell.color === currentPlayer && startCell.stones > 0
    const validTargetSqaure = targetCell && !this.isHeldByOtherPlayer(targetCell)

    if (jail[currentPlayer] > 0) {
      this.record(`${currentPlayer} must get thier pieces from jail first`, EventCategory.illegalMove)
      return
    }

    if (wouldCastOff) {
      if (canCastOff) {
        dice.splice(dieIndex, 1)
        this.castOffFromSquare(startCell)
        this.record(`${currentPlayer} casting off from square ${cellIndex + 1} !`, EventCategory.moveMade)
        return
      } else {
        this.record(`${currentPlayer} cannot cast off!`, EventCategory.illegalMove)
        return
      }
    }

    if (validStartSquare && validTargetSqaure) {
      dice.splice(dieIndex, 1)
      this.record(`${currentPlayer} moving ${dieValue} placed from square ${cellIndex + 1} `, EventCategory.moveMade)
      this.moveFromSquareToSquare(startCell, targetCell)
    } else if (!validStartSquare) {
      this.record(`${currentPlayer} has no stones on ${cellIndex + 1} `, EventCategory.illegalMove)
    } else if (this.isHeldByOtherPlayer(targetCell)) {
      this.record(`${currentPlayer} can't move from ${cellIndex + 1} to ${cellIndex + dieValue + 1} because is it held by ${this.otherPlayer}`, EventCategory.illegalMove)
    }
  }

  private moveFromStartToSquare(targetCell: Cell) {
    this._condition.start[this._condition.currentPlayer]--
    this.captureSingle(targetCell)
    targetCell.stones++
    targetCell.color = this._condition.currentPlayer
  }
  private moveFromJailToSquare(targetCell: Cell) {
    this._condition.jail[this._condition.currentPlayer]--
    this.captureSingle(targetCell)
    targetCell.stones++
    targetCell.color = this._condition.currentPlayer
  }
  private moveFromSquareToSquare(startCell: Cell, targetCell: Cell) {
    startCell.stones--
    this.captureSingle(targetCell)
    targetCell.stones++
    targetCell.color = this._condition.currentPlayer
  }
  private castOffFromSquare(startCell: Cell) {
    startCell.stones--
    this._condition.home[this._condition.currentPlayer]++
  }

  private captureSingle(targetCell: Cell) {
    if (targetCell.color === this.otherPlayer) {
      this._condition.jail[this.otherPlayer] += targetCell.stones
      targetCell.stones = 0
      this.record(`${this._condition.currentPlayer} captured a ${this.otherPlayer} stone.`, EventCategory.capture)
    }
  }

  private isHeldByOtherPlayer(cell?: Cell): boolean {
    if (!cell) {
      return false
    }
    return cell.color === this.otherPlayer && cell.stones >= 2
  }

  private record(message: string, category?: EventCategory): void {
    this._log.push({ message, category, requestIndex: this._requestIndex })
  }

  public static findAvailableMovesForCondition(condition: TabulaCondition): AvaliableMove[] {
    return new TabulaGame(condition).availableMoves
  }

  public static findWinnerForCondition(condition: TabulaCondition): PlayerColor | undefined {
    return new TabulaGame(condition).winner
  }

  public static initial() {
    return new TabulaGame({
      cells: makeEmptyCellRange(24),
      currentPlayer: 'BLUE',
      dice: [],
      start: {
        BLUE: 15,
        GREEN: 15,
      },
      jail: {
        BLUE: 0,
        GREEN: 0,
      },
      home: {
        BLUE: 0,
        GREEN: 0,
      },
    })
  }

  public static testState() {
    const cells: Cell[] = [
      { stones: 2, 'color': 'GREEN' },
      { stones: 3, 'color': 'GREEN' },
      { stones: 2, 'color': 'GREEN' },
      { stones: 2, 'color': 'GREEN' },
      { stones: 3, 'color': 'GREEN' },
      { stones: 0 },
      ...makeEmptyCellRange(15),
      { stones: 0 },
      { stones: 2, color: 'BLUE' },
      { stones: 0 },
    ]
    return new TabulaGame({
      ...TabulaGame.initial()._condition,
      cells,
      dice: [3, 5],
      start: { BLUE: 0, GREEN: 15 },
      jail: { BLUE: 0, GREEN: 0 },
    })
  }
}
