import { TabulaGame } from '../../definitions/tabula/TabulaGame'
import {
  TabulaService, ConditionAndLogPayload, MoveRequestPayload, NewTurnRequestPayload,
} from '../../definitions/tabula/TabulaService'
const tabula = TabulaGame.testState()

class LocalTabulaService extends TabulaService {
  public async requestConditionAndLog(): Promise<ConditionAndLogPayload> {
    return this.responsePayload
  }

  public async requestMove(request: MoveRequestPayload): Promise<ConditionAndLogPayload> {
    const { dieIndex, squareOrZone } = request
    if (typeof squareOrZone === 'number') {
      tabula.attemptMoveFromSquare(dieIndex, squareOrZone)
    } else if (squareOrZone === 'jail') {
      tabula.attemptMoveFromJail(dieIndex)
    } else if (squareOrZone === 'start') {
      tabula.attemptMoveFromStart(dieIndex)
    }

    return this.responsePayload
  }

  public async requestNewTurn(request: NewTurnRequestPayload): Promise<ConditionAndLogPayload> {
    const { dice } = request
    tabula.newTurn(dice)
    return this.responsePayload
  }

  private get responsePayload(): ConditionAndLogPayload {
    return {
      condition: tabula.condition,
      log: tabula.log,
    }
  }
}

export const localTabulaService = new LocalTabulaService()

