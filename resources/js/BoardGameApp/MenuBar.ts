import { css } from '@emotion/css'
import { html } from 'htm/preact'
import { Fragment } from 'preact'

interface Props {
  handleResetClick: { (): void }
}

const headerStyle = css`
  background-color: blue;
`

export const MenuBar = ({ handleResetClick }: Props) => {
  return html`
  <${Fragment}>
    <header class=${headerStyle}>
      <button onClick=${handleResetClick}>reset</button>
    </header>
  </${Fragment}>

  `
}
