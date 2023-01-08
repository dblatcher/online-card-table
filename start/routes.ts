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

Route.get('/', 'IndexController.index')
Route.get('/about', async ({ view }) => {
  const greeting = Math.random() > .5 ? 'hello' : 'hi there'

  return view.render('about', {
    greeting,
  })
})
Route.get('/card-table/private', 'CardTableController.index')
Route.get('/card-table/shared/:roomName', 'CardTableController.room')
Route.get('/tabula/private', 'BoardGameController.index')
Route.get('/tabula/shared/:roomName', 'BoardGameController.room')
