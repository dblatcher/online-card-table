import { AppSocket } from 'Definitions/socketTypes'
import { ConditionAndLogPayload, ErrorPayload, MoveRequestPayload } from 'definitions/tabula/TabulaService'
import { buildErrorPayload, getTabulaRoom, buildConditionAndLogPayload, verifyPlayer } from './utility'

export function makeMoveRequestHandler(
  socket: AppSocket
) {
  return (
    payload: MoveRequestPayload,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => {
    console.log('MoveRequestPayload', payload)

    const room = getTabulaRoom(payload.roomName)
    if (!payload.roomName || !room) {
      return callback(buildErrorPayload(`No Tabula Room ${payload.roomName}`, payload))
    }

    const { isPlayersTurn, reason } = verifyPlayer(room, socket.id, payload)
    if (!isPlayersTurn) {
      socket.emit('basicEmit', { message: reason })
      return callback(buildErrorPayload(`Not authorised to play in ${payload.roomName}: ${reason}`, payload))
    }

    room.game.attemptMove(payload.dieIndex, payload.squareOrZone)

    const response = buildConditionAndLogPayload(room)
    callback(response)
    socket.to(payload.roomName).emit('conditionAndLog', response)
  }
}
