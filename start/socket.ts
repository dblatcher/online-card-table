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
  })

  socket.on('logIn', (logInPayload) => {
    console.log(`logIn for "${logInPayload.roomName}" received at ${Date.now()} from "${logInPayload.name || 'UNNAMED'}"`)
    const { newPlayer, room, roomName, errorString } = Rooms.handleLogInEvent(logInPayload)

    if (errorString) {
      console.warn(errorString)
    }

    if (!newPlayer || !room || !roomName) {
      socket.emit('basicEmit', { message: errorString || 'unknown log in error' })
      return
    }

    socket.emit('basicEmit', { message: `You are logged in as new SocketedTableApp with id ${newPlayer.id}`, from: '_SERVER_' })
    socket.emit('assignId', { id: newPlayer.id, roomName })
    socket.emit('tableStatus', {
      data: room.table,
      from: 'server',
      roomName,
    })
    socket.broadcast.emit('basicEmit', { message: `Another SocketedTableApp has joined ${roomName} with id ${newPlayer.id}`, from: '_SERVER_' })
  })

  socket.on('tableStatus', (tableStatusPayload) => {
    console.log(`tableStatus for "${tableStatusPayload.roomName}" received at ${Date.now()} from "${tableStatusPayload.from}" : ${tableStatusPayload.data.length} piles`)
    const {room, errorString} = Rooms.handleTableStatusEvent(tableStatusPayload)

    if (errorString) {
      console.warn(errorString)
    }

    if (!room) {
      socket.emit('basicEmit', { message: errorString || 'unknown table status update error' })
      return
    }

    socket.broadcast.emit('tableStatus', {
      data: room.table,
      from: 'server',
      roomName: tableStatusPayload.roomName,
    })
  })
})
