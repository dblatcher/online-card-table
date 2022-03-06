import { ClientSafePlayer } from 'definitions/RoomState'
import { BasicEmitPayload } from 'definitions/socketEvents'
import { html } from 'htm/preact'

export default function MessagePost (props: {
  message: BasicEmitPayload,
  players: ClientSafePlayer[],
}) {
  const { message, players } = props

  const sender = players.find(player=>player.id === message.from)
  const senderName = sender ? sender.name || sender.id : message.from

  return html`<p>
  <b>${senderName}</b>
  <span>${message.message}</span>
</p>`
}
