/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { CardValue, cardValues, cardValueList } from './values'
import { Suit, suits, getSuitSymbol } from './suits'

type SerialisedCard = [string?, Suit?]

class Card {
  suit?: Suit
  value?: CardValue

  constructor (value?: CardValue, suit?: Suit) {
    this.suit = this.value?.noSuit ? undefined : suit
    this.value = value
  }

  get description (): string {
    if (!this.value) {
      return 'unknown card'
    }
    if (this.value.noSuit) {
      return this.value.name
    }
    return `${this.value.name} of ${this.suit}`
  }

  get symbol (): string {
    if (this.value) {
      return this.value.symbol
    }
    return '_'
  }

  get suitSymbol (): string {
    return getSuitSymbol(this.suit)
  }

  static suits = suits
  static cardValueList = cardValueList
  static value = cardValues

  serialise (): SerialisedCard {
    return [this.value?.name, this.suit]
  }

  static deserialise (serialisedCard: SerialisedCard): Card {
    const [valueName, suit] = serialisedCard
    let cardValueKey: string | number = (isNaN(Number(valueName)) ? valueName?.toUpperCase() : Number(valueName)) || ''
    return new Card(cardValues[cardValueKey], suit)
  }
}

export type { Suit, SerialisedCard }
export { Card, CardValue }
