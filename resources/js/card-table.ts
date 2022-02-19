import '../scss/base.scss'

import { init as initCardTable } from './cards/index'
import { openClientSocket } from './socket/client-socket'

window.onload = () => {
  const socket = openClientSocket()
  initCardTable(socket)
}

