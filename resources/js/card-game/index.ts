import { initialPiles } from './setUp'
import { TableApp } from './TableApp'

export function init () {
  const tableElement = document.querySelector('.table')
  if (!tableElement) {
    console.warn('NO TABLE ELEMENT')
    return
  }
  const app = new TableApp(initialPiles, tableElement)

  const myWindow = window as any
  myWindow.app = app
}
