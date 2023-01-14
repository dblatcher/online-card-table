import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rooms from 'App/services/Rooms'

export default class IndexController {
  public async index (ctx: HttpContextContract) {
    const rooms = Rooms.getRoomList()
    const tabulaRooms = rooms.filter(room => room.type === 'Tabula')
    const cardRooms = rooms.filter(room => room.type === 'Card')
    return ctx.view.render('welcome', {
      cardRooms, tabulaRooms,
    })
  }
}
