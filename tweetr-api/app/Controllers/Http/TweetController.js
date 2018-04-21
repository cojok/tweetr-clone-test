'use strict'

const Tweet = use('App/Models/Tweet')
const Reply = use('App/Models/Reply')

class TweetController {


  /**
   * Posting tweet method
   * @param req
   * @param auth
   * @param res
   * @returns {Promise<void>}
   */
  async tweet({ req, auth, res}) {

    const user = auth.current.user

    const tweet = await Tweet.create({
      user_id: user.id,
      tweet: req.input('tweet')
    })

    await tweet.loadMany(['user', 'favorites', 'replies'])

    return res.json({
      status: 'success',
      message: 'Tweet created!',
      data: tweet
    })
  }

  /**
   * Show single tweet method
   * @param params
   * @param auth
   * @param res
   * @returns {STRING|JSON}
   */
  async show({ params, auth, res}) {
    try {

      const tweet = await Tweet.query()
        .where('id', params.id)
        .with('user')
        .with('favorites')
        .with('replies')
        .with('replies.user')
        .fetch()

      return res.json({
        status: 'success',
        data: tweet
      })
    } catch (error) {
      return res.json({
        status: 'error',
        message: 'No tweet found!'
      })
    }
  }

  /**
   * Replying to a tweet
   * @param req
   * @param params
   * @param auth
   * @param res
   * @returns {STRING|JSON}
   */
  async reply({ req, params, auth, res}) {

    const user = auth.current.user

    const tweet = await Tweet.find(params.id)

    const reply = await Reply.create({
      user_id: user.id,
      tweet_id: tweet.id,
      reply: req.input('reply')
    })

    await reply.load('user')

    return res.json({
      status: 'success',
      message:'Replyed successfully!',
      data: reply
    })
  }

  async destroy({ params, auth, res }) {

    const user = auth.current.user

    await Tweet.query()
      .with('user_id', user.id)
      .with('id', params.id)
      .delete()

    return res.json({
      status: 'success',
      message: 'Tweet deleted!'
    })

  }
}

module.exports = TweetController
