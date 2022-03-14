import Ws from 'App/Services/Ws'
import { makeDisconnectHandler } from 'App/socket-handlers/disconnectHandler'
import { makeBasicEmitHandler } from 'App/socket-handlers/handleBasicEmit'
import { makeLoginHandler } from 'App/socket-handlers/loginHandler'
import { makeTableStatusHandler } from 'App/socket-handlers/tableStatusHandler'
Ws.boot()

/**
 * Listen for incoming socket connections
 * TO DO - validate incoming data from client
 */
Ws.io.on('connection', (socket) => {
  socket.on('basicEmit', makeBasicEmitHandler(socket))
  socket.on('logIn', makeLoginHandler(socket, Ws.io))
  socket.on('tableStatus',makeTableStatusHandler(socket))
  socket.on('disconnect', makeDisconnectHandler(socket, Ws.io))
})
