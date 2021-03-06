import { TableApp } from '../../card-game/TableApp'
import { Socket } from 'socket.io-client'
import { Pile } from '../../card-game/pile'
import { Card } from '../../card-game/card'
import { setPileElementAttributes } from '../../card-game/TableApp/elements'
import {
  ServerToClientEvents, ClientToServerEvents, TableStatusPayload, AssignIdPayload,
} from 'definitions/socketEvents'
import { DropOnPileAction, DropOnTableAction, TableAction } from 'definitions/cardAndPile'

export class SocketedTableApp extends TableApp {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>
  public id?: string
  public roomName?: string

  constructor (
    piles: Pile[],
    tableElement: Element,
    socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  ) {
    super(piles, tableElement)
    this.socket = socket
    this.socket.on('tableStatus', this.handleTableStatus.bind(this))
    this.socket.on('assignId', this.handleAssignId.bind(this))
  }

  public reportState (action: TableAction = { type: 'reset' }) {
    const { id, roomName } = this

    if (!id || !roomName) {
      console.warn('Cannot report state', { id, roomName })
      return
    }

    const data = this.serialise()
    console.log('emitting', data, action)
    this.socket.emit('tableStatus', {
      data,
      from: id,
      roomName,
      action: action,
    })
  }

  public resetTo (piles?: Pile[]): void {
    TableApp.prototype.resetTo.apply(this,[piles])
    this.reportState()
  }

  public beResetTo (piles?: Pile[]): void {
    TableApp.prototype.resetTo.apply(this,[piles])
  }

  public handleAssignId (payload: AssignIdPayload): void {
    console.log('handleAssignId', payload)
    this.roomName = payload.roomName
    this.id = payload.player.id
  }

  public handleTableStatus (payload: TableStatusPayload): void {
    const newPiles = payload.data.map(Pile.deserialise)
    const action = payload.action || { type: 'reset' }

    switch (action.type) {
      case 'shufflePile':
        return this.beShuffled(newPiles, action.pileIndex)
      case 'turnOverPile':
        return this.beTurnedOver(newPiles, action.pileIndex)
      case 'spreadOrCollectPile':
        return this.beSpreadOrCollected(newPiles, action.pileIndex)
      case 'dropOnPile':
        return this.haveCardMovedToPile(action)
      case 'dropOnTable':
        return this.haveCardMovedToTable(action)
      case 'reset':
      default:
        return this.beResetTo(newPiles)
    }
  }

  public beShuffled (newPiles: Pile[], index: number) {
    console.log(`pile [${index}] should shuffle`)
    const pile = this.piles[index]
    const pileElement = this.findElementForPile(pile) as HTMLElement

    pile.cards = newPiles[index].cards
    this.removeAndRenderCards(pile, pileElement)
    this.runShuffleAnimation(pile)
  }

  public shufflePile (pile: Pile) {
    TableApp.prototype.shufflePile.apply(this, [pile])
    this.reportState({ type: 'shufflePile', pileIndex: this.piles.indexOf(pile) })
  }

  public beTurnedOver (newPiles: Pile[], index: number) {
    console.log(`pile [${index}] should turn over`)
    const pile = this.piles[index]
    const pileElement = this.findElementForPile(pile) as HTMLElement

    const stateChange = async () => {
      await new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          pile.cards = newPiles[index].cards
          pile.faceDown = newPiles[index].faceDown
          setPileElementAttributes(pile, pileElement)
          this.removeAndRenderCards(pile, pileElement)
          resolve()
        })
      })
    }
    this.runTurnOverAnimation(pile, stateChange)
  }

  public turnOverPile (pile: Pile): void {
    TableApp.prototype.turnOverPile.apply(this, [pile])
    this.reportState({ type: 'turnOverPile', pileIndex: this.piles.indexOf(pile) })
  }

  public beSpreadOrCollected (newPiles: Pile[], index: number) {
    console.log(`pile [${index}] should spread or collect over`)
    const pile = this.piles[index]

    const stateChange = async () => {
      await new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          pile.spread = newPiles[index].spread
          if (pile.cards.length === 0) {
            pile.spread = false
          }
          setPileElementAttributes(pile, this.findElementForPile(pile))
          resolve()
        })
      })
    }

    this.runSpreadOrCollectAnimation(pile, stateChange)
  }

  public spreadOrCollectPile (pile: Pile): void {
    const pileWasSpreadBefore = pile.spread
    TableApp.prototype.spreadOrCollectPile.apply(this, [pile])
    if (pileWasSpreadBefore !== pile.spread) {
      this.reportState({ type: 'spreadOrCollectPile', pileIndex: this.piles.indexOf(pile) })
    }
  }

  protected haveCardMovedToPile (action: DropOnPileAction) {
    const { targetPileIndex, targetCardIndex, sourcePileIndex, sourceCardIndex } = action
    const targetPile = this.piles[targetPileIndex]
    const targetCard = typeof targetCardIndex === 'number' ? targetPile.cards[targetCardIndex] : undefined
    const sourcePile = this.piles[sourcePileIndex]
    const sourceCard = typeof sourceCardIndex === 'number' ? sourcePile.cards[sourceCardIndex] : undefined

    if (!targetPile || !sourceCard) {
      return
    }

    this.moveCard(sourceCard, sourcePile, targetPile, targetCard)
  }

  protected haveCardMovedToTable (action: DropOnTableAction) {
    const { sourcePileIndex, sourceCardIndex, altKey, tableX, tableY } = action
    const sourcePile = typeof sourcePileIndex === 'number' ?this.piles[sourcePileIndex] : undefined
    const sourceCard = sourcePile && typeof sourceCardIndex === 'number' ? sourcePile.cards[sourceCardIndex] : undefined

    if (sourceCard && sourcePile) {
      const newPile = this.makeNewPileFrom(sourcePile, tableX, tableY, altKey)
      this.moveCard(sourceCard, sourcePile, newPile)
    } else if (sourcePile) {
      this.movePile(sourcePile, tableX, tableY)
    }
  }

  public respondToDropOnTableInteraction (
    sourceCard: Card | undefined, sourcePile: Pile | undefined, tableX: number, tableY: number, altKey: boolean
  ): void {
    const action:DropOnTableAction = {
      type: 'dropOnTable',
      sourceCardIndex: sourceCard ? sourcePile?.cards.indexOf(sourceCard) : undefined,
      sourcePileIndex: sourcePile ? this.piles.indexOf(sourcePile) : undefined,
      tableX, tableY, altKey,
    }
    TableApp.prototype.respondToDropOnTableInteraction.apply(this, [sourceCard, sourcePile, tableX, tableY, altKey])
    this.reportState(action)
  }

  public respondToDropOnPileInteraction (
    sourcePile: Pile, targetPile: Pile, sourceCard?: Card, targetCard?: Card
  ): void {
    const action:DropOnPileAction = {
      type: 'dropOnPile',
      sourceCardIndex: sourceCard ? sourcePile.cards.indexOf(sourceCard) : undefined,
      sourcePileIndex: this.piles.indexOf(sourcePile),
      targetPileIndex: this.piles.indexOf(targetPile),
      targetCardIndex: targetCard ? targetPile.cards.indexOf(targetCard) : undefined,
    }

    TableApp.prototype.respondToDropOnPileInteraction.apply(this, [sourcePile, targetPile, sourceCard, targetCard])
    this.reportState(action)
  }
}
