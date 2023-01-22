/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { css } from '@emotion/css'
import { FunctionalComponent } from 'preact'
import { html } from 'htm/preact'
import { DieRoll } from '../../../definitions/tabula/types'
import { romanNumeral } from '../util'

interface Props {
  value: DieRoll
  dieIndex: number
  clickHandler: { (dieIndex: number): void }
  isSelected: boolean
}

const dieStyle = (isSelected: boolean) => css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${3}em;
  height: ${3}em;
  padding:0;
  b {
    display: block;
    font-size: 1.25em;
  }
  ${isSelected ? `
  background-color: red;
  ` : ''}
`

export const DieButton: FunctionalComponent<Props> = ({ dieIndex, value, clickHandler, isSelected }: Props) => {
  return html`
  <button
    class=${dieStyle(isSelected)}
    onClick=${() => {
      clickHandler(dieIndex)
    }}>
    <b>${romanNumeral(value)}</b>

  </button>
  `
}
