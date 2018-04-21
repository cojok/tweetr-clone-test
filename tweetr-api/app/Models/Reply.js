'use strict'

const Model = use('Model')

class Reply extends Model {
  /**
   * A reply belongs to a user
   * @returns {Object}
   */
  user () {
    return this.belongsTo('App/Models/User')
  }

  /**
   * A reply belongs to a tweet
   * @returns {BelongsTo}
   */
  tweet () {
    return this.belongsTo('App/Models/Tweet')
  }
}

module.exports = Reply
