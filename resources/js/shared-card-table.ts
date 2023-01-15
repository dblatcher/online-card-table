import '../scss/cardGame.scss'

import { init as initSharedCardTable } from './shared-game'
import { openClientSocket } from './socket/client-socket'

window.onload = () => {
  const socket = openClientSocket()
  initSharedCardTable(socket)
}

