export type PayloadBase = {
  from?: string
  roomName?: string
  isError?: boolean
}

export interface Player {
  id: string
  socketId: string
  name?: string
  role?: string
}

export type ClientSafePlayer = (Partial<Player> & { id: string, socketId: undefined })
