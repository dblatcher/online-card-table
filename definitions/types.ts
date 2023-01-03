export type PayloadBase = {
  from?: string
  roomName?: string
}

export interface Player {
  id: string
  socketId: string
  name?: string
}

export type ClientSafePlayer = (Partial<Player> & { id: string, socketId: undefined })
