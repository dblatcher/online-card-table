import Rooms from 'App/services/Rooms'
import { TableStatusPayload } from 'Definitions/socketEvents'
import { AppSocket } from 'Definitions/socketTypes'

export function makeTableStatusHandler (socket: AppSocket) {
  return (tableStatusPayload:TableStatusPayload) => {
    console.log(`tableStatus for "${tableStatusPayload.roomName}" received at ${Date.now()} from "${tableStatusPayload.from}" : ${tableStatusPayload.data.length} piles`)
    const { room, errorString, player } = Rooms.handleTableStatusEvent(tableStatusPayload)

    if (errorString) {
      console.warn(errorString)
    }

    if (!room || !player) {
      socket.emit('basicEmit', { message: errorString || 'unknown table status update error', from: '_SERVER_' })
      return
    }

    socket.to(tableStatusPayload.roomName).emit('tableStatus', {
      ...tableStatusPayload,
      data: room.table,
      from: player.id,
    })
  }
}
