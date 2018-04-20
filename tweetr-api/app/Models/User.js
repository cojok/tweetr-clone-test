'use strict'

const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     *
     * Look at `app/Models/Hooks/User.js` file to
     * check the hashPassword method
     */
    this.addHook('beforeCreate', 'User.hashPassword')
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  /**
   * A user can post many tweets
   *
   * @method tweets
   *
   * @return {Object}
   */
  tweets () {
    return this.hasMany('App/Models/Tweet')
  }

  /**
   * A user can have many followers
   *
   * @method followers
   *
   * @return {Object}
   */
  followers () {
    return this.belongsToMany(
      'App/Models/User',
      'user_id',
      'follower_id'
    ).pivotTable('followers')
  }

  /**
   * A user can follow other users
   *
   * @method followers
   *
   * @return {Object}
   */
  following () {
    return this.belongsToMany(
      'App/Models/User',
      'follower_id',
      'user_id'
    ).pivotTable('followers')
  }

  /**
   * A user can post many replies to a tweet.
   *
   * @method replies
   *
   * @return {Object}
   */
  replies () {
    return this.hasMany('App/Models/Replay')
  }

  /**
   * A user can have many favorite tweets.
   *
   * @method favorites
   *
   * @return {Object}
   */
  favorites () {
    return this.hasMany('App/Models/Favorite')
  }
}

module.exports = User
