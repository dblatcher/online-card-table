/* eslint-disable @typescript-eslint/space-before-function-paren */
import { TabulaCondition, GameEvent, DieRoll } from './types'

export type ErrorResponse = { error: Error }
export type Payload<T extends {}> = { data: T } | ErrorResponse

export type MoveRequest = {
  dieIndex: number
  squareOrZone: number | 'jail' | 'start'
}
export type NewTurnRequest = {
  dice: [DieRoll, DieRoll]
}
export type ConditionAndLog = {
  condition: TabulaCondition
  log: GameEvent[]
}

export abstract class TabulaService {
  public abstract requestConditionAndLog(): Promise<Payload<ConditionAndLog>>
  public abstract requestMove(request: MoveRequest): Promise<Payload<ConditionAndLog>>
  public abstract requestNewTurn(request: NewTurnRequest): Promise<Payload<ConditionAndLog>>
}

