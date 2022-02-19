/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Pile } from '../pile'

interface PileEvents {
  drop?: EventListener
  drag?: EventListener
  click?: { (pile: Pile): void }
  rightClick?: { (pile: Pile): void }
}

interface PileInteractionButton {
  label: string
  symbol: string
  isBottom?: boolean
  isRight?: boolean
  events: PileEvents
}

export class PileInteractionController {
  pile: Pile
  events: PileEvents
  buttons: PileInteractionButton[]

  constructor (pile: Pile, events: PileEvents = {}, buttons: PileInteractionButton[] = []) {
    this.pile = pile
    this.events = events
    this.buttons = buttons
  }

  getEventsFor (controlLabel?: string) {
    return !controlLabel ? this.events : this.buttons.find(control => control.label === controlLabel)?.events
  }

  addEventListeners (element: HTMLElement, controlLabel?: string) {
    const events = this.getEventsFor(controlLabel)
    if (!events) {
      return
    }

    if (events.drop) {
      element.addEventListener('dragover', event => {
        event.preventDefault()
      })
      element.addEventListener('dragenter', event => {
        event.preventDefault()
      })
      element.addEventListener('drop', events.drop)
      element.setAttribute('droptarget', 'true')
    }

    if (events.drag) {
      element.addEventListener('dragstart', events.drag)
    }

    element.addEventListener('click', (event: PointerEvent) => {
      this.respondToClickEvent(event, controlLabel)
    })

    element.addEventListener('contextmenu', (event: PointerEvent) => {
      this.respondToClickEvent(event, controlLabel)
    })
  }

  respondToClickEvent (event: PointerEvent, controlLabel?: string) {
    event.stopPropagation()

    const clickType = event.button === 2 ? 'rightClick' : 'click'
    const events = this.getEventsFor(controlLabel)
    const handlerFunction = events ? events[clickType] : undefined

    if (handlerFunction) {
      event.preventDefault()
      handlerFunction(this.pile)
    }
  }
}
