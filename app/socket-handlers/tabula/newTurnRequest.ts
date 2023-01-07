import { AppSocket } from 'Definitions/socketTypes'
import { ConditionAndLogPayload, ErrorPayload, NewTurnRequestPayload } from 'definitions/tabula/TabulaService'
import { getTabulaRoom, buildErrorPayload, verifyPlayer, buildConditionAndLogPayload } from './utility'

export function makeNewTurnRequest (
  socket: AppSocket
) {
  return (
    payload: NewTurnRequestPayload,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => {
    console.log('NewTurnRequestPayload', payload)

    const room = getTabulaRoom(payload.roomName)
    if (!payload.roomName || !room) {
      return callback(buildErrorPayload(`No Tabula Room ${payload.roomName}`, payload))
    }

    if (!verifyPlayer(room, socket.id, payload)) {
      socket.emit('basicEmit', { message: 'You are not a player!' })
      return callback(buildErrorPayload(`Not authorised to play in ${payload.roomName}`, payload))
    }

    room.game.newTurn(payload.dice)

    const response = buildConditionAndLogPayload(room)
    callback(response)
    socket.to(payload.roomName).emit('conditionAndLog', response)
  }
}
