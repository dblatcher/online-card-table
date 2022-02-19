type Suit = 'clubs' | 'hearts' | 'diamonds' | 'spades'
const suits: readonly Suit[] = Object.freeze(['clubs', 'hearts', 'diamonds', 'spades'])

function getSuitSymbol (suit?: Suit) {
  switch (suit) {
    case 'diamonds': return '♦'
    case 'hearts': return '♥'
    case 'clubs': return '♧'
    case 'spades': return '♠'
    default: return ''
  }
}

export {Suit, suits, getSuitSymbol}
