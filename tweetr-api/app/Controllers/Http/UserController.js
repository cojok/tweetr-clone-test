'use strict'
const User = use('App/Models/User')

class UserController {
  /**
   * user registration method
   * @param req
   * @param auth
   * @param res
   * @returns {JSON}
   */
  async register ({ req, auth, res }) {
    //get user data
    const userData = req.only([ 'name', 'username', 'email', 'password' ])

    try {
      //create user
      const user  = await User.create(userData)
      //generate user token
      const token = await auth.generate(user)

      return res.json({
        status : 'success',
        data : token
      })
    } catch (error) {
      return res.status(400).json({
        status : 'error',
        message : 'There was a problem in creating the user. Please try again later.'
      })
    }
  }

  /**
   * user login method
   * @param req
   * @param auth
   * @param res
   * @returns {STRING|JSON}
   */
  async login ({ req, auth, res }) {
    try {
      // authenticate the user and generate token
      const token = await auth.attempt(req.input('email'), req.input('pass'))
      return res.json({
        status : 'success',
        data : token
      })
    } catch (error) {
      return res.status(400).json({
        status : 'error',
        message : 'Invalid username/password. Please try again!'
      })
    }
  }

  /**
   * Display auth user profile
   * @param auth
   * @param res
   * @returns {JSON}
   */
  async profile ({ auth, res }) {

    const user = await User.query()
      .where('id', auth.current.user.id)
      .with('tweets', builder => {
        builder.with('user')
        builder.with('favorites')
        builder.with('replies')
      })
      .with('following')
      .with('followers')
      .with('favorites')
      .with('favorites.tweets', builder => {
        builder.with('user')
        builder.with('favorites')
        builder.with('replies')
      })
      .firstOrFail()

    return res.json({
      status : 'success',
      data : user
    })
  }

  /**
   * Update auth user profile
   * @param req
   * @param auth
   * @param res
   * @returns {STRING|JSON}
   */
  async updateProfile ({ req, auth, res }) {

    try {
      const user = auth.current.user

      user.name        = req.input('name')
      user.username    = req.input('username')
      user.email       = req.input('email')
      user.location    = req.input('location')
      user.bio         = req.input('bio')
      user.website_url = req.input('website_url')

      await user.save()

      return res.json({
        status : 'success',
        message: 'Your profile was updated successfully',
        data: user
      })

    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'There was a problem updating your profile. Please try again later!'
      })
    }

  }
}

module.exports = UserController
