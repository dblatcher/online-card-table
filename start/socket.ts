import Rooms from 'App/services/Rooms'
import Ws from 'App/Services/Ws'
Ws.boot()

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

    socket.emit('assignId', { id: newPlayer.id, roomName: room.name })
    socket.emit('tableStatus', {
      data: room.table,
      from: 'server',
      roomName: room.name,
    })
    socket.emit('basicEmit', { message: `You are logged in to ${room.name} as new SocketedTableApp with id ${newPlayer.id}`, from: '_SERVER_' })
    socket.to(room.name).emit('basicEmit', { message: `Another SocketedTableApp has joined ${room.name} with id ${newPlayer.id}`, from: '_SERVER_' })
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
})
