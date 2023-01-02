/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { css } from '@emotion/css'
import { Component, ComponentChild, createRef, RefObject } from 'preact'
import { html } from 'htm/preact'
import { GameEvent, EventCategory } from './types'

interface Props {
  events: GameEvent[]

}

const frameStyle = css`
  border-top: 3px double black;
  border-bottom: 3px double black;
  margin: 0 1em 2em;
  flex-basis: 100%;
  flex-shrink: 1;

  display: flex;
  flex-direction: column;
  max-height: 32em;


  b {
    border-bottom: 3px double black;
  }

  div {
    flex-basis: 100%;
    flex-shrink: 1;
    position: relative
    max-height:100%;
    overflow: auto;
  }

  ul {
    margin: 0;
    list-style: none;
    padding:0;
  }
`

const messageStyle = (category?: EventCategory) => {
  const color = category === EventCategory.illegalMove
    ? 'red'
    : 'black'

  return css`
    color: ${color};
    padding: .125em;
    border-bottom: 1px dotted black;
  `
}

export class EventList extends Component<Props> {
  divRef: RefObject<HTMLElement>

  constructor(props: Props) {
    super(props)
    this.divRef = createRef()
  }

  componentDidUpdate(): void {
    const { current: div } = this.divRef
    if (!div) {
      return
    }
    div.scrollTop = div.offsetHeight
  }

  public render(): ComponentChild {
    const { events } = this.props
    return html`
      <aside class=${frameStyle}>
        <b>Events</b>
        <div ref=${this.divRef}>
          <ul>
          ${events.map(event => html`
            <li class=${messageStyle(event.category)}>${event.message}</li>
          `)}
          </ul>
        </div>
      </aside>
    `
  }
}
