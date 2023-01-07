import { AppSocket } from 'Definitions/socketTypes'
import { ConditionAndLogRequestPayload, ConditionAndLogPayload, ErrorPayload } from 'definitions/tabula/TabulaService'
import { buildErrorPayload, getTabulaRoom, buildConditionAndLogPayload } from './utility'

export function makeConditionAndLogRequestHandler (
  socket: AppSocket
) {
  return (
    payload: ConditionAndLogRequestPayload,
    callback: { (response: ConditionAndLogPayload | ErrorPayload): void }
  ) => {
    console.log('ConditionAndLogRequestPayload', payload, socket.id)
    const roomState = getTabulaRoom(payload.roomName)

    if (!roomState) {
      return callback(buildErrorPayload(`No Tabula Room ${payload.roomName}`, payload))
    }

    return callback(buildConditionAndLogPayload(roomState))
  }
}
