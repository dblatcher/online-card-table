import Rooms from 'App/services/Rooms'
import { TabulaRoomState } from 'definitions/RoomState'
import { LogInPayload } from 'Definitions/socketEvents'
import { AppSocket, TypedServer } from 'Definitions/socketTypes'

const determineTabulaRole = (room: TabulaRoomState): string => {
  if (!room.players.some(player => player.role === 'BLUE')) {
    return 'BLUE'
  }
  if (!room.players.some(player => player.role === 'GREEN')) {
    return 'GREEN'
  }
  return 'OBSERVER'
}

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

    switch (room.type) {
      case 'Card':
        socket.emit('assignId', { player: Rooms.makeSafe(newPlayer), roomName: room.name })
        socket.emit('tableStatus', {
          data: room.table,
          from: 'server',
          roomName: room.name,
        })
        socket.emit('basicEmit', { message: `You have logged in to ${room.name} as ${newPlayer.name}`, from: '_SERVER_' })
        socket.to(room.name).emit('basicEmit', { message: `${newPlayer.name} has joined ${room.name}`, from: '_SERVER_' })
        break
      case 'Tabula':
        Rooms.assignPlayerRole(determineTabulaRole(room), newPlayer.id, room.name)
        socket.emit('assignId', { player: Rooms.makeSafe(newPlayer), roomName: room.name })
        socket.emit('basicEmit', { message: `You have logged in to ${room.name} as ${newPlayer.name} (${newPlayer.role})`, from: '_SERVER_' })
        socket.to(room.name).emit('basicEmit', { message: `${newPlayer.name}(${newPlayer.role}) has joined ${room.name}`, from: '_SERVER_' })
        break
    }

    io.to(room.name).emit('playerList', { roomName: room.name, players: room.players.map(Rooms.makeSafe) })
  }
}
