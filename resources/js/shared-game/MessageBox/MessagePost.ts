import { BasicEmitPayload } from 'definitions/socketEvents'
import { html } from 'htm/preact'

export default function MessagePost(props: {
  message: BasicEmitPayload
}) {
  const { message } = props
  return html`<p>
  <b>${message.from}</b>
  <span>${message.message}</span>
</p>`
}
