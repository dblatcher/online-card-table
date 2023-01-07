import Rooms from 'App/services/Rooms'
import { LogInPayload } from 'Definitions/socketEvents'
import { AppSocket, TypedServer } from 'Definitions/socketTypes'

export function makeLoginHandler(socket: AppSocket, io: TypedServer) {
  return (logInPayload: LogInPayload) => {
    console.log(`logIn for "${logInPayload.roomName}" received at ${Date.now()} from "${logInPayload.name || 'UNNAMED'}"`)
    const { newPlayer, room, errorString } = Rooms.handleLogInEvent(logInPayload, socket.id)

    if (errorString) {
      console.warn(errorString)
    }

    if (!newPlayer || !room || !room.name) {
      socket.emit('basicEmit', { message: errorString || 'unknown log in error' })
      return
    }

    socket.join(room.name)

    socket.emit('assignId', { player: Rooms.makeSafe(newPlayer), roomName: room.name })

    if (room.type === 'Card') {
      socket.emit('tableStatus', {
        data: room.table,
        from: 'server',
        roomName: room.name,
      })
    }

    socket.emit('basicEmit', { message: `You have logged in to ${room.name} as ${newPlayer.name}`, from: '_SERVER_' })
    socket.to(room.name).emit('basicEmit', { message: `${newPlayer.name} has joined ${room.name}`, from: '_SERVER_' })

    io.to(room.name).emit('playerList', { roomName: room.name, players: room.players.map(Rooms.makeSafe) })
  }
}
