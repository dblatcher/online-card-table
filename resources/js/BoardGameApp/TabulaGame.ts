import { DieRoll, TabulaCondition } from './types'

export class TabulaGame {
  private _condition: TabulaCondition

  constructor(condition: TabulaCondition) {
    this._condition = condition
  }

  public get condition() {
    return this._condition
  }

  public setDice (rolls: [DieRoll, DieRoll]) {
    this._condition.dice = rolls[0] === rolls[1]
      ? [rolls[0], rolls[0], rolls[0], rolls[0]]
      : [rolls[0], rolls[1]]
  }

  public static initial() {
    return new TabulaGame({
      cells: Array(24).fill({ stones: 0 }),
      turnOf: 'BLUE',
      dice: [],
    })
  }
}
