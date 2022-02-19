import { ClientToServerEvents, ServerToClientEvents } from 'definitions/socket'
import { io, Socket } from 'socket.io-client'

export function openClientSocket () {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io()

  socket.on('basicEmit', (payload) => {
    console.log('received a basicEmit:', payload)
    socket.emit('basicEmit', { message: `message acknowledged at ${Date.now()}` })
  })

  return socket
}
