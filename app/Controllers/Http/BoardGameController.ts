import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BoardGameController {
  public async index(ctx: HttpContextContract) {
    return ctx.view.render('boardGamePrivate', {

    })
  }

  public async room (ctx: HttpContextContract) {
    const { roomName } = ctx.request.params()
    return ctx.view.render('boardGame', { roomName })
  }
}
