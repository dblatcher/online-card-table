
import { TabulaGame } from '../../definitions/tabula/TabulaGame'
import {
  TabulaService, Payload, ConditionAndLog, MoveRequest, NewTurnRequest,
} from '../../definitions/tabula/TabulaService'
const tabula = TabulaGame.testState()

class LocalTabulaService extends TabulaService {
  public async requestConditionAndLog(): Promise<Payload<ConditionAndLog>> {
    return this.responsePayload
  }

  public async requestMove(request: MoveRequest): Promise<Payload<ConditionAndLog>> {
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

  public async requestNewTurn(request: NewTurnRequest): Promise<Payload<ConditionAndLog>> {
    const { dice } = request
    tabula.newTurn(dice)
    return this.responsePayload
  }

  private get responsePayload(): Payload<ConditionAndLog> {
    return {
      data: {
        condition: tabula.condition,
        log: tabula.log,
      },
    }
  }
}

export const localTabulaService = new LocalTabulaService()

