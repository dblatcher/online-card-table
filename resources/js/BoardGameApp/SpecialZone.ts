/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { css } from '@emotion/css'
import { html } from 'htm/preact'
import type { PlayerColor, TabulaCondition } from '../../../definitions/tabula/types'
import { Stones } from './Stones'

interface Props {
  game: TabulaCondition
  zone: 'start' | 'jail' | 'home',
  specialClickHandler: { (player: PlayerColor, zone: 'jail' | 'start'): void }
}

const zoneStyle = css`
  display: flex;
  flex-direction: column;

  button {
    min-width: 4em;
    padding: .5em;
  }
`

export const SpecialZone = ({ game, specialClickHandler, zone }: Props) => {
  if (zone === 'home') {
    return html`
    <section class=${zoneStyle}>
      <span>${zone}</start>
      <span>
        <${Stones} color="BLUE" stones=${game[zone].BLUE} renderZero />
      </span>
      <span>
        <${Stones} color="GREEN" stones=${game[zone].GREEN} renderZero />
      </span>
    </section>
    `
  }

  const clickBlue = () => {
    specialClickHandler('BLUE', zone)
  }
  const clickGreen = () => {
    specialClickHandler('GREEN', zone)
  }

  return html`
    <section class=${zoneStyle}>
      <span>${zone}</start>
      <button onclick=${clickBlue}>
        <${Stones} color="BLUE" stones=${game[zone].BLUE} renderZero />
      </button>
      <button onclick=${clickGreen}>
        <${Stones} color="GREEN" stones=${game[zone].GREEN} renderZero />
      </button>
    </section>
    `
}
