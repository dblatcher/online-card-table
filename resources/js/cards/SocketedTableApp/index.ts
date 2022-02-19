import { TableApp } from '../TableApp'
import { Socket } from 'socket.io-client'
import { Pile } from '../pile'
import { Card } from '../card'

export class SocketedTableApp extends TableApp {
  private socket: Socket

  constructor(piles: Pile[], tableElement: Element, socket: Socket) {
    super(piles, tableElement)
    this.socket = socket

    this.socket.emit('my other event', { thisIs: 'SocketedTableApp.constructor' })
  }

  public reportState(triggeringMethodName?: string) {
    const data = this.serialise()
    console.log('emitting', triggeringMethodName, data)
    this.socket.emit('my other event', { data })
  }


  public shufflePile (pile: Pile) {
    TableApp.prototype.shufflePile.apply(this, [pile])
    this.reportState('shufflePile')
  }

  public turnOverPile(pile: Pile): void {
    TableApp.prototype.turnOverPile.apply(this, [pile])
    this.reportState('turnOverPile')
  }

  public spreadOrCollectPile(pile: Pile): void {
    const pileWasSpreadBefore = pile.spread
    TableApp.prototype.spreadOrCollectPile.apply(this, [pile])
    if (pileWasSpreadBefore !== pile.spread) {
      this.reportState('spreadOrCollectPile')
    }
  }

  // TO DO - the TableApp's method needs to return boolean(?) to say if the event resulted in a change
  // ie will be false if the methof was triggered but dropTarget !== this.tableElement
  public dropOnTableHandler(event: DragEvent) {
    TableApp.prototype.dropOnTableHandler.apply(this, [event])
    this.reportState('dropOnTableHandler')
  }

  public respondToDropInteraction(sourcePile: Pile, targetPile: Pile, sourceCard?: Card, targetCard?: Card) {
    TableApp.prototype.respondToDropInteraction.apply(this, [sourcePile, targetPile, sourceCard, targetCard])
    this.reportState('respondToDropInteraction')
  }
}
