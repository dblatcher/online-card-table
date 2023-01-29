import { RoomNameSuggestion } from 'definitions/apiTypes'

const PATHS = {
  rooms: {
    suggestName: '/api/rooms/suggest-name',
  },
} as const

const fetchJson = async (path: string): Promise<{ data?: Record<string, any>, error?: string }> => {
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
  const { error, data } = await fetchJson(PATHS.rooms.suggestName)

  if (error || !data) {
    return undefined
  }

  return (data as RoomNameSuggestion).suggestion
}

