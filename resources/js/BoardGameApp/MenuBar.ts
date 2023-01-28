import { css } from '@emotion/css'
import { html } from 'htm/preact'
import { Fragment } from 'preact'

interface Props {
  handleResetClick: { (): void }
  title: string
}

const headerStyle = css`
  border-bottom: 1px solid black;
  display: flex;
  justify-content: space-between;
  padding: .5em;
  margin-bottom: .25em;
`

export const MenuBar = ({ handleResetClick, title }: Props) => {
  return html`
  <${Fragment}>
    <header class=${headerStyle}>
      <span>${title}</span>
      <button onClick=${handleResetClick}>reset</button>
      <a href="/">back to home page</a>
    </header>
  </${Fragment}>

  `
}
