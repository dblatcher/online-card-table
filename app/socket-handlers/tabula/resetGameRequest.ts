import { AppSocket } from 'Definitions/socketTypes'
import { ConditionAndLogPayload, ErrorPayload, ResetGameRequest } from 'definitions/tabula/TabulaService'
import { buildConditionAndLogPayload, getErrorPayloadOrRoom } from './utility'

export function makeResetGameRequest (
  socket: AppSocket
) {
  return (
    payload: ResetGameRequest,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => {
    console.log('ResetGameRequest', payload)
    const errorOrRoom = getErrorPayloadOrRoom(payload, socket.id)
    if ('error' in errorOrRoom) {
      socket.emit('basicEmit', { message: errorOrRoom.error.errorMessage })
      return callback(errorOrRoom.error)
    }
    const { room } = errorOrRoom

    const events = room.game.resetGame()
    const response = buildConditionAndLogPayload(room, events)
    callback(response)
    socket.to(room.name).emit('conditionAndLog', response)
  }
}
