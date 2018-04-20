'use strict'

const Model = use('Model')

class Tweet extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }

  replays () {
    return this.hasMany('App/Models/Replay')
  }

  favorites () {
    return this.hasMany('App/Models/Favorites')
  }
}

module.exports = Tweet
