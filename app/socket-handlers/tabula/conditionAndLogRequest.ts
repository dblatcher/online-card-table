import Rooms from 'App/services/Rooms'
import { TabulaRoomState } from 'definitions/RoomState'
import { AppSocket } from 'Definitions/socketTypes'
import { ConditionAndLogRequestPayload, ConditionAndLogPayload, ErrorPayload } from 'definitions/tabula/TabulaService'


const buildConditionAndLogPayload = (
  room: TabulaRoomState,
): ConditionAndLogPayload => ({
  log: room.game.log,
  condition: room.game.condition,
  roomName: room.name,
})

const buildErrorPayload = (
  errorMessage: string,
  request: ConditionAndLogRequestPayload
): ErrorPayload => ({
  roomName: request.roomName,
  isError: true,
  errorMessage,
})

export function makeConditionAndLogRequestHandler(
  socket: AppSocket
) {
  return (
    payload: ConditionAndLogRequestPayload,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => {
    console.log('ConditionAndLogRequestPayload', payload, socket.id)
    const roomState = Rooms.getRoomByName(payload.roomName)

    if (!roomState || roomState.type !== 'Tabula') {
      return callback(buildErrorPayload(`No Tabula Room ${payload.roomName}`, payload))
    }

    return callback(buildConditionAndLogPayload(roomState))
  }
}
