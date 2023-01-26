/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { FunctionalComponent } from 'preact'
import { html } from 'htm/preact'
import { AvaliableMove, PlayerColor } from 'definitions/tabula/types'
import { ClientSafePlayer } from 'definitions/types'

interface Props {
  availableMoves: AvaliableMove[]
  winner: PlayerColor | undefined,
  currentPlayer: PlayerColor,
  players: Record<PlayerColor, ClientSafePlayer | undefined>
  needsToLogIn: boolean,
  noDiceLeft: boolean,
}

const getOtherColor = (color: PlayerColor): PlayerColor => color === 'BLUE' ? 'GREEN' : 'BLUE'

const getMessage = (
  availableMoves: AvaliableMove[],
  winner: PlayerColor | undefined,
  currentPlayer: PlayerColor,
  players: Record<PlayerColor, ClientSafePlayer | undefined>,
  needsToLogIn: boolean,
  noDiceLeft: boolean,
): string => {
  if (needsToLogIn) {
    return 'You must sign in to play.'
  }

  if (winner) {
    return `${players[winner]?.name || winner} has won the game!`
  }

  const otherColor = getOtherColor(currentPlayer)
  const currentPlayerName = players[currentPlayer]?.name || currentPlayer
  const otherPlayerName = players[otherColor]?.name || otherColor

  if (noDiceLeft) {
    return `${currentPlayerName}'s turn over. ${otherPlayerName} to roll dice`
  }

  if (availableMoves.length === 0) {
    return `${currentPlayerName} cannot move. ${otherPlayerName} to roll dice`
  }

  return `${currentPlayerName} to move`
}

export const MainMessage: FunctionalComponent<Props> = ({
  availableMoves, winner, currentPlayer, players, needsToLogIn, noDiceLeft,
}: Props) => {
  const message = getMessage(availableMoves, winner, currentPlayer, players, needsToLogIn, noDiceLeft)

  return html`
  <span>${message}</span>
  `
}
