/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { css } from '@emotion/css'
import { FunctionalComponent } from 'preact'
import { html } from 'htm/preact'
import { Cell, ButtonValue } from '../../../definitions/tabula/types'
import { Stones } from './Stones'

interface Props {
  cell: Cell
  cellIndex: number
  cellSize?: number
  clickHandler: { (cellIndex: number): void }
  updateHoveredButton: { (button: ButtonValue, eventType: 'enter' | 'leave'): void }
  hightlight?: boolean
}

const SquareStyle = (size: number, highlight?: boolean) => css`
  display: inline-flex;
  flex-direction: column;
  box-sizing: border-box;
  width: ${size}em;
  height: ${size}em;
  padding:0;
  b {
    display: block;
    font-size: 1.25em;
  }
  font-size: 1em;
  transition: transform .5s;

  ${highlight && `
    z-index:1;
    transform: scale(1.2);
  `}
`

export const Square: FunctionalComponent<Props> = ({
  cell, cellIndex, cellSize = 4, clickHandler, hightlight, updateHoveredButton
}: Props) => {
  return html`
  <button
    class=${SquareStyle(cellSize, hightlight)}
    onClick=${() => { clickHandler(cellIndex) }}
    onMouseEnter=${() => {updateHoveredButton(cellIndex, 'enter')}}
    onMouseLeave=${() => {updateHoveredButton(cellIndex, 'leave')}}
    >
    <b>${cellIndex + 1}</b>
    <${Stones} color=${cell.color} stones=${cell.stones} />
  </button>
  `
}
