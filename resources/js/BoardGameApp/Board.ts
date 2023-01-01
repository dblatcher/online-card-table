/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { css } from '@emotion/css'
import { Component, ComponentChild } from 'preact'
import { html } from 'htm/preact'
import { Cell, TabulaCondition } from './types'
import { Square } from './Square'

interface Props {
  game: TabulaCondition
  squareClickHandler: { (cellIndex: number): void }
}

interface State { }

const cellSize = 4

const boardStyle = css`
  background-color: pink;
  border: 3px inset pink;
  position:relative;
  height: ${8 * cellSize}em;
  width: ${8 * cellSize}em;
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

export class Board extends Component<Props, State> {
  constructor(props: Props) {
    super((props))
    this.state = {
    }
  }

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
    const { squareClickHandler } = this.props
    return html`
      <div class=${boardStyle}>
      ${rows.map((row, rowIndex) => html`
        <section class=${[rowStyle, rowStyleFor[rowIndex]].join(' ')}>
          ${row.map((cell, index) => html`
            <${Square}
              cell=${cell}
              cellIndex=${(rowIndex * 6) + index}
              clickHandler=${squareClickHandler}
            />
          `)}
        </section>
      `)}

      </div>
    `
  }
}
