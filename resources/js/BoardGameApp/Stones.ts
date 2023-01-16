/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { css } from '@emotion/css'
import { FunctionalComponent } from 'preact'
import { html } from 'htm/preact'
import { PlayerColor } from '../../../definitions/tabula/types'

interface Props {
  color?: PlayerColor
  stones: number
  renderZero?: boolean
}

const stoneStyle = css`
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  border-radius: 50%;
`

const blueStyle = css`
  background: radial-gradient(circle at top left, #465af6 41%, #35487b 70%);
  border-color: blue;
  `

const greenStyle = css`
  background: radial-gradient(circle at top left, #46f654 41%, #357b35 70%);
  border-color: green;
`

export const Stones: FunctionalComponent<Props> = ({ color = 'BLUE', stones, renderZero }: Props) => {
  const stoneClasses = [stoneStyle, color === 'BLUE' ? blueStyle : greenStyle].join(' ')

  switch (stones) {
    case 0: return renderZero
      ? html`
    <span>
      <span class=${stoneClasses}></span> x ${stones}
    </span>`: null
    case 1: return html`
    <span>
       <span class=${stoneClasses}></span>
    </span>`
    case 2: return html`
    <span>
       <span class=${stoneClasses}></span>
       <span class=${stoneClasses}></span>
    </span>`
    case 3: return html`
    <span>
       <span class=${stoneClasses}></span>
       <span class=${stoneClasses}></span>
       <span class=${stoneClasses}></span>
    </span>`

    default: return html`
    <span>
       <span class=${stoneClasses}></span> x ${stones}
    </span>`
  }
}
