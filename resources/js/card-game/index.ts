import { Card } from './card'
import { Pile } from './pile'
import { initialPiles } from './setUp'
import { TableApp } from './TableApp'

export function init() {
  const tableElement = document.querySelector('.table')
  if (!tableElement) {
    console.warn('NO TABLE ELEMENT')
    return
  }
  const app = new TableApp(initialPiles, tableElement)

  const myWindow = window as any
  myWindow.app = app
  myWindow.Pile = Pile
  myWindow.Card = Card

  // app.resetTo(
  //   [
  //     new Pile([
  //       new Card(Card.value[10], 'hearts'),
  //       new Card(Card.value[9], 'hearts'),
  //     ], {
  //       spread: true
  //     }),
  //   ],
  // )
}
