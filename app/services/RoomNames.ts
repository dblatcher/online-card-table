import { RoomNameSuggestion } from 'definitions/apiTypes'
import Rooms from './Rooms'

const seedWords = [
  'horse', 'dog', 'garden', 'tulip', 'pasta', 'house', 'world', 'coat', 'glove', 'goat', 'cat','bird','tree',
]

const randomIndex = (list: unknown[]): number => (Math.ceil(Math.random() * list.length)) - 1
const pickAtRandom = (list: string[]): string => list[randomIndex(list)]
const pickOutAtRandom = (list: string[]): string => list.splice(randomIndex(list), 1)[0]

class RoomNames {
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

  public async suggest (): Promise<RoomNameSuggestion> {
    const names = Rooms.getRoomList().map(room => room.name)
    const availableComponents = [...seedWords]
    const components: string[] = [
      pickOutAtRandom(availableComponents),
      pickOutAtRandom(availableComponents),
      pickOutAtRandom(availableComponents),
    ]
    while (names.includes(components.join('-'))) {
      components.push(pickAtRandom(seedWords))
    }
    return { suggestion: components.join('-') }
  }
}

export default new RoomNames()
