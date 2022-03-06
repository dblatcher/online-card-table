import { css } from '@emotion/css'
import { ClientSafePlayer } from 'definitions/RoomState'
import { BasicEmitPayload } from 'definitions/socketEvents'
import { html } from 'htm/preact'

const postStyle = (isFromServer:boolean) => css`
  margin: 0 0 .5em;
  background-color: ${isFromServer ? 'yellow': 'unset'};

  b {
    background-color: black;
    color: ${ isFromServer ? 'yellow':'whitesmoke'};
    min-width: 6rem;
    display: inline-block;
  }

  span {
    padding-left: .5em;
  }
`

export default function MessagePost (props: {
  message: BasicEmitPayload,
  players: ClientSafePlayer[],
}) {
  const { message, players } = props

  const sender = players.find(player=>player.id === message.from)
  const isFromServer = !sender
  const senderName = sender ? sender.name || sender.id : '[SERVER]'

  return html`<p class=${postStyle(isFromServer)}>
  <b>${senderName}</b>
  <span>${message.message}</span>
</p>`
}
