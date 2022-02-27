import { BasicEmitPayload } from "definitions/socketEvents";

export function createMessagePost(payload: BasicEmitPayload): HTMLElement {
  const message = document.createElement('p')
  const senderElement = document.createElement('b')
  senderElement.innerText = payload.from || '??'
  const contentElement = document.createElement('span')
  contentElement.innerText = payload.message

  message.appendChild(senderElement)
  message.appendChild(contentElement)
  return message
}
