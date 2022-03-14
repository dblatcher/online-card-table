import Rooms from 'App/services/Rooms'
import { AppSocket, TypedServer } from 'Definitions/socketTypes'

export function makeDisconnectHandler (socket: AppSocket, io: TypedServer) {
  return (reason: string) => {
    console.log('disconnected', reason, socket.id)

    const { leavingPlayer, room, errorString } = Rooms.handleDisconnect(socket.id)

    if (errorString) {
      console.warn(errorString)
    }

    if (!leavingPlayer || !room) {
      return
    }

    io.to(room.name).emit('basicEmit', {
      from: '_SERVER_',
      message: `${leavingPlayer.name || leavingPlayer.id} has disconnected`,
    })
    io.to(room.name).emit('playerList', { roomName: room.name, players: room.players.map(Rooms.makeSafe) })
  }
}
