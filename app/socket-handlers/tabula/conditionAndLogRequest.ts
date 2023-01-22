import { AppSocket } from 'Definitions/socketTypes'
import { ConditionAndLogRequestPayload, ConditionAndLogPayload, ErrorPayload } from 'definitions/tabula/TabulaService'
import { buildConditionAndLogPayload, getErrorPayloadOrRoom } from './utility'

export function makeConditionAndLogRequestHandler (
  socket: AppSocket
) {
  return (
    payload: ConditionAndLogRequestPayload,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => {
    console.log('ConditionAndLogRequestPayload', payload, socket.id)
    const errorOrRoom = getErrorPayloadOrRoom(payload, socket.id)
    if ('error' in errorOrRoom) {
      socket.emit('basicEmit', { message: errorOrRoom.error.errorMessage })
      return callback(errorOrRoom.error)
    }
    const { room } = errorOrRoom

    return callback(buildConditionAndLogPayload(room))
  }
}
