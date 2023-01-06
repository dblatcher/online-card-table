/* eslint-disable @typescript-eslint/indent */
import { ClientSafePlayer } from 'definitions/types'
import { html } from 'htm/preact'
import { css } from '@emotion/css'

const listStyle = css`
list-style: none;
margin: 0 0 10px;
padding: 0;
`

const itemStyle = css `
display: inline-block;
margin-right: 5px;
padding: 5px;
background-color: gray;
border-radius: 4px;
`

const countStyle = css `
margin: 10px 0 0;
`

export default function PlayerListBox (props:{
  players:ClientSafePlayer[]
}) {
  const {players} = props

  return html`<div>
      <p className=${countStyle} >${players.length} player${players.length === 1 ? '':'s'}</p>
      <ul className=${listStyle}>
        ${players.map((player, index) => {
          return html`<li  className=${itemStyle} key=${index}>${player.name || player.id}</li>`
        })}
      </ul>
    </div>
  `
}
