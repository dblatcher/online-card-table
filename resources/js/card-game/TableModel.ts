/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Card } from './card'
import { Pile, SerialisedPile } from './pile'

class TableModel {
  piles:Pile[]
  tableElement: Element
  elementToPileMap: Map<Element, Pile>
  elementToCardMap: Map<Element, Card>

  constructor (piles:Pile[], tableElement: Element) {
    this.piles = piles
    this.tableElement = tableElement
    this.elementToPileMap = new Map<Element, Pile>()
    this.elementToCardMap = new Map<Element, Card>()
  }

  findPileContainingCard (card: Card): Pile | undefined {
    return this.piles.find(pile => pile.cards.includes(card))
  }

  findElementForPile (sourcePile: Pile): Element {
    let sourcePileElement
    this.elementToPileMap.forEach((pile, pileElement) => {
      if (pile === sourcePile) {
        sourcePileElement = pileElement
      }
    })
    return sourcePileElement
  }

  findElementForCard (sourceCard: Card): Element {
    let sourcePileElement
    this.elementToCardMap.forEach((card, cardElement) => {
      if (card === sourceCard) {
        sourcePileElement = cardElement
      }
    })
    return sourcePileElement
  }

  serialise ():SerialisedPile[] {
    return this.piles.map(pile => pile.serialise())
  }
}

export { TableModel }
