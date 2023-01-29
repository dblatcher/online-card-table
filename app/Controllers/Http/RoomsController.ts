// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoomNames from 'App/services/RoomNames'

export default class RoomsController {
  public async suggestName () {
    return RoomNames.suggest()
  }
}
