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

  public setDice(rolls: [DieRoll, DieRoll]) {
    this._condition.dice = rolls[0] === rolls[1]
      ? [rolls[0], rolls[0], rolls[0], rolls[0]]
      : [rolls[0], rolls[1]]
  }

  public attemptMoveFromStart(dieIndex: number) {
    const { dice, cells, turnOf, start, jail } = this._condition
    const dieValue = dice[dieIndex]
    const targetCell = cells[dieValue - 1]
    const validTargetSqaure = targetCell && !this.isHeldByOtherPlayer(targetCell)

    if (jail[turnOf] > 0) {
      console.log(`${turnOf} must get thier pieces from jail first`)
      return
    } else if (start[turnOf] === 0) {
      console.log(`${turnOf} has no pieces to bring on`)
      return
    } else if (!validTargetSqaure) {
      console.log(`target is held by ${this.otherPlayer}`)
      return
    } else {
      console.log(`${turnOf} is moving a stone from start to ${dieValue}`)
      dice.splice(dieIndex, 1)
      this.moveFromStartToSquare(targetCell)
    }
  }

  public attemptMoveFromJail(dieIndex: number) {
    const { dice, cells, turnOf, jail } = this._condition
    const dieValue = dice[dieIndex]
    const targetCell = cells[dieValue - 1]
    const validTargetSqaure = targetCell && !this.isHeldByOtherPlayer(targetCell)

    if (jail[turnOf] === 0) {
      console.log(`${turnOf} has no pieces in jail`)
      return
    } else if (!validTargetSqaure) {
      console.log(`target is held by ${this.otherPlayer}`)
      return
    } else {
      console.log(`${turnOf} is moving a stone from start to ${dieValue}`)
      dice.splice(dieIndex, 1)
      this.moveFromJailToSquare(targetCell)
    }
  }

  public attemptMoveFromSquare(dieIndex: number, cellIndex: number) {
    const { dice, cells, turnOf, jail, start } = this._condition
    const dieValue = dice[dieIndex]
    const startCell = cells[cellIndex]

    if (!dieValue || !startCell) {
      return
    }

    const wouldCastOff = dieValue + cellIndex >= cells.length
    const canCastOff = start[turnOf] === 0 && jail[turnOf] === 0
    const targetCell = cells[dieValue + cellIndex]
    const validStartSquare = startCell.color === turnOf && startCell.stones > 0
    const validTargetSqaure = targetCell && !this.isHeldByOtherPlayer(targetCell)

    console.log({ wouldCastOff, targetCell, validStartSquare, validTargetSqaure })

    if (jail[turnOf] > 0) {
      console.log(`${turnOf} must get thier pieces from jail first`)
      return
    }

    if (wouldCastOff) {
      if (canCastOff) {
        dice.splice(dieIndex, 1)
        this.castOffFromSquare(startCell)
        console.log(`${turnOf} casting off from square ${cellIndex + 1}!`)
        return
      } else {
        console.log(`${turnOf} cannot cast off!`)
        return
      }
    }

    if (validStartSquare && validTargetSqaure) {
      dice.splice(dieIndex, 1)
      console.log(`${turnOf} moving ${dieValue} placed from square ${cellIndex + 1}`)
      this.moveFromSquareToSquare(startCell, targetCell)
    } else if (!validStartSquare) {
      console.log(`${turnOf} has no stones on ${cellIndex + 1}`)
    } else if (this.isHeldByOtherPlayer(targetCell)) {
      console.log(`${turnOf} can't move from ${cellIndex + 1} to ${cellIndex + dieValue + 1} because is it held by ${this.otherPlayer}`)
    }
  }

  private moveFromStartToSquare(targetCell: Cell) {
    this._condition.start[this._condition.turnOf]--
    this.captureSingle(targetCell)
    targetCell.stones++
    targetCell.color = this._condition.turnOf
  }
  private moveFromJailToSquare(targetCell: Cell) {
    this._condition.jail[this._condition.turnOf]--
    this.captureSingle(targetCell)
    targetCell.stones++
    targetCell.color = this._condition.turnOf
  }
  private moveFromSquareToSquare(startCell: Cell, targetCell: Cell) {
    startCell.stones--
    this.captureSingle(targetCell)
    targetCell.stones++
    targetCell.color = this._condition.turnOf
  }
  private castOffFromSquare(startCell: Cell) {
    startCell.stones--
    this._condition.home[this._condition.turnOf]++
  }

  private captureSingle(targetCell: Cell) {
    if (targetCell.color === this.otherPlayer) {
      this._condition.jail[this.otherPlayer] += targetCell.stones
      targetCell.stones = 0
      console.log(`${this._condition.turnOf} captured a ${this.otherPlayer} stone.`)
    }
  }

  private isHeldByOtherPlayer(cell?: Cell): boolean {
    if (!cell) {
      return false
    }
    return cell.color === this.otherPlayer && cell.stones >= 2
  }

  private get otherPlayer(): PlayerColor {
    return this._condition.turnOf === 'BLUE' ? 'GREEN' : 'BLUE'
  }

  public static initial() {
    return new TabulaGame({
      cells: makeEmptyCellRange(24),
      turnOf: 'BLUE',
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
      dice: [5, 4, 3, 2, 1],
      start: { BLUE: 0, GREEN: 15 },
      jail: { BLUE: 1, GREEN: 0 },
    })
  }
}
