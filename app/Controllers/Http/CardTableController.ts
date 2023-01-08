import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rooms from 'App/services/Rooms'

export default class CardTableController {
  public async index (ctx: HttpContextContract) {
    return ctx.view.render('privateTable')
  }

  public async room (ctx: HttpContextContract) {
    const { roomName } = ctx.request.params()
    const room = Rooms.getRoomByName(roomName)
    if (room?.type === 'Card') {
      return ctx.view.render('sharedTable', { roomName })
    } else {
      ctx.response.status(404)
      return ctx.view.render('errors/not-found')
    }
  }
}
