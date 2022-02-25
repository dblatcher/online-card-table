import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PrivateTablesController {
  public async index (ctx: HttpContextContract) {
    return ctx.view.render('privateTable')
  }
}
