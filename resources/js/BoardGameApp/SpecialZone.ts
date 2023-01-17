/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { css } from '@emotion/css'
import { html } from 'htm/preact'
import type { TabulaCondition } from '../../../definitions/tabula/types'
import { Stones } from './Stones'

interface Props {
  game: TabulaCondition
  zone: 'start' | 'jail' | 'home',
  specialClickHandler: { (zone: 'jail' | 'start'): void }
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
        <${Stones} color="BLUE" stones=${game[zone].BLUE} alwaysNumbers />
      </span>
      <span>
        <${Stones} color="GREEN" stones=${game[zone].GREEN} alwaysNumbers />
      </span>
    </section>
    `
  }

  const clickHandler = () => {
    specialClickHandler(zone)
  }


  return html`

    <button onclick=${clickHandler} class=${zoneStyle}>
      <span>${zone}</start>
        <${Stones} color="BLUE" stones=${game[zone].BLUE} alwaysNumbers />
        <${Stones} color="GREEN" stones=${game[zone].GREEN} alwaysNumbers />
      </button>

    `
}
