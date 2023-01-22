/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { css } from '@emotion/css'
import { html } from 'htm/preact'
import type { ButtonValue, TabulaCondition } from '../../../definitions/tabula/types'
import { Stones } from './Stones'

interface Props {
  game: TabulaCondition
  zone: 'start' | 'jail' | 'home',
  specialClickHandler: { (zone: 'jail' | 'start'): void }
  updateHoveredButton: { (button: ButtonValue, eventType: 'enter' | 'leave'): void }
}

const zoneStyle = css`
  display: flex;
  flex-direction: column;

  button {
    min-width: 4em;
    padding: .5em;
  }
`

export const SpecialZone = ({ game, specialClickHandler, zone, updateHoveredButton }: Props) => {
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

    <button
      onclick=${clickHandler}
      onMouseEnter=${() => { updateHoveredButton(zone, 'enter') }}
      onMouseLeave=${() => { updateHoveredButton(zone, 'leave') }}
      class=${zoneStyle}>
      <span>${zone}</start>
        <${Stones} color="BLUE" stones=${game[zone].BLUE} alwaysNumbers />
        <${Stones} color="GREEN" stones=${game[zone].GREEN} alwaysNumbers />
      </button>

    `
}
