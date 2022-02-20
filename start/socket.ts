import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 * TO DO - validate incoming data from client
 */
Ws.io.on('connection', (socket) => {
  socket.emit('basicEmit', { message: 'Hello world' })

  socket.on('basicEmit', (payload) => {
    console.log(payload)

    if (payload.message === 'new SocketedTableApp constructed') {
      socket.emit('basicEmit', { message: 'You are a new SocketedTableApp' })
      socket.broadcast.emit('basicEmit', { message: 'Another SocketedTableApp has joined' })
    }
  })

  socket.on('tableStatus', (payload) => {
    console.log(`tableStatus received at ${Date.now()} from ${payload.from} : ${payload.data.length} piles`)

    socket.broadcast.emit('tableStatus', {
      ...payload,
      from: 'client',
    })
  })
})
