import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rooms from 'App/services/Rooms'

export default class IndexController {
  public async index (ctx: HttpContextContract) {
    const rooms = Rooms.getRoomList()
    return ctx.view.render('welcome', {
      rooms,
    })
  }
}
