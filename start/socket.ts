import SharedGames from 'App/services/SharedGames'
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

  socket.on('logIn', (payload) => {
    const { roomName = 'default' } = payload
    const newPlayer = SharedGames.addNewPlayer(roomName)

    if (!newPlayer) {
      return
    }

    socket.emit('basicEmit', { message: `You are logged in as new SocketedTableApp with id ${newPlayer.id}`,from:'_SERVER_' })
    socket.emit('assignId', { id: newPlayer.id })
    socket.emit('tableStatus', {
      data: SharedGames.state[roomName].table,
      from: 'server',
    })
    socket.broadcast.emit('basicEmit', { message: `Another SocketedTableApp has joined with id ${newPlayer.id}`, from:'_SERVER_' })
  })

  socket.on('tableStatus', (payload) => {
    console.log(`tableStatus received at ${Date.now()} from ${payload.from} : ${payload.data.length} piles`)
    SharedGames.state['default'].table = payload.data
    socket.broadcast.emit('tableStatus', {
      data: SharedGames.state['default'].table,
      from: 'server',
    })
  })
})
