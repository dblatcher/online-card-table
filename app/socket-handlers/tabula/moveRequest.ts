import { AppSocket } from 'Definitions/socketTypes'
import { ConditionAndLogPayload, ErrorPayload, MoveRequestPayload } from 'definitions/tabula/TabulaService'

export function makeMoveRequestHandler(
  socket: AppSocket
) {
  return (
    payload: MoveRequestPayload,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => {
    console.log('MoveRequestPayload', payload)

    socket.emit('basicEmit', { message: 'MoveRequestPayload DOES NOT WORK YET!' })
    callback({ errorMessage: 'This service is not implemented', isError: true, roomName: payload.roomName })
  }
}
