import { Player, CardRoomState } from 'definitions/RoomState'
import { TableStatusPayload } from 'definitions/socketEvents'
import Rooms from './Rooms'

class CardTables {
  private booted = false

  public boot () {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
  }

  public handleTableStatusEvent (tableStatusPayload: TableStatusPayload): {
    room?: CardRoomState
    player?: Player
    errorString?: string
  } {
    const { roomName, data, from: playerId } = tableStatusPayload
    const room = Rooms.getRoomByName(roomName)

    if (!room) {
      return { errorString: `No room called ${roomName}` }
    }

    const player = room.players.find(player => player.id === playerId)

    if (!player) {
      return { errorString: `room "${roomName}" does not have player with id "${playerId}"` }
    }

    room.table = data
    return { room, player }
  }
}

export default new CardTables()
