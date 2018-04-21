'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.get('/', ({ request }) => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('/register', 'UserController.register')
Route.post('/login', 'UserController.login')
Route.get(':username', 'UserController.showProfile')

Route.group(() => {
  Route.get('/profile', 'UserController.profile')
  Route.put('/update-profile', 'UserController.updateProfile')
  Route.put('/change-password', 'UserController.changePassword')
}).prefix('account').middleware(['auth:jwt'])

Route.group(() => {
  Route.get('/users-to-follow', 'UserController.userToFollow')
  Route.get('/follow/:id', 'UserController.follow')
  Route.delete('/unfollow/:id', 'UserController.unfollow')
  Route.get('/timeline', 'UserController.timeline')
}).prefix('users').middleware(['auth:jwt'])

Route.group(() => {
  Route.post('/', 'TweetController.tweet')
  Route.get('/:id', 'TweetController.show')
  Route.post('/id/reply', 'TweetController.reply')
  Route.delete('/id/destroy', 'TweetController.destroy')
}).prefix('tweets').middleware(['auth:jwt'])

Route.group(() => {
  Route.post('/create', 'FavoriteController.create')
  Route.delete('/destroy/:id', 'FavoriteController.destroy')
}).prefix('favorite').middleware(['auth:jwt'])
