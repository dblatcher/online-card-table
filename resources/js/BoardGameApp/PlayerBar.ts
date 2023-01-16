/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { css } from '@emotion/css'
import { ClientSafePlayer } from 'definitions/types'
import { html } from 'htm/preact'
import type { PlayerColor } from '../../../definitions/tabula/types'
import { Stones } from './Stones'

interface Props {
  players: Record<PlayerColor, ClientSafePlayer | undefined>
  isLocalGame: boolean
  localPlayerRole?: string
  whosTurn?: PlayerColor
}

const barStyle = css`
  display: inline-flex;
`

const playerStyle = (current:boolean) => css`
  display: inline-flex;
  margin-right: 1em;
  border: 1px dashed gray;
  border-radius: .5em;
  padding: .25em;
  align-items: center;
  color: ${current ? 'white' : 'lightgray'};
  background-color: ${current ? 'black' : 'darkgray'};
`

export const PlayerBar = ({ isLocalGame, players, localPlayerRole, whosTurn }: Props) => {
  const greenPlayerName = isLocalGame ? 'HUMAN' : players.GREEN?.name || '[no one]'
  const bluePlayerName = isLocalGame ? 'HUMAN' : players.BLUE?.name || '[no on]'

  const localPlayerColor = localPlayerRole === 'GREEN'
    ? 'GREEN'
    : localPlayerRole === 'BLUE'
      ? 'BLUE'
      : undefined

  return html`
    <section class=${barStyle}>
      <div class=${playerStyle(whosTurn === 'BLUE')}>
       <${Stones} color="BLUE" stones=${1} />
       <b>${bluePlayerName}</b>
       ${localPlayerColor === 'BLUE' && html`<span>(YOU)</span>`}
      </div>
      <div class=${playerStyle(whosTurn === 'GREEN')}>
       <${Stones} color="GREEN" stones=${1} />
       <b>${greenPlayerName}</b>
       ${localPlayerColor === 'GREEN' && html`<span>(YOU)</span>`}
      </div>
    </section>
    `
}
