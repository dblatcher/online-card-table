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
    room?: RoomState
    player?: Player
    errorString?: string
  } {
    const { roomName, data, from: playerId } = tableStatusPayload
    const room = this.getRoomByName(roomName)

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

  public handleLogInEvent (logInPayload: LogInPayload): {
    newPlayer?: Player,
    room?: RoomState,
    errorString?: string
  } {
    const { roomName } = logInPayload
    const { newPlayer, room, errorString } = this.addNewPlayer(roomName)

    if (!newPlayer || !room) {
      return { newPlayer, room, errorString }
    }
    return { newPlayer, room }
  }

  public getRoomList (): { name: string, playerCount: number }[] {
    return this.state.map(room => {
      return {
        name: room.name, playerCount: room.players.length,
      }
    })
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

  public getRoomByName (roomName?: string): RoomState | undefined {
    if (!roomName) {
      return undefined
    }
    return this.state.find(room => room.name === roomName)
  }

  private getAllPlayers (): Player[] {
    const players: Player[] = []
    this.state.forEach(room => {
      players.push(...room.players)
    })
    return players
  }

  private static createInitialState (): RoomState[] {
    const room1: RoomState = {
      name: 'my-first-room',
      table: [],
      players: [],
    }
    const room2: RoomState = {
      name: 'my-second-room',
      table: [],
      players: [],
    }

    return [room1, room2]
  }
}

export default new Rooms()