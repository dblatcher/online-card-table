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

  removePile (pile: Pile): Pile {
    const index = this.piles.indexOf(pile)
    const pileElement = this.findElementForPile(pile)
    if (index === -1 || !pileElement) {
      throw ('cannot find pile')
    }
    const [removedPile] = this.piles.splice(index, 1)

    removedPile.cards.forEach(card => {
      this.elementToCardMap.delete(this.findElementForCard(card))
    })

    this.elementToPileMap.delete(pileElement)
    pileElement.parentElement?.removeChild(pileElement)
    return pile
  }

  serialise ():SerialisedPile[] {
    return this.piles.map(pile => pile.serialise())
  }
}

export { TableModel }
