import { BasicEmitPayload } from 'definitions/socketEvents'

function createMessagePost (payload: BasicEmitPayload, fromMe = false): HTMLElement {
  const message = document.createElement('p')
  const senderElement = document.createElement('b')
  senderElement.innerText = fromMe ? 'ME' : payload.from || '??'
  const contentElement = document.createElement('span')
  contentElement.innerText = payload.message

  message.appendChild(senderElement)
  message.appendChild(contentElement)
  return message
}

export function addMessage (messagesElement: Element, payload: BasicEmitPayload, fromMe = false) {
  messagesElement.appendChild(createMessagePost(payload, fromMe))
  messagesElement.scrollTo(0, messagesElement.scrollHeight)
}

export function addInitialChildren (container: Element): [Element, HTMLInputElement, Element] {
  container.innerHTML = `
    <h2>Messages</h2>
    <div class="message-box__inner">
    </div>
    <div class="message-box__input">
      <input type="text"/>
      <button>send</button>
    </div>
  `

  return [
    container.querySelector('.message-box__inner'),
    container.querySelector('input'),
    container.querySelector('button'),
  ] as [Element, HTMLInputElement, Element]
}
