import { Player, SharedGameState } from 'definitions/SharedGameState'

class TableStates {
  private booted = false
  public state = TableStates.createInitialState()

  public boot () {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
  }

  public addNewPlayer (roomName = 'default'):Player | undefined {
    const room = this.state[roomName]

    if (!room) {
      console.warn(`There is no room called ${roomName} to addNewPlayer to.`)
      return
    }

    const newPlayer = { id: this.getNextPlayerId() }
    room.players.push(newPlayer)
    return newPlayer
  }

  public getNextPlayerId (): string {
    const count = this.getAllPlayers().length
    return 'ID-' + (count + 1).toString() + '-00'
  }

  private getAllPlayers (): Player[] {
    const players: Player[] = []
    Object.values(this.state).forEach(tableState => {
      players.push(...tableState.players)
    })
    return players
  }

  private static createInitialState (): { [index: string]: SharedGameState } {
    return {
      default: {
        table: [],
        players: [],
      },
    }
  }
}

export default new TableStates()
