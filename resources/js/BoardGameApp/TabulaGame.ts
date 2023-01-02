/* eslint-disable @typescript-eslint/space-before-function-paren */
import { Cell, DieRoll, PlayerColor, TabulaCondition } from './types'

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

  constructor(condition: TabulaCondition) {
    this._condition = condition
  }

  public get condition() {
    return this._condition
  }

  public newTurn(rolls: [DieRoll, DieRoll]) {
    this._condition.dice = rolls[0] === rolls[1]
      ? [rolls[0], rolls[0], rolls[0], rolls[0]]
      : [rolls[0], rolls[1]]

    this._condition.currentPlayer = this.otherPlayer
  }

  public attemptMoveFromStart(dieIndex: number) {
    const { dice, cells, currentPlayer, start, jail } = this._condition
    const dieValue = dice[dieIndex]
    const targetCell = cells[dieValue - 1]
    const validTargetSqaure = targetCell && !this.isHeldByOtherPlayer(targetCell)

    if (jail[currentPlayer] > 0) {
      console.log(`${currentPlayer} must get thier pieces from jail first`)
      return
    } else if (start[currentPlayer] === 0) {
      console.log(`${currentPlayer} has no pieces to bring on`)
      return
    } else if (!validTargetSqaure) {
      console.log(`target is held by ${this.otherPlayer}`)
      return
    } else {
      console.log(`${currentPlayer} is moving a stone from start to ${dieValue}`)
      dice.splice(dieIndex, 1)
      this.moveFromStartToSquare(targetCell)
    }
  }

  public attemptMoveFromJail(dieIndex: number) {
    const { dice, cells, currentPlayer, jail } = this._condition
    const dieValue = dice[dieIndex]
    const targetCell = cells[dieValue - 1]
    const validTargetSqaure = targetCell && !this.isHeldByOtherPlayer(targetCell)

    if (jail[currentPlayer] === 0) {
      console.log(`${currentPlayer} has no pieces in jail`)
      return
    } else if (!validTargetSqaure) {
      console.log(`target is held by ${this.otherPlayer}`)
      return
    } else {
      console.log(`${currentPlayer} is moving a stone from start to ${dieValue}`)
      dice.splice(dieIndex, 1)
      this.moveFromJailToSquare(targetCell)
    }
  }

  public attemptMoveFromSquare(dieIndex: number, cellIndex: number) {
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

    console.log({ wouldCastOff, targetCell, validStartSquare, validTargetSqaure })

    if (jail[currentPlayer] > 0) {
      console.log(`${currentPlayer} must get thier pieces from jail first`)
      return
    }

    if (wouldCastOff) {
      if (canCastOff) {
        dice.splice(dieIndex, 1)
        this.castOffFromSquare(startCell)
        console.log(`${currentPlayer} casting off from square ${cellIndex + 1}!`)
        return
      } else {
        console.log(`${currentPlayer} cannot cast off!`)
        return
      }
    }

    if (validStartSquare && validTargetSqaure) {
      dice.splice(dieIndex, 1)
      console.log(`${currentPlayer} moving ${dieValue} placed from square ${cellIndex + 1}`)
      this.moveFromSquareToSquare(startCell, targetCell)
    } else if (!validStartSquare) {
      console.log(`${currentPlayer} has no stones on ${cellIndex + 1}`)
    } else if (this.isHeldByOtherPlayer(targetCell)) {
      console.log(`${currentPlayer} can't move from ${cellIndex + 1} to ${cellIndex + dieValue + 1} because is it held by ${this.otherPlayer}`)
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
      console.log(`${this._condition.currentPlayer} captured a ${this.otherPlayer} stone.`)
    }
  }

  private isHeldByOtherPlayer(cell?: Cell): boolean {
    if (!cell) {
      return false
    }
    return cell.color === this.otherPlayer && cell.stones >= 2
  }

  public get otherPlayer(): PlayerColor {
    return this._condition.currentPlayer === 'BLUE' ? 'GREEN' : 'BLUE'
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
      { stones: 2, 'color': 'BLUE' },
      { stones: 3, 'color': 'BLUE' },
      { stones: 1, 'color': 'GREEN' },
      { stones: 1, 'color': 'GREEN' },
      { stones: 3, 'color': 'GREEN' },
      { stones: 0 },
      ...makeEmptyCellRange(15),
      { stones: 0 },
      { stones: 3, color: 'BLUE' },
      { stones: 0 },
    ]
    return new TabulaGame({
      ...TabulaGame.initial()._condition,
      cells,
      dice: [],
      start: { BLUE: 0, GREEN: 15 },
      jail: { BLUE: 0, GREEN: 0 },
    })
  }
}
