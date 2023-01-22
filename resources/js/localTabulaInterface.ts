import { GameEvent } from 'definitions/tabula/types'
import { TabulaGame } from '../../definitions/tabula/TabulaGame'
import {
  TabulaInterface, ConditionAndLogPayload, MoveRequestPayload, NewTurnRequestPayload, ErrorPayload, ResetGameRequest,
} from '../../definitions/tabula/TabulaService'
const tabula = TabulaGame.initial()

class LocalTabulaInterface extends TabulaInterface {
  public async requestConditionAndLog () {
    return this.defaultResponsePayload
  }

  public async requestMove (request: MoveRequestPayload) {
    const { dieIndex, squareOrZone } = request
    const events = tabula.attemptMove(dieIndex, squareOrZone)
    return this.makeRequestResponsePayload(events)
  }

  public async requestNewTurn (request: NewTurnRequestPayload) {
    const { dice } = request
    const events = tabula.newTurn(dice)
    return this.makeRequestResponsePayload(events)
  }

  public async requestResetGame(_request: ResetGameRequest): Promise<ConditionAndLogPayload | ErrorPayload> {
    const events = tabula.resetGame()
    return this.makeRequestResponsePayload(events)
  }

  private makeRequestResponsePayload (events: GameEvent[]): ConditionAndLogPayload {
    return {
      condition: tabula.condition,
      log: events,
      isLogUpdate: true,
    }
  }

  private get defaultResponsePayload (): ConditionAndLogPayload {
    return {
      condition: tabula.condition,
      log: tabula.log,
    }
  }
}

export const localTabulaService = new LocalTabulaInterface()

