import { Card } from '../card'
import { Pile } from '../pile'
import { PileInteractionController } from './PileInteractionController'

function makeCardElement (
  card: Card,
  faceDown = false,
  cardDragHandler?: EventListener,
  dropOnCardHandler?: EventListener
): HTMLElement {
  const cardElement = document.createElement('figure')
  cardElement.classList.add('card')
  if (faceDown) {
    cardElement.classList.add('flip')
  }

  if (card.suit) {
    cardElement.setAttribute('suit', card.suit)
  }

  const face = document.createElement('section')
  face.classList.add('face')
  face.innerHTML = `
    <span class="top-value">
        <span>${card.suitSymbol}</span>
        <span>${card.symbol}</span>
    </span>
    <span class="middle">${card.symbol}</span>
    <span class="bottom-value">
        <span>${card.suitSymbol}</span>
        <span>${card.symbol}</span>
    </span>
    `
  cardElement.appendChild(face)

  const back = document.createElement('section')
  back.classList.add('back')
  cardElement.appendChild(back)

  if (cardDragHandler) {
    cardElement.setAttribute('draggable', 'true')
    cardElement.addEventListener('dragstart', cardDragHandler)
  }

  if (dropOnCardHandler) {
    cardElement.addEventListener('dragover', event => {
      event.preventDefault()
    })
    cardElement.addEventListener('dragenter', event => {
      event.preventDefault()
    })
    cardElement.addEventListener('drop', dropOnCardHandler)
    cardElement.setAttribute('droptarget', 'true')
  }

  return cardElement
}

function makeControlElement (
  draggable: boolean,
  symbol?: string,
  right = false,
  bottom = false,
): HTMLElement {
  const controlElement = document.createElement('div')
  controlElement.classList.add('pile-control')
  if (bottom) {
    controlElement.classList.add('pile-control--bottom')
  }
  if (right) {
    controlElement.classList.add('pile-control--right')
  }

  if (draggable) {
    controlElement.setAttribute('draggable', 'true')
  }

  controlElement.innerHTML = `<span>${symbol}</span>`

  return controlElement
}

function makePileElement (
  pileInteractionController: PileInteractionController
): HTMLElement {
  const { pile } = pileInteractionController
  const pileElement = document.createElement('div')
  pileElement.classList.add('pile')
  setPileElementAttributes(pile, pileElement)
  setPileElementPosition(pile, pileElement)

  pileInteractionController.addEventListeners(pileElement)

  pileInteractionController.buttons.forEach(button => {
    const controlElement = makeControlElement(!!button.events.drag, button.symbol, button.isRight, button.isBottom)
    pileInteractionController.addEventListeners(controlElement, button.label)
    pileElement.appendChild(controlElement)
  })

  return pileElement
}

function getQuantityAttribute (quantity: number): string {
  if (quantity <= 1) {
    return 'none'
  }
  if (quantity <= 5) {
    return 'small'
  }
  if (quantity <= 10) {
    return 'medium'
  }
  if (quantity <= 15) {
    return 'big'
  }
  return 'huge'
}

function setPileElementPosition (pile: Pile, pileElement: Element) {
  (pileElement as HTMLElement).style.top = `${pile.y}px`;
  (pileElement as HTMLElement).style.left = `${pile.x}px`
}

function setPileElementAttributes (pile: Pile, pileElement: Element) {
  if (pile.spread) {
    pileElement.classList.add('spread')
  } else {
    pileElement.classList.remove('spread')
  }

  if (pile.cards.length === 0) {
    pileElement.classList.add('no-cards')
  } else {
    pileElement.classList.remove('no-cards')
  }

  pileElement.setAttribute('quantity', getQuantityAttribute(pile.cards.length))
}

function removeCardElements (pileElement: Element) {
  Array.from(pileElement.querySelectorAll('.card')).forEach(cardElement => {
    pileElement.removeChild(cardElement)
  })
}

function addCardElementToPileElement (
  pileElement: Element,
  cardElement: Element,
  position?: 'BOTTOM' | 'TOP' | number
) {
  //first card in the pile.cards array is the top card
  // so the last cardElements must be in reversed order (so the last element to be rendered is the one on top)
  if (position === 'BOTTOM') {
    pileElement.prepend(cardElement)
  } else if (typeof position === 'number') {
    const cardElements = Array.from(pileElement.querySelectorAll('.card'))
    if (position < 0 || position > cardElements.length) {
      console.warn(`position ${position} is out of bounds, placing on top`)
      pileElement.appendChild(cardElement)
      return
    }
    const indexOfCardToInsertNewCardBefore = cardElements.length - position
    pileElement.insertBefore(cardElement, cardElements[indexOfCardToInsertNewCardBefore])
  } else {
    pileElement.appendChild(cardElement)
  }
}

export {
  makeCardElement, makePileElement,
  setPileElementAttributes, removeCardElements, addCardElementToPileElement, setPileElementPosition,
}
