import SharedGames from 'App/services/SharedGames'
import Ws from 'App/Services/Ws'
import { SharedGameState } from 'definitions/SharedGameState'
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
    const { roomName } = logInPayload

    if (!roomName) {
      socket.emit('basicEmit', { message: 'Failed to log in - no roomName provided', from: '_SERVER_' })
      return
    }

    const [newPlayer, room] = SharedGames.addNewPlayer(roomName)

    if (!newPlayer || !room) {
      socket.emit('basicEmit', { message: `Failed to log in to  ${roomName}`, from: '_SERVER_' })
      return
    }

    socket.emit('basicEmit', { message: `You are logged in as new SocketedTableApp with id ${newPlayer.id}`, from: '_SERVER_' })
    socket.emit('assignId', { id: newPlayer.id, roomName: roomName })
    socket.emit('tableStatus', {
      data: room.table,
      from: 'server',
      roomName,
    })
    socket.broadcast.emit('basicEmit', { message: `Another SocketedTableApp has joined ${roomName} with id ${newPlayer.id}`, from: '_SERVER_' })
  })

  socket.on('tableStatus', (tableStatusPayload) => {
    const { roomName, from: playerName, data } = tableStatusPayload

    if (!roomName) {
      console.warn(`No room name provided on tableStatus  by ${playerName}`)
      return
    }

    console.log(`tableStatus for "${roomName}" received at ${Date.now()} from "${playerName}" : ${data.length} piles`)
    const room: SharedGameState | undefined = SharedGames.state[roomName]

    if (!room) {
      console.warn(`No room called ${roomName}`)
      return
    }

    room.table = data
    socket.broadcast.emit('tableStatus', {
      data: room.table,
      from: 'server',
      roomName,
    })
  })
})
