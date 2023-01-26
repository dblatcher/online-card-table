/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { FunctionalComponent } from 'preact'
import { html } from 'htm/preact'
import { DieButton } from './DieButton'
import type { TabulaCondition } from 'definitions/tabula/types'

interface Props {
  condition: TabulaCondition,
  numberOfMoves: number,
  handleDieClick: { (dieIndex: number): void }
  selectedDieIndex: number,
  rollDice: { (): void }
}

export const DiceSection: FunctionalComponent<Props> = ({
  condition,
  numberOfMoves,
  handleDieClick,
  selectedDieIndex,
  rollDice,
}: Props) => {
  const timeToRollDice = !!condition && (numberOfMoves === 0 || condition.dice.length === 0)

  return html`
  <section>
    ${condition.dice.map((die, index) => html`
      <${DieButton}
        value=${die}
          dieIndex=${index}
          clickHandler=${handleDieClick}
          isSelected=${index === selectedDieIndex}/>
    `)}
    ${timeToRollDice ? html`
      <button onClick=${rollDice}>roll</button>
    `: html`
      <p>${numberOfMoves} available moves.</p>
    `}
  </section>
  `
}
