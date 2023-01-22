import Rooms from 'App/services/Rooms'
import { TabulaRoomState } from 'definitions/RoomState'
import {
  ConditionAndLogPayload, ErrorPayload, MoveRequestPayload, NewTurnRequestPayload, TabulaClientRequest,
} from 'definitions/tabula/TabulaService'
import { PayloadBase } from 'definitions/types'

const getTabulaRoom = (roomName?: string): TabulaRoomState | undefined => {
  const room = Rooms.getRoomByName(roomName)
  return room?.type === 'Tabula' ? room : undefined
}

const buildErrorPayload = (
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

const verifyPlayer = (
  room: TabulaRoomState,
  socketId: string,
  request: NewTurnRequestPayload | MoveRequestPayload,
): { isPlayersTurn: boolean, reason: string } => {
  const forNewTurn = 'dice' in request
  const { currentPlayer: colorWhoCouldMove } = room.game.condition
  const { otherPlayer: colorWhoWillRollForNewTurn } = room.game
  const colorWhosTurnItIs = forNewTurn ? colorWhoWillRollForNewTurn : colorWhoCouldMove
  const player = room.players.find(player => player.id === request.from && player.socketId === socketId)
  if (!player) {
    return { reason: 'You are not a player in this game.', isPlayersTurn: false }
  }

  const isPlayersTurn = player && player.role === colorWhosTurnItIs
  if (!isPlayersTurn) {
    const reason = forNewTurn ? 'It is not your turn to roll.' : 'It is not your turn to move.'
    return { reason, isPlayersTurn: false }
  }

  return { isPlayersTurn: true, reason: '' }
}

export const getErrorPayloadOrRoom = (
  payload: TabulaClientRequest,
  socketId: string,
): { error: ErrorPayload } | { room: TabulaRoomState } => {
  const room = getTabulaRoom(payload.roomName)
  if (!payload.roomName || !room) {
    return { error: buildErrorPayload(`No Tabula Room ${payload.roomName}`, payload) }
  }

  if ('dice' in payload || 'dieIndex' in payload) {
    const { isPlayersTurn, reason } = verifyPlayer(room, socketId, payload)
    if (!isPlayersTurn) {
      return { error: buildErrorPayload(`Move refused in ${payload.roomName}: ${reason}`, payload) }
    }
  }

  return { room }
}
