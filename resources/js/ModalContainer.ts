import { css } from '@emotion/css'
import { html } from 'htm/preact'
import { ComponentChild } from 'preact'

interface Props {
  toggle?: { (): void }
  isOpen: boolean
  children?: ComponentChild
}

const wrapperStyle = css`
position: fixed;
left:0;
top:0;
width:100vw;
height:100vh;
background-color: rgba(0,0,0,.5);
display: flex;
justify-content: center;
align-items: center;
z-index:100;

>button {
  position: absolute;
  top: 0;
  right: 0;
  margin: 2rem;
}
`

const modalStyle = css`
  background-color: white;
`

export const ModalContainer = ({ toggle, isOpen, children }: Props) => {
  if (!isOpen) {
    return null
  }

  return html`
  <div class=${wrapperStyle}>
    ${toggle && html`
      <button onClick=${toggle}>close</button>
    `}
    <aside class=${modalStyle}>
    ${children}
    </aside>
  </div>
  `
}
