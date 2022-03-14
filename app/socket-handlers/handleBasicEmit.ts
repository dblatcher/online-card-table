import Rooms from 'App/services/Rooms'
import { BasicEmitPayload } from 'Definitions/socketEvents'
import { AppSocket } from 'Definitions/socketTypes'

export function makeBasicEmitHandler (
  socket: AppSocket
) {
  return (payload: BasicEmitPayload) => {
    console.log(payload)
    const room = Rooms.getRoomByName(payload.roomName)
    if (room) {
      socket.to(room.name).emit('basicEmit', payload)
    }
  }
}
