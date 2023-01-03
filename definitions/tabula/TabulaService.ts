/* eslint-disable @typescript-eslint/space-before-function-paren */
import type { PayloadBase } from 'definitions/types'
import { TabulaCondition, GameEvent, DieRoll } from './types'

export type MoveRequestPayload = PayloadBase & {
  dieIndex: number
  squareOrZone: number | 'jail' | 'start'
}
export type NewTurnRequestPayload = PayloadBase & {
  dice: [DieRoll, DieRoll]
}
export type ConditionAndLogPayload = PayloadBase & {
  condition: TabulaCondition
  log: GameEvent[]
}

export type ConditionAndLogRequestPayload = PayloadBase

export abstract class TabulaService {
  public abstract requestConditionAndLog(request: ConditionAndLogRequestPayload): Promise<ConditionAndLogPayload>
  public abstract requestMove(request: MoveRequestPayload): Promise<ConditionAndLogPayload>
  public abstract requestNewTurn(request: NewTurnRequestPayload): Promise<ConditionAndLogPayload>
}

