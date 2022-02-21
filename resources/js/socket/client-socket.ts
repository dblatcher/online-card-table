import { ClientToServerEvents, ServerToClientEvents } from 'definitions/socketEvents'
import { io, Socket } from 'socket.io-client'

export function openClientSocket (logAllBasicEmits = true) {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io()

  if (logAllBasicEmits) {
    socket.on('basicEmit', (payload) => {
      console.log('basicEmit message:', payload.message)
    })
  }

  return socket
}
