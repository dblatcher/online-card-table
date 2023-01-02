/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { css } from '@emotion/css'
import { Component, ComponentChild } from 'preact'
import { html } from 'htm/preact'
import type { Cell, PlayerColor, TabulaCondition } from '../../../definitions/tabula/types'
import { Square } from './Square'
import { Stones } from './Stones'

interface Props {
  game: TabulaCondition
  squareClickHandler: { (cellIndex: number): void }
  specialClickHandler: { (player: PlayerColor, zone: 'jail' | 'start'): void }
}

const cellSize = 4
const frameStyle = css`
  display: inline-flex;
  border: 5px outset pink;
  margin-bottom: 2em;
  background-color:pink;
`

const boardStyle = css`
  position:relative;
  height: ${8 * cellSize}em;
  width: ${8 * cellSize}em;
  padding: ${cellSize * 1.25}em;
  box-sizing: border-box;
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

const middleStyle = css`
  background-color: orange;
  padding: .5em;

  div {
    display: flex;
    justify-content: space-between;
  }

  button {
    min-width: 4em;
  }
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
    const { squareClickHandler, game, specialClickHandler } = this.props
    return html`
    <article class=${frameStyle}>
      <main class=${boardStyle}>
      ${rows.map((row, rowIndex) => html`
        <section class=${[rowStyle, rowStyleFor[rowIndex]].join(' ')}>
          ${row.map((cell, index) => html`
            <${Square}
              cell=${cell}
              cellSize=${cellSize}
              cellIndex=${(rowIndex * 6) + index}
              clickHandler=${squareClickHandler}
            />
          `)}
        </section>
      `)}

      <section class=${middleStyle}>

        <div>
          <span>start</start>
          <button onclick=${() => { specialClickHandler('BLUE', 'start') }}>
            <${Stones} color="BLUE" stones=${game.start.BLUE} renderZero />
          </button>
          <button onclick=${() => { specialClickHandler('GREEN', 'start') }}>
            <${Stones} color="GREEN" stones=${game.start.GREEN} renderZero />
          </button>
        </div>
        <div>
          <span>jail</start>
          <button onclick=${() => { specialClickHandler('BLUE', 'jail') }}>
            <${Stones} color="BLUE" stones=${game.jail.BLUE} renderZero />
          </button>
          <button onclick=${() => { specialClickHandler('GREEN', 'jail') }}>
            <${Stones} color="GREEN" stones=${game.jail.GREEN} renderZero/>
          </button>
        </div>
        <div>
          <span>home</start>
          <span><${Stones} color="BLUE" stones=${game.home.BLUE} renderZero /></span>
          <span><${Stones} color="GREEN" stones=${game.home.GREEN} renderZero /></span>
        </div>

      </section>
      </main></article>
    `
  }
}
