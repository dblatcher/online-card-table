import { RoomState } from 'definitions/RoomState'

export const getSharedRoomPath = (name: string, type: RoomState['type']): string => {
  switch (type) {
    case 'Card':
      return `card-table/shared/${name}`
    case 'Tabula':
      return `tabula/shared/${name}`
  }
}

export const enhanceRoomState = (room: RoomState): RoomState & { path: string } => ({
  ...room,
  path: getSharedRoomPath(room.name, room.type),
})
