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
  isLogUpdate?: boolean
}
export type ResetGameRequest = PayloadBase & {
  reset: true
}

export type ErrorPayload = PayloadBase & {
  errorMessage: string
  isError: true
}

export type ConditionAndLogRequestPayload = PayloadBase
export type TabulaClientRequest = MoveRequestPayload |
NewTurnRequestPayload |
ConditionAndLogRequestPayload |
ResetGameRequest

export abstract class TabulaInterface {
  public abstract requestConditionAndLog(
    request: ConditionAndLogRequestPayload
  ): Promise<ConditionAndLogPayload | ErrorPayload>
  public abstract requestMove(
    request: MoveRequestPayload
  ): Promise<ConditionAndLogPayload | ErrorPayload>
  public abstract requestNewTurn(
    request: NewTurnRequestPayload
  ): Promise<ConditionAndLogPayload | ErrorPayload>
  public abstract requestResetGame(
    request: ResetGameRequest
  ): Promise<ConditionAndLogPayload | ErrorPayload>
}

