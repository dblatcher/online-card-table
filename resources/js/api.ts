import { RoomNameSuggestion } from 'definitions/apiTypes'

const PATHS = {
  rooms: {
    suggestName: '/api/rooms/suggest-name',
  },
} as const

async function fetchJson<T extends {}> (path: string): Promise<{ data?: T, error?: string }> {
  try {
    const response = await fetch(path)
    if (!response.ok) {
      console.error(`error fetching from ${path}`, response.statusText)
      return { error: response.statusText }
    }
    const data = await response.json()
    return { data }
  } catch (err) {
    console.error(err)
    return { error: 'fetch fail' }
  }
}

export const fetchSuggestedRoomName = async (): Promise<string | undefined> => {
  const { data } = await fetchJson<RoomNameSuggestion>(PATHS.rooms.suggestName)
  return data?.suggestion
}

