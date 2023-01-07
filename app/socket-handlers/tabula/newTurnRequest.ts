import { AppSocket } from 'Definitions/socketTypes'
import { ConditionAndLogPayload, ErrorPayload, NewTurnRequestPayload } from 'definitions/tabula/TabulaService'

export function makeNewTurnRequest(
  socket: AppSocket
) {
  return (
    payload: NewTurnRequestPayload,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => {
    console.log('NewTurnRequestPayload', payload)

    socket.emit('basicEmit', { message: 'NewTurnRequestPayload DOES NOT WORK YET!' })
    callback({ errorMessage: 'This service is not implemented', isError: true, roomName: payload.roomName })
  }
}
