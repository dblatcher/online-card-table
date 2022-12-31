import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BoardGameController {
  public async index(ctx: HttpContextContract) {
    return ctx.view.render('boardGame', {

    })
  }
}
