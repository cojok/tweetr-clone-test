'use strict'

const Model = use('Model')

class Favorite extends Model {
  /**
   * A favorite belongs toa user
   * @returns {Object}
   */
  user () {
    return this.belongsTo('App/Models/User')
  }

  /**
   * A favorite belongs to a tweet
   * @returns {Object}
   */
  tweet () {
    return this.belongsTo('App/Models7Tweet')
  }
}

module.exports = Favorite
