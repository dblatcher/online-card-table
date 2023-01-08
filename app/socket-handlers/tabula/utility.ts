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

export const verifyPlayer = (
  room: TabulaRoomState,
  socketId: string,
  request: PayloadBase,
  forNewTurn?: boolean,
): { isPlayersTurn: boolean, reason: string } => {
  const { currentPlayer: colorWhoCouldMove } = room.game.condition
  const { otherPlayer: colorWhoWillRollForNewTurn } = room.game
  const colorWhosTurnItIs = forNewTurn ? colorWhoWillRollForNewTurn : colorWhoCouldMove
  const player = room.players.find(player => player.id === request.from && player.socketId === socketId)
  if (!player) {
    return { reason: 'You are not a player in this game.', isPlayersTurn: false }
  }

  const isPlayersTurn = player && player.role === colorWhosTurnItIs
  if (!isPlayersTurn) {
    const reason = forNewTurn ? `It is ${colorWhoWillRollForNewTurn} who will roll.` : 'It is not your turn to move'
    return { reason, isPlayersTurn: false }
  }

  return { isPlayersTurn: true, reason: '' }
}
