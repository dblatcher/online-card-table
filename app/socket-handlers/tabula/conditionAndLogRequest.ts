import { AppSocket } from 'Definitions/socketTypes'
import { ConditionAndLogRequestPayload, ConditionAndLogPayload, ErrorPayload } from 'definitions/tabula/TabulaService'
// import { TabulaGame } from 'definitions/tabula/TabulaGame'

// const buildConditionAndLogPayload = (
//   game: TabulaGame,
//   request: ConditionAndLogRequestPayload
// ): ConditionAndLogPayload => ({
//   log: game.log,
//   condition: game.condition,
//   roomName: request.roomName,
// })

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
    callback(buildErrorPayload('not implmented', payload))
    // const data = Rooms.provideRoomState(payload)

    // const response = data.room
    //   ? buildConditionAndLogPayload(data.room.game, payload)
    //   : buildErrorPayload(data.errorString || 'UNKNOWN ERROR', payload)

    // callback(response)
  }
}
