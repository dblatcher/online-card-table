import { Card } from './card'
import { Pile } from './pile'

const initialPiles: Pile[] = [
  Pile.ofNewDeckWithJokers({x:10,y:10}),

  new Pile([
    new Card(Card.value['KING'], 'clubs'),
    // new Card(Card.value['KING'], 'hearts'),
    // new Card(Card.value['KING'], 'diamonds'),
    // new Card(Card.value['KING'], 'hearts'),
    new Card(Card.value['JACK'], 'diamonds'),
    new Card(Card.value['JACK'], 'hearts'),
  ],{
    x:40, y:120,spread:true,
  }),
]

const initialPiles2 = [
  new Pile([
    new Card(Card.value['QUEEN'], 'clubs'),
    new Card(Card.value['QUEEN'], 'hearts'),
    new Card(Card.value['QUEEN'], 'diamonds'),
    new Card(Card.value[4], 'diamonds'),
    new Card(Card.value[7], 'diamonds'),
  ], { spread: true }),
  new Pile([
    new Card(Card.value[2], 'clubs'),
    new Card(Card.value[3], 'hearts'),
    new Card(Card.value[10], 'diamonds'),
    new Card(Card.value[9], 'diamonds'),
    new Card(Card.value[2], 'diamonds'),
  ], { faceDown: true }),
  new Pile([
    // new Card(),
  ]),
  new Pile([
    // new Card(Card.value["JACK"], "diamonds"),
  ]),
  Pile.ofNewDeckWithJokers(),
]

export { initialPiles, initialPiles2 }
