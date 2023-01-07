import { Player } from 'definitions/types'
import { CardRoomState } from 'definitions/RoomState'
import { TableStatusPayload } from 'definitions/socketEvents'
import Rooms from './Rooms'

class CardTables {
  public handleTableStatusEvent(tableStatusPayload: TableStatusPayload): {
    room?: CardRoomState
    player?: Player
    errorString?: string
  } {
    const { roomName, data, from: playerId } = tableStatusPayload
    const room = Rooms.getRoomByName(roomName)

    if (!room || room.type !== 'Card') {
      return { errorString: `No card room called ${roomName}` }
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
