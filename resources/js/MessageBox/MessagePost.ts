import { css } from '@emotion/css'
import { html } from 'htm/preact'
import { Message } from '.'

const postStyle = (message: Message) => css`
  margin: 0 0 .5em;
  background-color: ${message.isFromServer ? 'yellow' : 'unset'};

  b {
    background-color: black;
    color: ${message.isFromServer ? 'yellow' : 'whitesmoke'};
    padding: 0 .25rem;
    display: inline-block;
  }

  span {
    padding-left: .5em;
  }
`

export default function MessagePost(props: {
  message: Message,
}) {
  const { message } = props
  const { isFromServer, isFromYou, content, sender } = message

  const displayName = isFromYou ? 'YOU' : isFromServer ? 'SERVER' : sender ? sender.name || sender.id : '[unknown]'

  return html`<p class=${postStyle(message)}>
  <b>${displayName}:</b>
  <span>${content}</span>
</p>`
}
