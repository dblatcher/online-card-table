import Rooms from 'App/services/Rooms'
import { TabulaRoomState } from 'definitions/RoomState'
import {
  ConditionAndLogPayload,
  ErrorPayload,
  MoveRequestPayload,
  NewTurnRequestPayload,
  ResetGameRequest,
  TabulaClientRequest,
} from 'definitions/tabula/TabulaService'
import { GameEvent } from 'definitions/tabula/types'
import { PayloadBase, Player } from 'definitions/types'

const getTabulaRoom = (roomName?: string): TabulaRoomState | undefined => {
  const room = Rooms.getRoomByName(roomName)
  return room?.type === 'Tabula' ? room : undefined
}

const hasPlayerColorRole = (player?: Player): boolean => player?.role === 'GREEN' || player?.role === 'BLUE'

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
  eventsFromRequest?: GameEvent[],
): ConditionAndLogPayload => ({
  log: eventsFromRequest || room.game.log,
  condition: room.game.condition,
  roomName: room.name,
  isLogUpdate: !!eventsFromRequest,
})

const verifyPlayerMove = (
  room: TabulaRoomState,
  socketId: string,
  request: NewTurnRequestPayload | MoveRequestPayload,
): { isPlayersTurn: boolean, reason: string } => {
  const player = room.players.find(player => player.id === request.from && player.socketId === socketId)
  if (!player) {
    return { reason: 'You are not signed in to this game.', isPlayersTurn: false }
  }
  if (!hasPlayerColorRole(player)) {
    return { reason: 'You are just an observer in this game.', isPlayersTurn: false }
  }
  const forNewTurn = 'dice' in request
  const { currentPlayer: colorWhoCouldMove } = room.game.condition
  const { otherPlayer: colorWhoWillRollForNewTurn } = room.game
  const colorWhosTurnItIs = forNewTurn ? colorWhoWillRollForNewTurn : colorWhoCouldMove

  const isPlayersTurn = player && player.role === colorWhosTurnItIs
  if (!isPlayersTurn) {
    const reason = forNewTurn ? 'It is not your turn to roll.' : 'It is not your turn to move.'
    return { reason, isPlayersTurn: false }
  }

  return { isPlayersTurn: true, reason: '' }
}

const vertifyCanReset = (
  room: TabulaRoomState,
  socketId: string,
  request: ResetGameRequest,
): { canReset: boolean, reason: string } => {
  const player = room.players.find(player => player.id === request.from && player.socketId === socketId)
  if (!hasPlayerColorRole(player)) {
    return { reason: 'You are not a player in this game.', canReset: false }
  }

  return { canReset: true, reason: '' }
}

export const getErrorPayloadOrRoom = (
  payload: TabulaClientRequest,
  socketId: string,
): { error: ErrorPayload } | { room: TabulaRoomState } => {
  const room = getTabulaRoom(payload.roomName)
  if (!payload.roomName || !room) {
    return { error: buildErrorPayload(`No Tabula Room ${payload.roomName}`, payload) }
  }

  if ('reset' in payload) {
    const { canReset, reason } = vertifyCanReset(room, socketId, payload)
    if (!canReset) {
      return { error: buildErrorPayload(`Reset refused in ${payload.roomName}: ${reason}`, payload) }
    }
  }
  if ('dice' in payload || 'dieIndex' in payload) {
    const { isPlayersTurn, reason } = verifyPlayerMove(room, socketId, payload)
    if (!isPlayersTurn) {
      return { error: buildErrorPayload(`Move refused in ${payload.roomName}: ${reason}`, payload) }
    }
  }

  return { room }
}
