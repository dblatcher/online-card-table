import { AppSocket } from 'Definitions/socketTypes'
import { ConditionAndLogPayload, ErrorPayload, MoveRequestPayload } from 'definitions/tabula/TabulaService'
import { buildConditionAndLogPayload, getErrorPayloadOrRoom } from './utility'

export function makeMoveRequestHandler (
  socket: AppSocket
) {
  return (
    payload: MoveRequestPayload,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => {
    console.log('MoveRequestPayload', payload)
    const errorOrRoom = getErrorPayloadOrRoom(payload, socket.id)
    if ('error' in errorOrRoom) {
      socket.emit('basicEmit', { message: errorOrRoom.error.errorMessage })
      return callback(errorOrRoom.error)
    }
    const { room } = errorOrRoom

    const events = room.game.attemptMove(payload.dieIndex, payload.squareOrZone)
    const response = buildConditionAndLogPayload(room, events)
    callback(response)
    socket.to(room.name).emit('conditionAndLog', response)
  }
}
