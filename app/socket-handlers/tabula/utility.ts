import Rooms from 'App/services/Rooms'
import { TabulaRoomState } from 'definitions/RoomState'
import { ConditionAndLogPayload, ErrorPayload } from 'definitions/tabula/TabulaService'
import { PayloadBase } from 'definitions/types'

export const getTabulaRoom = (roomName?: string): TabulaRoomState | undefined => {
  const room = Rooms.getRoomByName(roomName)
  return room?.type === 'Tabula' ? room : undefined
}

export const buildErrorPayload = (
  errorMessage: string,
  request: PayloadBase
): ErrorPayload => ({
  roomName: request.roomName,
  isError: true,
  errorMessage,
})

export const buildConditionAndLogPayload = (
  room: TabulaRoomState,
): ConditionAndLogPayload => ({
  log: room.game.log,
  condition: room.game.condition,
  roomName: room.name,
})

/**
 * Place holder - returns true
 */
export const verifyPlayer = (
  room: TabulaRoomState,
  socketId: string,
  request: PayloadBase
): boolean => {
  console.log(`can ${request.from} (${socketId}) play in ${room.name}?`)
  return true
}
