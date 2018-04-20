'use strict'

const Model = use('Model')

class Favorite extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }

  tweet () {
    return this.belongsTo('App/Models7Tweet')
  }
}

module.exports = Favorite
