/* eslint-disable @typescript-eslint/indent */
import { ClientSafePlayer } from 'definitions/RoomState'
import { html } from 'htm/preact'

export default function PlayerListBox (props:{
  players:ClientSafePlayer[]
}) {
  const {players} = props
  console.log({players})


  return html`<div>
      <p>There are ${players.length} players</p>
      <ul>
        ${players.map((player, index) => {
          return html`<li key=${index}>${player.name || player.id}</li>`
        })}
      </ul>
    </div>
  `
}
