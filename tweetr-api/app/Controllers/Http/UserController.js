'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')
const Tweet = use('App/Models/Tweet')

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
        message : 'Your profile was updated successfully',
        data : user
      })

    } catch (error) {
      return res.status(400).json({
        status : 'error',
        message : 'There was a problem updating your profile. Please try again later!'
      })
    }
  }

  /**
   * Changing auth user password
   * @param req
   * @param auth
   * @param res
   * @returns {STRING|JSON}
   */
  async changePassword ({ req, auth, res }) {

    const user = auth.current.user

    const confirmPassowrd = await Hash.verify(req.input('password'), user.password)

    if (!confirmPassowrd) {
      return res.status(400).json({
        status : 'error',
        message : 'Old password could not be verified. Please try again later!'
      })
    }

    user.password = await Hash.make(req.input('new-password'))
    await user.save()

    return res.json({
      status : 'success',
      message : 'Password changed successfully!'
    })
  }

  /**
   * Show profile of a user
   * @param req
   * @param params
   * @param res
   * return {JSON}
   */
  async showProfile ({ req, params, res }) {
    try {

      const user = await User.query()
        .where('id', params.username)
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

    } catch (error) {
      return res.status(404).json({
        status : 'error',
        message : 'User does not exist.'
      })
    }
  }

  /**
   * Who to follow method
   * @param params
   * @param auth
   * @param res
   * @returns {JSON}
   */
  async usersToFollow ({ params, auth, res }) {

    const user = auth.current.user

    const isFollowing = await user.following().ids()

    const whoToFollow = await User.query()
      .whereNot('id', user.id)
      .whereNotIn('id', isFollowing)
      .pick(3)

    return res.json({
      status : 'success',
      data : whoToFollow
    })
  }

  /**
   * Follow user method
   * @param params
   * @param auth
   * @param res
   * @returns {STRING|JSON}
   */
  async follow ({ params, auth, res }) {

    const user = auth.current.user

    await user.following().attach(params.id)

    return res.json({
      status: 'success',
      message: 'Following successfully!'
    })

  }

  /**
   * Unfollow user method
   * @param params
   * @param auth
   * @param res
   * @returns {STRING|JSON}
   */
  async unfollow({params, auth, res}) {

    const user = auth.current.user

    await user.following().detach(params.id)

    return res.json({
      status: 'success',
      message: 'Unfollowing successfully'
    })

  }

  /**
   * Showing user timeline
   * @param auth
   * @param res
   * @returns {STRING|JSON}
   */
  async timeline({auth, res}) {

    let message = null

    const user = await User.find(auth.current.user.id)

    const followers = await user.following().ids()

    followers.push(user.id)

    const tweets = await Tweet.query()
      .whereIn('user_id', followers)
      .with('user')
      .with('favorites')
      .with('replies')
      .fetch()

    if(!tweets) {
      message = 'There are no tweets to show you. Please tweet something'
    }

    return res.json({
      status: 'success',
      message: message,
      data: tweets
    })
  }
}

module.exports = UserController
