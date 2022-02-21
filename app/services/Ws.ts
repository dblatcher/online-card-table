import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'

import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../../definitions/socketEvents'

class Ws {
  public io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  private booted = false

  public boot () {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
      AdonisServer.instance!,
      {
        cors: {
          origin: '*',
        },
      })
  }
}

export default new Ws()
