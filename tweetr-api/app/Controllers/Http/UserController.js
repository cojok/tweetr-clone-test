'use strict'
const User = use('App/Models/User')

class UserController {
  // register method
  async register ({req, auth, res}) {
    //get user data
    const userData = req.only(['name', 'username', 'email', 'password'])

    try {
      //create user
      const user  = await User.create(userData)
      //generate user token
      const token = await auth.generate(user)

      return res.json({
        status: 'success',
        data  : token
      })
    } catch (error) {
      return res.status(400).json({
        status : 'error',
        message:
          'There was a problem in creating the user. Please try again later.'
      })
    }
  }

  //login method
  async login ({req, auth, res}) {
    try {
      // authenticate the user and generate token
      const token = await auth.attempt(req.input('email'), req.input('pass'))
      return res.json({
        status: 'success',
        data  : token
      })
    } catch (error) {
      return res.status(400).json({
        status : 'error',
        message: 'Invalid username/password. Please try again!'
      })
    }
  }
}

module.exports = UserController
