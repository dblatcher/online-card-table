import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rooms from 'App/services/Rooms'
import { RoomState } from 'definitions/RoomState'

type RoomType = RoomState['type']

const roomTypes: RoomType[] = ['Card', 'Tabula']

//to do - string parsing of the name - alpha numeric and dashes only
const parseForm = (body: Record<string, any>): { name: string, type: RoomState['type'] } | undefined => {
  const { type, name } = body
  if (typeof type === 'string' && roomTypes.includes(body.type as RoomType) && typeof name === 'string') {
    return {
      name: name,
      type: (type as RoomType)
    }
  }
  return undefined
}

export default class CreateController {
  public async index(ctx: HttpContextContract) {
    return ctx.view.render('createRoom', {
      roomTypes,
    })
  }

  public async formHandler(ctx: HttpContextContract) {
    const body = ctx.request.body()
    const form = parseForm(body)
    let success = false
    if (form) {
      success = Rooms.addRoom(form.name, form.type)
    }

    return ctx.view.render('resultPage', {
      success,
    })
  }
}
