/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { css } from '@emotion/css'
import { FunctionalComponent } from 'preact'
import { html } from 'htm/preact'
import { Cell } from './types'
import { Stones } from './Stones'

interface Props {
  cell: Cell
  cellIndex: number
  cellSize?: number
  clickHandler: { (cellIndex: number): void }
}

const SquareStyle = (size: number) => css`
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
`

export const Square: FunctionalComponent<Props> = ({ cell, cellIndex, cellSize = 4, clickHandler }: Props) => {
  return html`
  <button
    class=${SquareStyle(cellSize)}
    onClick=${() => { clickHandler(cellIndex) }}>
    <b>${cellIndex + 1}</b>
    <${Stones} color=${cell.color} stones=${cell.stones} />
  </button>
  `
}
