import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SharedTablesController {
  public async index (ctx: HttpContextContract) {
    return ctx.view.render('sharedTable')
  }
}
