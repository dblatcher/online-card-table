/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import { getPrivateRoomPath, getSharedRoomPath } from 'App/lib/path'

Route.get('/', 'IndexController.index')
Route.get('/about', async ({ view }) => {
  const greeting = Math.random() > .5 ? 'hello' : 'hi there'

  return view.render('about', {
    greeting,
  })
})
Route.get(getPrivateRoomPath('Card'), 'CardTableController.index')
Route.get(getSharedRoomPath(':roomName', 'Card'), 'CardTableController.room')
Route.get(getPrivateRoomPath('Tabula'), 'BoardGameController.index')
Route.get(getSharedRoomPath(':roomName', 'Tabula'), 'BoardGameController.room')
Route.get('/create-room', 'CreateController.index')
Route.post('/create-room', 'CreateController.formHandler')

Route.get('*',async (ctx) => {
  ctx.response.status(404)
  return ctx.view.render('errors/not-found')
})
