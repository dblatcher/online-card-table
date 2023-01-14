import { RoomState } from 'definitions/RoomState'

export const getPrivateRoomPath = (type: RoomState['type']): string => {
  switch (type) {
    case 'Card':
      return 'card-table/private'
    case 'Tabula':
      return 'tabula/private'
  }
}

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

const isLowerCaseChar = (character: string): boolean => character.charCodeAt(0) >= 97 && character.charCodeAt(0) < 122
const convert = (character: string): string => isLowerCaseChar(character) ? character : '-'
export const toKebab = (input: string): string => input.toLowerCase().trim().split('').map(convert).join('')
