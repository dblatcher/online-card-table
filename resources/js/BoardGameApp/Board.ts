/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { css } from '@emotion/css'
import { Component, ComponentChild } from 'preact'
import { html } from 'htm/preact'
import type { ButtonValue, Cell, TabulaCondition } from '../../../definitions/tabula/types'
import { Square } from './Square'
import { SpecialZone } from './SpecialZone'

interface Props {
  game: TabulaCondition
  squareClickHandler: { (cellIndex: number): void }
  specialClickHandler: { (zone: 'jail' | 'start'): void }
  updateHoveredButton: { (button: ButtonValue, eventType: 'enter' | 'leave'): void }
  children?: ComponentChild
  highlightSquareIndex?: number
}

const cellSize = 4.5
const boardStyle = css`
  position: relative;
  display: inline-flex;
  border: 5px outset wheat;
  margin-bottom: 2em;
  background-color:wheat;
`

const rowsContainerStyle = css`
  position:relative;
  height: ${8 * cellSize}em;
  width: ${8 * cellSize}em;
  padding: ${cellSize * 1.25}em;
  box-sizing: border-box;
  transform: rotate(-45deg) scale(81%);
`

const rowStyle = css`
  display: inline-flex;
  position: absolute;
`
const rowStyleFor = [
  css`
    flex-direction: row;
    top:0;
    left: ${cellSize}em;
    `,
  css`
    flex-direction: column;
    top:${cellSize}em;
    right: 0;
  `,
  css`
    flex-direction: row-reverse;
    bottom:0;
    left: ${cellSize}em;
  `,
  css`
    flex-direction: column-reverse;
    top:${cellSize}em;
    left:0;
  `,
]

const zoneContainerStyle = css`
  position: absolute;
  padding: .5em;
`

const placeTopMiddle = css`
top: 10%;
left: 50%;
transform: translateX(-50%);
`
const placeMiddle = css`
top: 50%;
left: 50%;
transform: translateX(-50%) translateY(-50%);
`
const placeTopLeft = css`
  top: 0;
  left:0;
`
const placebottomRight = css`
  bottom: 0;
  right:0;
`

export class Board extends Component<Props> {
  get rows() {
    const { cells } = this.props.game

    const copy = [...cells]
    const rows: Cell[][] = []

    while (copy.length > 0) {
      const newRow = copy.splice(0, 6)
      rows.push(newRow)
    }
    return rows
  }

  public render(): ComponentChild {
    const { rows } = this
    const {
      squareClickHandler,
      game,
      specialClickHandler,
      children,
      highlightSquareIndex,
      updateHoveredButton,
    } = this.props
    return html`
    <article class=${boardStyle}>
      <main class=${rowsContainerStyle}>
        ${rows.map((row, rowIndex) => html`
          <section class=${[rowStyle, rowStyleFor[rowIndex]].join(' ')}>
            ${row.map((cell, index) => html`
              <${Square}
                cell=${cell}
                cellSize=${cellSize}
                cellIndex=${(rowIndex * 6) + index}
                clickHandler=${squareClickHandler}
                hightlight=${(rowIndex * 6) + index === highlightSquareIndex}
                updateHoveredButton=${updateHoveredButton}
              />
            `)}
          </section>
        `)}
      </main>

      <section class=${[zoneContainerStyle, placeTopLeft].join(' ')}>
        <${SpecialZone}
          game=${game}
          specialClickHandler=${specialClickHandler}
          updateHoveredButton=${updateHoveredButton}
          zone='start' />
      </section>

      <section class=${[zoneContainerStyle, placeTopMiddle].join(' ')}>
        <${SpecialZone}
          game=${game}
          specialClickHandler=${specialClickHandler}
          zone='jail' />
      </section>

      <section class=${[zoneContainerStyle, placebottomRight].join(' ')}>
        <${SpecialZone}
          game=${game}
          specialClickHandler=${specialClickHandler}
          zone='home' />
      </section>

      <div class=${[zoneContainerStyle, placeMiddle].join(' ')}>
        ${children}
      </div>
    </article>
    `
  }
}
