/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Card, SerialisedCard } from '../card'

interface PileConfig {
  faceDown?: boolean
  spread?: boolean
  x?: number
  y?: number
}

interface SerialisedPile extends Required<PileConfig> {
  cards: SerialisedCard[]
};

class Pile implements Required<PileConfig> {
  cards: Card[]
  faceDown: boolean
  spread: boolean
  x: number
  y: number

  constructor (cards: Card[] = [], config: PileConfig = {}) {
    const { faceDown = false, spread = false, x = 0, y = 0 } = config

    this.cards = cards
    this.faceDown = faceDown
    this.spread = spread
    this.x = x
    this.y = y
  }

  static ofNewDeck (config: PileConfig = {}): Pile {
    const cards: Card[] = []
    Card.suits.forEach(suit => {
      Card.cardValueList.filter(cardValue => !cardValue.noSuit).forEach(value => {
        cards.push(new Card(value, suit))
      })
    })

    return new Pile(cards, config)
  }

  static ofNewDeckWithJokers (config: PileConfig = {}): Pile {
    const pile = Pile.ofNewDeck(config)
    pile.cards.push(new Card(Card.value.JOKER))
    pile.cards.push(new Card(Card.value.JOKER))
    return pile
  }

  get descriptions () {
    return this.cards.map(card => card.description)
  }

  shuffle (): Pile {
    const tempPile = this.cards.splice(0, this.cards.length)
    while (tempPile.length > 0) {
      this.cards.push(
        ...tempPile.splice(Math.floor(Math.random() * tempPile.length), 1)
      )
    }
    return this
  }

  turnOver (): Pile {
    this.cards.reverse()
    this.faceDown = !this.faceDown
    return this
  }

  flipCards (): Pile {
    this.faceDown = !this.faceDown
    return this
  }

  /**
     * Remove a card from the pile, defaulting to the first card
     * @param [cardOrIndex] a card in the pile or the index of a card
     * @returns the card removed from the pile
     */
  pickOut (cardOrIndex?: Card | number): Card | undefined {
    let cardIndex = 0

    if (typeof cardOrIndex === 'number') {
      if (cardOrIndex >= this.cards.length || cardIndex < 0) {
        return undefined
      }
      cardIndex = cardOrIndex
    } else if (cardOrIndex instanceof Card) {
      cardIndex = this.cards.indexOf(cardOrIndex)
      if (cardIndex === -1) {
        return undefined
      }
    }

    return this.cards.splice(cardIndex, 1)[0]
  }

  dealTo (targetPile: Pile, dealtCardOrIndex?: Card | number, indexInTargetPileToPlaceAt = 0): Pile {
    if (this.cards.length === 0) {
      return this
    }

    const cardToDeal = this.pickOut(dealtCardOrIndex)

    if (!cardToDeal) {
      console.warn('card does not exist in pile', dealtCardOrIndex, Pile)
      return this
    }

    if (indexInTargetPileToPlaceAt > targetPile.cards.length || indexInTargetPileToPlaceAt < 0) {
      console.warn(`indexInTargetPileToPlaceAt ${indexInTargetPileToPlaceAt} is out of bounds, defaulting to 0 (top)`)
      indexInTargetPileToPlaceAt = 0
    }

    targetPile.cards.splice(indexInTargetPileToPlaceAt, 0, cardToDeal)
    return this
  }

  serialise (): SerialisedPile {
    return {
      cards: this.cards.map(card => card.serialise()),
      faceDown: this.faceDown,
      spread: this.spread,
      x: this.x,
      y: this.y,
    }
  }

  static deserialise (serialisedPile: SerialisedPile): Pile {
    const { cards, faceDown, spread, x, y } = serialisedPile
    return new Pile(cards.map(serialisedCard => Card.deserialise(serialisedCard)), { faceDown, spread, x, y })
  }
}

export { Pile, SerialisedPile }
