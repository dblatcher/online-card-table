import { DieRoll } from './types'

export const d6 = (): DieRoll => {
  return (Math.ceil(Math.random() * 6) || 1) as DieRoll
}
