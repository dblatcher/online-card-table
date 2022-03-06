
import { html } from 'htm/preact'

export default function InputControl (props: {
  send: Function
  update: Function
  value: string
  buttonText?: string
}) {
  const { send, value,update, buttonText='send' } = props

  const handleInput = (event) => {
    update(event.target.value)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      send()
    }
  }

  return html`
  <div class="message-box__input">
    <input type="text" value=${value} oninput=${handleInput} onkeypress=${handleKeyPress} />
    <button onclick=${send}>${buttonText}</button>
  </div>
`
}
