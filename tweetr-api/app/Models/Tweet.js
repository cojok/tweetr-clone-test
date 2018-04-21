'use strict'

const Model = use('Model')

class Tweet extends Model {
  /**
   * A tweet belongs to a user
   * @returns {Obejct}
   */
  user () {
    return this.belongsTo('App/Models/User')
  }

  /**
   * A tweet has many replys
   * @returns {Obejct}
   */
  replys () {
    return this.hasMany('App/Models/Reply')
  }

  /**
   * A tweet can have many favorites
   * @returns {Object}
   */
  favorites () {
    return this.hasMany('App/Models/Favorites')
  }
}

module.exports = Tweet
