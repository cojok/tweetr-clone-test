'use strict'

const Model = use('Model')

class Replay extends Model {
  /**
   * A replay belongs to a user
   * @returns {Object}
   */
  user () {
    return this.belongsTo('App/Models/User')
  }

  /**
   * A replay belings to a tweet
   * @returns {BelongsTo}
   */
  tweet () {
    return this.belongsTo('App/Models/Tweet')
  }
}

module.exports = Replay
