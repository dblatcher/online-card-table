import { Player, RoomState } from 'definitions/RoomState'
import { TableStatusPayload, LogInPayload } from 'definitions/socketEvents'

class Rooms {
  private booted = false
  private state = Rooms.createInitialState()

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
    room?: RoomState,
    errorString?: string
  } {
    const { roomName, data } = tableStatusPayload
    const room = this.getRoomByName(roomName)

    if (!room) {
      return { errorString: `No room called ${roomName}` }
    }

    room.table = data
    return { room }
  }

  public handleLogInEvent (logInPayload: LogInPayload): {
    newPlayer?: Player,
    room?: RoomState,
    roomName?: string,
    errorString?: string
  } {
    const { roomName } = logInPayload
    const { newPlayer, room, errorString } = this.addNewPlayer(roomName)

    if (!newPlayer || !room) {
      return { newPlayer, room, roomName, errorString }
    }
    return { newPlayer, room, roomName }
  }

  private addNewPlayer (roomName?: string): { newPlayer?: Player, room?: RoomState, errorString?: string } {
    const room = this.getRoomByName(roomName)

    if (!room) {
      return { errorString: `There is no room called ${roomName} to addNewPlayer to.` }
    }

    const newPlayer = { id: this.getNextPlayerId() }
    room.players.push(newPlayer)
    return { newPlayer, room }
  }

  private getNextPlayerId (): string {
    const count = this.getAllPlayers().length
    return 'ID-' + (count + 1).toString() + '-00'
  }

  private getRoomByName (roomName?: string): RoomState | undefined {
    if (!roomName) {
      return undefined
    }
    return this.state[roomName]
  }

  private getAllPlayers (): Player[] {
    const players: Player[] = []
    Object.values(this.state).forEach(tableState => {
      players.push(...tableState.players)
    })
    return players
  }

  private static createInitialState (): { [index: string]: RoomState } {
    return {
      myFirstRoom: {
        table: [],
        players: [],
      },
    }
  }
}

export default new Rooms()
