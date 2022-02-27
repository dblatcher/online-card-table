import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rooms from 'App/services/Rooms'

export default class SharedTablesController {
  public async index (ctx: HttpContextContract) {
    const rooms = Rooms.getRoomList()
    return ctx.view.render('createTable',{rooms})
  }
  public async room (ctx: HttpContextContract) {
    const { roomName } = ctx.request.params()
    return ctx.view.render('sharedTable', { roomName })
  }
}
