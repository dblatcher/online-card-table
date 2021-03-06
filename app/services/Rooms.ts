import { ClientSafePlayer, Player, RoomState } from 'definitions/RoomState'
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

  public handleLogInEvent (logInPayload: LogInPayload, socketId: string): {
    newPlayer?: Player,
    room?: RoomState,
    errorString?: string
  } {
    const { roomName, name } = logInPayload
    const room = this.getRoomByName(roomName)

    if (!room) {
      return { errorString: `There is no room called ${roomName} to addNewPlayer to.` }
    }

    const id = this.getNextPlayerId()
    const newPlayer: Player = { id, socketId, name }
    room.players.push(newPlayer)
    return { newPlayer, room }
  }

  public handleDisconnect (socketId: string): {
    leavingPlayer?: Player,
    room?: RoomState,
    errorString?: string
  } {
    const room = this.state.find(room => room.players.some(player => player.socketId === socketId))
    if (!room) {
      return { errorString: `Cannot find a room with a player with socketId "${socketId}"` }
    }
    const leavingPlayer = room.players.find(player => player.socketId === socketId)
    if (!leavingPlayer) {
      return { errorString: `Cannot find a player with socketId "${socketId}"` }
    }

    room.players.splice(room.players.indexOf(leavingPlayer),1)
    return { leavingPlayer, room }
  }

  public getRoomList (): { name: string, playerCount: number }[] {
    return this.state.map(room => {
      return {
        name: room.name, playerCount: room.players.length,
      }
    })
  }

  private getNextPlayerId (): string {
    const players = this.getAllPlayers()
    const generate = () =>'ID-p' + Math.random().toString()
    let possibleId = generate()

    while (players.find(player => player.id === possibleId)) {
      possibleId = generate()
    }

    return possibleId
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

  public makeSafe (player:Player): ClientSafePlayer {
    return { ...player, socketId:undefined}
  }
}

export default new Rooms()
