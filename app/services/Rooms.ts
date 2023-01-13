import { RoomState } from 'definitions/RoomState'
import { ClientSafePlayer, Player } from 'definitions/types'
import { LogInPayload } from 'definitions/socketEvents'
import { TabulaGame } from '../../definitions/tabula/TabulaGame'

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

  public assignPlayerRole (role: string, playerId: string, roomName: string): {
    player?: Player,
    room?: RoomState,
    errorString?: string
  } {
    const room = this.getRoomByName(roomName)

    if (!room) {
      return { errorString: `There is no room called ${roomName} to assign a player role in.` }
    }

    const player = room.players.find(player => player.id === playerId)
    if (!player) {
      return { errorString: `There is no player [${playerId}] in ${roomName} to assign a role to.` }
    }

    player.role = role

    return { player, room }
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

    room.players.splice(room.players.indexOf(leavingPlayer), 1)
    return { leavingPlayer, room }
  }

  public getRoomList (): { name: string, playerCount: number, type: 'Card' | 'Tabula' }[] {
    return this.state.map(room => {
      return {
        name: room.name, playerCount: room.players.length, type: room.type,
      }
    })
  }

  private getNextPlayerId (): string {
    const players = this.getAllPlayers()
    const generate = () => 'ID-p' + Math.random().toString()
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

  public getPlayerAndRoom (playerId: string): { player: Player, room: RoomState } | undefined {
    const room = this.state.find(room => room.players.some(player => player.id === playerId))
    if (room) {
      const player = room.players.find(player => player.id === playerId)
      if (player) {
        return { room, player }
      }
    }
    return undefined
  }

  private getAllPlayers (): Player[] {
    const players: Player[] = []
    this.state.forEach(room => {
      players.push(...room.players)
    })
    return players
  }

  private static createInitialState (): RoomState[] {
    return []
  }

  public addRoom (name: string, type: RoomState['type']): boolean {
    if (this.state.some(existingRoom => existingRoom.name === name)) {
      console.log(`room ${name} already exist!!`)
      return false
    }
    const newRoom = this.buildRoom(name, type)
    this.state.push(newRoom)
    console.log(`${type} room ${newRoom.name} added`)
    return true
  }

  private buildRoom (name: string, type: RoomState['type']): RoomState {
    const newRoom: RoomState = type === 'Card'
      ? {
        name,
        type,
        players: [],
        table: [],
      } : {
        name,
        type,
        players: [],
        game: TabulaGame.initial(),
      }
    return newRoom
  }

  public makeSafe (player: Player): ClientSafePlayer {
    return { ...player, socketId: undefined }
  }
}

export default new Rooms()
