import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' })

  socket.on('my other event', (data) => {
    console.log(data)

    if (data.thisIs && data.thisIs === 'SocketedTableApp.constructor') {
      socket.emit('news',{hello: 'You are a have a new SocketedTableApp'})
      socket.broadcast.emit('news',{hello: 'Another SocketedTableApp has joined'})
    }
  })
})
