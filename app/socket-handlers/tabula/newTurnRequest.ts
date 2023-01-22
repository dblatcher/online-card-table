import { AppSocket } from 'Definitions/socketTypes'
import { ConditionAndLogPayload, ErrorPayload, NewTurnRequestPayload } from 'definitions/tabula/TabulaService'
import { buildConditionAndLogPayload, getErrorPayloadOrRoom } from './utility'

export function makeNewTurnRequest (
  socket: AppSocket
) {
  return (
    payload: NewTurnRequestPayload,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => {
    console.log('NewTurnRequestPayload', payload)
    const errorOrRoom = getErrorPayloadOrRoom(payload, socket.id)
    if ('error' in errorOrRoom) {
      socket.emit('basicEmit', { message: errorOrRoom.error.errorMessage })
      return callback(errorOrRoom.error)
    }
    const { room } = errorOrRoom

    const events = room.game.newTurn(payload.dice)
    const response = buildConditionAndLogPayload(room, events)
    callback(response)
    socket.to(room.name).emit('conditionAndLog', response)
  }
}
