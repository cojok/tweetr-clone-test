'use strict'
const Favorite = use('App/Models/Favorite')

class FavoriteController {

  /**
   * Create a favorite tweet for a user
   * @param req
   * @param auth
   * @param res
   * @returns {JSON}
   */
  async create ({ req, auth, res }) {

    const user = auth.current.user
    const tweetID = req.input('tweet_id')
    const favorite = await Favorite.findOrCreate(
      { tweet_id : tweetID, user_id : user.id },
      { tweet_id : tweetID, user_id : user.id }
    )

    return res.json({
      status: 'success',
      data: favorite
    })

  }

  /**
   * Delete tweeet from favorite
   * @param params
   * @param auth
   * @param res
   * @returns {Promise<*|{limit, strict, types}|Promise<any>>}
   */
  async destroy({ params, auth, res}) {
    const user = auth.current.user

    await Favorite.query()
      .with('user_id', user.id)
      .with('tweet_id', params.id)
      .delete()

    return res.json({
      status: 'success',
      message: 'Favorite tweet removed'
    })
  }
}

module.exports = FavoriteController
