import Rooms from 'App/services/Rooms'
import Ws from 'App/Services/Ws'
import { ClientSafePlayer, Player } from 'definitions/RoomState'
Ws.boot()

const makeSafe = (player:Player): ClientSafePlayer => {
  return { ...player, socketId:undefined}
}

/**
 * Listen for incoming socket connections
 * TO DO - validate incoming data from client
 */
Ws.io.on('connection', (socket) => {
  socket.on('basicEmit', (payload) => {
    console.log(payload)
    const room = Rooms.getRoomByName(payload.roomName)
    if (room) {
      socket.to(room.name).emit('basicEmit', payload)
    }
  })

  socket.on('logIn', (logInPayload) => {
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

    socket.emit('assignId', { player:makeSafe(newPlayer), roomName: room.name })
    socket.emit('tableStatus', {
      data: room.table,
      from: 'server',
      roomName: room.name,
    })
    socket.emit('basicEmit', { message: `You are logged in to ${room.name} as new SocketedTableApp with id ${newPlayer.id}`, from: '_SERVER_' })
    socket.to(room.name).emit('basicEmit', { message: `Another SocketedTableApp has joined ${room.name} with id ${newPlayer.id}`, from: '_SERVER_' })

    Ws.io.to(room.name).emit('playerList',{roomName:room.name, players: room.players.map(makeSafe)})
  })

  socket.on('tableStatus', (tableStatusPayload) => {
    console.log(`tableStatus for "${tableStatusPayload.roomName}" received at ${Date.now()} from "${tableStatusPayload.from}" : ${tableStatusPayload.data.length} piles`)
    const { room, errorString } = Rooms.handleTableStatusEvent(tableStatusPayload)

    if (errorString) {
      console.warn(errorString)
    }

    if (!room) {
      socket.emit('basicEmit', { message: errorString || 'unknown table status update error', from: '_SERVER_' })
      return
    }

    socket.to(tableStatusPayload.roomName).emit('tableStatus', {
      data: room.table,
      from: '_SERVER_',
      roomName: tableStatusPayload.roomName,
    })
  })

  socket.on('disconnect', (reason:string):void => {
    console.log('disconnected', reason, socket.id)

    const {leavingPlayer,room,errorString} = Rooms.handleDisconnect(socket.id)

    if (errorString) {
      console.warn(errorString)
    }

    if (!leavingPlayer || !room) {
      return
    }

    Ws.io.to(room.name).emit('basicEmit', {
      from:'_SERVER_',
      message: `${leavingPlayer.name || leavingPlayer.id} has disconnected`,
    })
    Ws.io.to(room.name).emit('playerList',{roomName:room.name, players: room.players.map(makeSafe)})
  })
})
