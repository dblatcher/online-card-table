import '../scss/base.scss'

import { init as initSharedCardTable } from './shared-game/index'
import { openClientSocket } from './socket/client-socket'

window.onload = () => {
  const socket = openClientSocket()
  initSharedCardTable(socket)
}

