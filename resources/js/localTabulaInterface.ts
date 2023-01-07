import { TabulaGame } from '../../definitions/tabula/TabulaGame'
import {
  TabulaInterface, ConditionAndLogPayload, MoveRequestPayload, NewTurnRequestPayload,
} from '../../definitions/tabula/TabulaService'
const tabula = TabulaGame.initial()

class LocalTabulaInterface extends TabulaInterface {
  public async requestConditionAndLog () {
    return this.responsePayload
  }

  public async requestMove (request: MoveRequestPayload) {
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

  public async requestNewTurn (request: NewTurnRequestPayload) {
    const { dice } = request
    tabula.newTurn(dice)
    return this.responsePayload
  }

  private get responsePayload (): ConditionAndLogPayload {
    return {
      condition: tabula.condition,
      log: tabula.log,
    }
  }
}

export const localTabulaService = new LocalTabulaInterface()

